<?php
// ═══════════════════════════════════════════════════════
// K9 MOVEMENT — Form Submission Handler
// HTML Emails + PDF Generation
// ═══════════════════════════════════════════════════════

require_once __DIR__ . '/fpdf.php';

// ─── CONFIG ───
$TO_EMAIL   = 'info@k9movement.com';
$FROM_EMAIL = 'noreply@form.k9movement.com';
$FROM_NAME  = 'K9 Movement Portal';
$LOGO_PATH  = __DIR__ . '/../k9logo.png';
$LOGO_URL   = ''; // Will be set dynamically below

// ─── RATE LIMITING (5 submissions per IP per hour) ───
$rate_limit_dir = sys_get_temp_dir() . '/k9_rate_limit';
if (!is_dir($rate_limit_dir)) @mkdir($rate_limit_dir, 0755, true);

$client_ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_file = $rate_limit_dir . '/' . md5($client_ip) . '.json';
$max_requests = 5;
$window = 3600;

$now = time();
$requests = [];

if (file_exists($rate_file)) {
    $requests = json_decode(file_get_contents($rate_file), true) ?: [];
    $requests = array_values(array_filter($requests, fn($t) => ($now - $t) < $window));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && count($requests) >= $max_requests) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many submissions. Please try again later.']);
    exit;
}

// ─── CORS ───
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://k9movement.com',
    'https://www.k9movement.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ─── READ JSON BODY ───
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data || (!isset($data['services']) && !isset($data['service']))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid data']);
    exit;
}

// Record this request for rate limiting
$requests[] = $now;
file_put_contents($rate_file, json_encode(array_values($requests)), LOCK_EX);

// ─── DATA EXTRACTION ───
// Pet type: 'dog' (default, also for older clients) or 'other' (cats, guinea pigs...)
$pet_type    = (($data['petType'] ?? 'dog') === 'other') ? 'other' : 'dog';
$is_other    = $pet_type === 'other';
$animal_type = trim((string)($data['animalType'] ?? ''));
$pet_type_display = $is_other
    ? ($animal_type !== '' ? ucfirst($animal_type) : 'Other')
    : 'Dog';

$service_labels = [
    'training-assessment'   => 'Dog Training Assessment',
    'training-application'  => 'Training Application Form',
    'boarding-application'  => $is_other ? 'Sitting & Boarding Application' : 'Walking / Sitting & Boarding Application',
    'walking-agreement'     => 'Dog Walking / Pet Sitting Agreement',
    'waiver-form'           => 'Waiver & Release Form',
];

$ref       = 'K9M-' . strtoupper(substr(base_convert(time(), 10, 36), -6));

// Support both old (single service) and new (multiple services) format
$services_list = $data['services'] ?? [$data['service']];
$service = implode(' + ', array_map(function($s) use ($service_labels) {
    return $service_labels[$s] ?? $s;
}, array_filter($services_list, fn($s) => $s !== 'waiver-form')));

$owner     = $data['owner'] ?? [];
$dog       = $data['dog'] ?? [];
$additional_dogs = $data['additionalDogs'] ?? [];
$all_service_data = $data['allServiceData'] ?? ($data['serviceData'] ? [$data['service'] => $data['serviceData']] : []);
$sig_name  = $data['signatureName'] ?? '';
$sig_date  = $data['signatureDate'] ?? '';
$sig_image = $data['signatureDataURL'] ?? '';
$pet_care  = is_array($data['petCare'] ?? null) ? $data['petCare'] : [];

// Boarding questions that only apply to dogs — never shown for other animals
$dog_only_boarding_fields = ['bite', 'biteDetails', 'fight', 'fightDetails', 'sizeIssue', 'sizeIssueDetails', 'parks', 'parksDetails'];
if ($is_other && isset($all_service_data['boarding-application']) && is_array($all_service_data['boarding-application'])) {
    foreach ($dog_only_boarding_fields as $f) unset($all_service_data['boarding-application'][$f]);
}
// "Toy or food possessive" was removed from the boarding application — ignore it from older clients
if (isset($all_service_data['boarding-application']) && is_array($all_service_data['boarding-application'])) {
    unset($all_service_data['boarding-application']['possessive'], $all_service_data['boarding-application']['possessiveDetails']);
}

// Emergency contact: name + phone (older clients sent one free-text 'emergencyContact')
$emergency_name  = trim((string)($owner['emergencyContactName'] ?? ''));
$emergency_phone = trim((string)($owner['emergencyContactPhone'] ?? ''));
$emergency_legacy = trim((string)($owner['emergencyContact'] ?? ''));
if ($emergency_name === '' && $emergency_phone === '' && $emergency_legacy !== '') {
    $emergency_name = $emergency_legacy;
}

// ─── PHOTO ID (required; JPG/PNG only, max 10MB) ───
// Kept in memory (plus a short-lived file in the system temp dir for the PDF) — never saved to a web folder.
$ID_MAX_BYTES = 10 * 1024 * 1024;
$id_image = null;
$id_raw = $data['idPhotoDataURL'] ?? '';
if (!is_string($id_raw) || $id_raw === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Photo ID is required']);
    exit;
}
if (!preg_match('#^data:image/(jpeg|jpg|png);base64,#i', $id_raw, $m)
    || strlen($id_raw) > (int)ceil($ID_MAX_BYTES * 4 / 3) + 100) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Photo ID must be a JPG or PNG image up to 10MB']);
    exit;
}
$id_bytes = base64_decode(substr($id_raw, strlen($m[0])), true);
$id_info  = ($id_bytes !== false) ? @getimagesizefromstring($id_bytes) : false;
if ($id_bytes === false || strlen($id_bytes) > $ID_MAX_BYTES || !$id_info
    || !in_array($id_info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG], true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Photo ID must be a JPG or PNG image up to 10MB']);
    exit;
}
$id_is_png = $id_info[2] === IMAGETYPE_PNG;
$id_image = [
    'bytes' => $id_bytes,
    'ext'   => $id_is_png ? 'png' : 'jpg',
    'mime'  => $id_is_png ? 'image/png' : 'image/jpeg',
    'w'     => $id_info[0],
    'h'     => $id_info[1],
];
unset($id_raw, $id_bytes, $data['idPhotoDataURL']);

// ─── LOGO BASE64 FOR EMAILS ───
$logo_base64 = '';
$logo_cid = 'k9logo_' . md5(time());
if (file_exists($LOGO_PATH)) {
    $logo_base64 = base64_encode(file_get_contents($LOGO_PATH));
}

// ─── FORMAT SERVICE DETAILS ───
function formatLabel($key) {
    $label = preg_replace('/([A-Z])/', ' $1', $key);
    return ucfirst(trim($label));
}

// Human-readable value (no HTML escaping) — shared by PDF and emails
function plainValue($val) {
    if (is_array($val)) return implode(', ', $val);
    if ($val === true || $val === 'yes') return 'Yes';
    if ($val === 'no') return 'No';
    if ($val === 'unknown') return "Doesn't know";
    return (string)$val;
}

function formatValue($val) {
    return htmlspecialchars(plainValue($val));
}

// ─── LABEL MAPS (field name → human-readable label) ───
$label_maps = [
    'training-assessment' => [
        'goals' => 'Training Goals',
        'source' => 'Where Did You Get Your Dog?',
        'howLong' => 'How Long Have You Had Your Dog?',
        'breedFamiliarity' => 'Familiarity With Breed',
        'reasonsForDog' => 'Reasons For Getting The Dog',
        'principalHandler' => 'Principal Handler',
        'strangerReaction' => 'Reaction To Strangers',
        'temperament' => 'Overall Temperament',
        'fearsYN' => 'Has Fears Or Phobias?',
        'fears' => 'Fears Details',
        'aggression' => 'Aggression Issues',
        'bitten' => 'Has Dog Bitten Another Dog Or Person?',
        'bittenDetails' => 'Biting Incident Details',
        'newEnvironments' => 'Reaction To New Environments',
        'prevTraining' => 'Previous Training?',
        'prevTrainingDetails' => 'Previous Training Details',
        'commands' => 'Known Commands',
        'behaviors' => 'Target Behaviors',
        'frequency' => 'Training Frequency Preference',
        'routine' => 'Daily Routine',
        'physicalActivities' => 'Physical Activities',
        'cognitiveActivities' => 'Cognitive Activities',
        'favoriteActivities' => 'Favorite Activities',
        'interactsAnimals' => 'Interaction With Other Animals',
        'fencedYard' => 'Fenced Yard?',
        'vetName' => 'Vet Name',
        'vetClinicName' => 'Clinic Name',
        'vetPhone' => 'Vet Phone',
        'vetAddress' => 'Vet Address',
        'medicationYN' => 'Currently On Medication?',
        'medication' => 'Medication Details',
        'allergies' => 'Allergies',
        'grooming' => 'Grooming Notes',
        'foodType' => 'Food Type',
        'recentHealthChangesYN' => 'Recent Changes In Health Or Behaviour?',
        'recentHealthChanges' => 'Recent Health Changes Details',
        'vaccinations' => 'Vaccinations Up To Date?',
        'lastVaccDate' => 'Last Vaccination Date',
        'rabiesVaccine' => 'Rabies Vaccine Current?',
        'rabiesDate' => 'Rabies Vaccination Date',
        'heartworm' => 'Heartworm Prevention?',
        'heartwormDetails' => 'Heartworm Details',
        'healthConcernsYN' => 'Health Concerns To Discuss?',
        'healthConcerns' => 'Health Concerns Details',
        'challenges' => 'Challenges',
        'householdChanges' => 'Recent Household Changes',
        'additional' => 'Additional Information',
    ],
    'training-application' => [
        'referral' => 'How Did You Hear About Us?',
        'numberOfDogs' => 'Number Of Dogs Currently Owned',
        'otherAnimalsYN' => 'Other Animals At Home?',
        'otherAnimals' => 'Other Animals Details',
        'howLongOwned' => 'How Long Have You Owned The Dog?',
        'sleepLocation' => 'Where Does Your Dog Sleep At Night?',
        'houseTrained' => 'Is Your Dog House Trained?',
        'aggressionToAnimalsOrPeople' => 'Has Dog Shown Aggression Towards Animals Or People?',
        'feedingArea' => 'Feeding Area In Home',
        'goals' => 'What Do You Hope To Accomplish?',
        'vetName' => 'Vet Name',
        'vetClinicName' => 'Clinic Name',
        'vetPhone' => 'Vet Phone',
        'vetAddress' => 'Vet Address',
        'vaccinations' => 'Current On All Vaccinations Including Rabies?',
        'rabiesDate' => 'Rabies Vaccination Date',
        'dhlpDate' => 'DHLP Vaccination Date',
        'leashWalking' => 'Does Dog Know How To Walk On A Leash?',
        'taskTrimmingNails' => 'Reaction To Trimming Nails',
        'taskGivingPills' => 'Reaction To Giving Pills',
        'taskCleaningEars' => 'Reaction To Cleaning Ears',
        'taskGrooming' => 'Reaction To Grooming',
        'taskBathing' => 'Reaction To Bathing',
        'taskPattingHead' => 'Reaction To Petting',
        'corrTimeOut' => 'Correction Technique: Time Out',
        'corrLeashCorrection' => 'Correction Technique: Leash Correction',
        'corrVerbalScolding' => 'Correction Technique: Verbal Scolding',
        'behaviorProblems' => 'Behavior Problems',
        'aloneDay' => 'Behavior When Left Alone During The Day',
        'aloneEvening' => 'Behavior When Left Alone During The Evening',
        'reactionDeparture' => 'Reaction To Your Departure',
        'reactionHomecoming' => 'Reaction To Your Homecoming',
        'useCrate' => 'Do You Use A Crate?',
        'exhibitCoweringYN' => 'Exhibits Cowering?',
        'exhibitCowering' => 'Cowering Details',
        'exhibitEarBackYN' => 'Exhibits Ears Back?',
        'exhibitEarBack' => 'Ears Back Details',
        'exhibitTailTuckedYN' => 'Exhibits Tail Tucked?',
        'exhibitTailTucked' => 'Tail Tucked Details',
        'exhibitRetreatingYN' => 'Exhibits Retreating?',
        'exhibitRetreating' => 'Retreating Details',
        'exhibitHidingYN' => 'Exhibits Hiding?',
        'exhibitHiding' => 'Hiding Details',
        'exhibitSalivatingYN' => 'Exhibits Excessive Salivating?',
        'exhibitSalivating' => 'Excessive Salivating Details',
        'exhibitPacingYN' => 'Exhibits Pacing?',
        'exhibitPacing' => 'Pacing Details',
        'fearAnxietyInfoYN' => 'Additional Info Regarding Fear Or Anxiety?',
        'fearAnxietyInfo' => 'Fear Or Anxiety Details',
        'fearfulSituationsYN' => 'Situations Where Dog Appears Fearful/Aggressive?',
        'fearfulSituations' => 'Fearful/Aggressive Situations Details',
        'muzzleForSafety' => 'Do You Ever Muzzle Your Dog For Safety?',
        'familyAfraidOfDogYN' => 'Anyone In Family Afraid Of Dog?',
        'familyAfraidOfDog' => 'Family Afraid Details',
        'reactEating' => 'Reaction When Approached While Eating',
        'reactTreatToy' => 'Reaction When Approached With Treat Or Toy',
        'reactScolded' => 'Reaction When Dog Is Scolded',
        'reactPushedOff' => 'Reaction When Removed From Furniture Or Bed',
        'reactSleeping' => 'Reaction When Approached While Sleeping',
        'reactStrangersOutside' => 'Reaction To Strangers Outside Of The House',
        'reactPeopleEntering' => 'Reaction To People Entering House/Yard',
        'reactChildren' => 'Reaction To Children Or Infants',
        'reactInCar' => 'Reaction While In Car To People Outside',
        'reactDogsHome' => 'Reaction To Other Dogs In Your Home',
        'reactDogsOutside' => 'Reaction To Other Dogs Outside Your Home',
        'aggressiveToFamily' => 'Ever Aggressive To Family Members?',
        'bittenPerson' => 'Has Your Dog Ever Bitten A Person?',
        'reportedAnimalControl' => 'Has Dog Been Reported To Animal Control For Biting?',
        'agreeTerms' => 'Agreed To Waiver Terms',
    ],
    'boarding-application' => [
        'bite' => 'Has Dog Attempted To Bite Another Dog Or Person?',
        'biteDetails' => 'Bite Incident Details',
        'fight' => 'Has Dog Been In A Fight With Another Dog?',
        'fightDetails' => 'Fight Details',
        'sizeIssue' => 'Problems With Dogs Smaller Or Larger?',
        'sizeIssueDetails' => 'Size Issue Details',
        'parks' => 'Has Dog Been To Dog Parks?',
        'parksDetails' => 'Dog Park Interaction Details',
        'vetName' => 'Vet Name',
        'vetClinicName' => 'Clinic Name',
        'vetPhone' => 'Vet Phone',
        'vetAddress' => 'Vet Address',
        'medical' => 'Medical Conditions',
        'onMeds' => 'Is Dog Taking Medication?',
        'medsDetails' => 'Medication Details & Schedule',
        'vaccinations' => 'Up To Date On All Vaccinations?',
        'restrictions' => 'Restricted Exercises By Veterinarian',
        'obedience' => 'Has Dog Been To Obedience Classes?',
        'obedienceDetails' => 'Obedience Class Details',
        'referral' => 'How Did You Hear About Us?',
        'effectiveDate' => 'Agreement Effective Date',
        'dogNames' => 'Dog(s) / Pet(s) Names',
        'agreeServiceTerms' => 'Agreed To Service Agreement',
    ],
    'walking-agreement' => [
        'agreementInitials' => 'Initials',
        'effectiveDate' => 'Effective Date',
        'dogNames' => 'Dog Name(s)',
        'agreeTerms' => 'Agreed To Terms & Conditions',
    ],
    'waiver-form' => [
        'waiverInitials' => 'Initials',
        'dogNames' => 'Pet Name(s)',
        'agreeTerms' => 'Agreed To Waiver Terms',
    ],
];

// Pet-generic wording for non-dog submissions
if ($is_other) {
    $label_maps['boarding-application'] = array_merge($label_maps['boarding-application'], [
        'onMeds' => 'Is Pet Taking Medication?',
        'dogNames' => 'Pet(s) Names',
    ]);
}

// Vet fields are asked once in the Pet step; skip identical copies inside service forms
function isDuplicateVetField($key, $val, $pet_care) {
    if (!in_array($key, ['vetName', 'vetClinicName', 'vetPhone'], true)) return false;
    $shared = trim((string)($pet_care[$key] ?? ''));
    return $shared !== '' && is_string($val) && trim($val) === $shared;
}

// Rows for a "Pet Information" section (shared by PDF + admin email)
function petRows($pet, $pet_type_display = null) {
    $rows = [];
    if ($pet_type_display !== null) $rows['Type Of Pet'] = $pet_type_display;
    $rows['Name']   = $pet['name'] ?? '';
    $rows['Breed']  = $pet['breed'] ?? '';
    $rows['Age']    = $pet['age'] ?? '';
    $rows['Gender'] = ucfirst((string)($pet['gender'] ?? ''));
    $rows['Weight'] = $pet['weight'] ?? '';
    $rows['Spayed / Neutered'] = plainValue($pet['spayedNeutered'] ?? '');
    return $rows;
}

// Vet + feeding rows (only the ones that were filled in)
function petCareRows($pet_care) {
    $rows = [];
    foreach ([
        'vetName' => 'Veterinarian',
        'vetClinicName' => 'Vet Clinic',
        'vetPhone' => 'Clinic Phone',
        'feedingInstructions' => 'Feeding Information',
    ] as $key => $label) {
        $v = trim((string)($pet_care[$key] ?? ''));
        if ($v !== '') $rows[$label] = $v;
    }
    return $rows;
}

// Two-column HTML table rows for the emails
function htmlRows($rows) {
    $html = '';
    $labels = array_keys($rows);
    $last = end($labels);
    foreach ($rows as $label => $val) {
        $border = ($label === $last) ? '' : 'border-bottom:1px solid #f0f0f0;';
        $l = htmlspecialchars($label);
        $v = nl2br(htmlspecialchars((string)$val));
        $html .= "<tr><td style='padding:8px 12px;font-weight:600;color:#374151;{$border}width:40%;vertical-align:top;'>{$l}</td><td style='padding:8px 12px;color:#1f2937;{$border}'>{$v}</td></tr>";
    }
    return $html;
}

function getLabelForField($key, $map) {
    if (isset($map[$key])) return $map[$key];
    $label = preg_replace('/([A-Z])/', ' $1', $key);
    return ucfirst(trim($label));
}

// Build details HTML for ALL selected services
$details_rows_html = '';
$details_rows_text = '';
foreach ($all_service_data as $svc_id => $details) {
    $current_label_map = $label_maps[$svc_id] ?? [];
    $svc_title = $service_labels[$svc_id] ?? $svc_id;
    $details_rows_html .= "<tr><td colspan='2' style='padding:12px 12px 4px;font-weight:700;color:#1a3a2a;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #1a3a2a;'>{$svc_title}</td></tr>";
    foreach ($details as $key => $val) {
        if ($val === '' || $val === false || (is_array($val) && empty($val))) continue;
        if (isDuplicateVetField($key, $val, $pet_care)) continue;
        $label = getLabelForField($key, $current_label_map);
        $fval  = nl2br(formatValue($val));
        $details_rows_html .= "<tr><td style='padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;width:40%;vertical-align:top;'>{$label}</td><td style='padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;'>{$fval}</td></tr>";
        $details_rows_text .= "  {$label}: {$fval}\n";
    }
}

// ═══════════════════════════════════════
// GENERATE PDF
// ═══════════════════════════════════════

class K9PDF extends FPDF {
    protected $logoPath;

    function setLogoPath($path) {
        $this->logoPath = $path;
    }

    function Header() {
        // Green header bar
        $this->SetFillColor(26, 58, 42); // green-600
        $this->Rect(0, 0, 210, 45, 'F');

        // Logo
        if ($this->logoPath && file_exists($this->logoPath)) {
            $this->Image($this->logoPath, 15, 6, 33, 33);
        }

        // Title text
        $this->SetTextColor(255, 255, 255);
        $this->SetFont('Helvetica', 'B', 22);
        $this->SetXY(55, 10);
        $this->Cell(0, 10, 'K9 MOVEMENT', 0, 1);
        $this->SetFont('Helvetica', '', 11);
        $this->SetXY(55, 22);
        $this->Cell(0, 8, 'Client Application Record', 0, 1);

        $this->Ln(20);
    }

    function Footer() {
        $this->SetY(-20);
        $this->SetFont('Helvetica', '', 8);
        $this->SetTextColor(156, 163, 175);
        $this->Cell(0, 10, 'K9 Movement  |  Confidential Client Record  |  Page ' . $this->PageNo(), 0, 0, 'C');
    }

    function SectionTitle($title, $keepWith = 20) {
        // Don't leave a heading alone at the bottom of a page
        if ($this->GetY() + 13 + $keepWith > $this->PageBreakTrigger) {
            $this->AddPage();
        }
        $this->SetFont('Helvetica', 'B', 12);
        $this->SetTextColor(26, 58, 42);
        $this->Cell(0, 10, $this->utf8($title), 0, 1);
        // Green underline
        $this->SetDrawColor(26, 58, 42);
        $this->SetLineWidth(0.5);
        $this->Line($this->GetX(), $this->GetY(), $this->GetX() + 180, $this->GetY());
        $this->Ln(3);
    }

    // Label column wraps inside its own width; the value column starts after it.
    // Row height = tallest of the two, so long labels never overlap the answer.
    function InfoRow($label, $value) {
        $labelW = 62;
        $gap    = 4;
        $valueW = 180 - $labelW - $gap;
        $lh     = 5;
        $label  = $this->utf8((string)$label);
        $value  = $this->utf8((string)$value);

        $this->SetFont('Helvetica', 'B', 9);
        $nl = $this->NbLines($labelW, $label);
        $this->SetFont('Helvetica', '', 9);
        $nv = $this->NbLines($valueW, $value);
        $h  = max($nl, $nv, 1) * $lh;

        // Keep the row together on one page when it fits on a page
        $usable = $this->PageBreakTrigger - 50;
        if ($this->GetY() + $h > $this->PageBreakTrigger && $h <= $usable) {
            $this->AddPage();
        }

        $x = $this->lMargin;
        $y = $this->GetY();

        if ($h > $usable) {
            // Extremely long answer: label first, value flows across pages below it
            $this->SetFont('Helvetica', 'B', 9);
            $this->SetTextColor(107, 114, 128);
            $this->MultiCell(180, $lh, $label, 0, 'L');
            $this->SetFont('Helvetica', '', 9);
            $this->SetTextColor(31, 41, 55);
            $this->MultiCell(180, $lh, $value, 0, 'L');
        } else {
            $this->SetFont('Helvetica', 'B', 9);
            $this->SetTextColor(107, 114, 128);
            $this->SetXY($x, $y);
            $this->MultiCell($labelW, $lh, $label, 0, 'L');

            $this->SetFont('Helvetica', '', 9);
            $this->SetTextColor(31, 41, 55);
            $this->SetXY($x + $labelW + $gap, $y);
            $this->MultiCell($valueW, $lh, $value, 0, 'L');
            $this->SetXY($x, $y + $h);
        }

        // Subtle row separator
        $this->SetDrawColor(235, 236, 238);
        $this->SetLineWidth(0.2);
        $this->Line($x, $this->GetY() + 1, $x + 180, $this->GetY() + 1);
        $this->SetY($this->GetY() + 2.5);
    }

    // Number of lines a MultiCell of width $w will take (current font)
    function NbLines($w, $txt) {
        $cw = $this->CurrentFont['cw'];
        $wmax = ($w - 2 * $this->cMargin) * 1000 / $this->FontSize;
        $s = str_replace("\r", '', (string)$txt);
        $nb = strlen($s);
        if ($nb > 0 && $s[$nb - 1] == "\n") $nb--;
        $sep = -1; $i = 0; $j = 0; $l = 0; $nl = 1;
        while ($i < $nb) {
            $c = $s[$i];
            if ($c == "\n") { $i++; $sep = -1; $j = $i; $l = 0; $nl++; continue; }
            if ($c == ' ') $sep = $i;
            $l += $cw[$c] ?? 0;
            if ($l > $wmax) {
                if ($sep == -1) { if ($i == $j) $i++; }
                else $i = $sep + 1;
                $sep = -1; $j = $i; $l = 0; $nl++;
            } else {
                $i++;
            }
        }
        return $nl;
    }

    function utf8($str) {
        return iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $str);
    }

    // Summary box: one row per item (Reference / Service / Date); the service
    // value wraps inside its column and the box height fits its content.
    function RefBadge($ref, $service, $date) {
        $x = 15; $w = 180; $pad = 3.5; $lh = 6; $labelW = 24;
        $valueW = $w - 2 * $pad - $labelW;
        $service = $this->utf8($service);

        $this->SetFont('Helvetica', 'B', 9);
        $serviceLines = $this->NbLines($valueW, $service);
        $h = 2 * $pad + $lh * (2 + $serviceLines);

        $y0 = $this->GetY();
        $this->SetFillColor(237, 246, 240); // green-50
        $this->SetDrawColor(26, 58, 42);
        $this->SetLineWidth(0.3);
        $this->RoundedRect($x, $y0, $w, $h, 3, 'DF');

        $rows = [
            ['Reference:', $this->utf8($ref), [26, 58, 42]],
            ['Service:', $service, [31, 41, 55]],
            ['Date:', $this->utf8($date), [31, 41, 55]],
        ];
        $y = $y0 + $pad;
        foreach ($rows as [$label, $value, $color]) {
            $this->SetXY($x + $pad, $y);
            $this->SetFont('Helvetica', '', 9);
            $this->SetTextColor(107, 114, 128);
            $this->Cell($labelW, $lh, $label, 0, 0);
            $this->SetFont('Helvetica', 'B', 9);
            $this->SetTextColor($color[0], $color[1], $color[2]);
            $this->MultiCell($valueW, $lh, $value, 0, 'L');
            $y = $this->GetY();
        }

        $this->SetY($y0 + $h + 6);
    }

    function RoundedRect($x, $y, $w, $h, $r, $style = '') {
        $k = $this->k;
        $hp = $this->h;
        if ($style == 'F') $op = 'f';
        elseif ($style == 'FD' || $style == 'DF') $op = 'B';
        else $op = 'S';
        $MyArc = 4/3 * (sqrt(2) - 1);
        $this->_out(sprintf('%.2F %.2F m', ($x+$r)*$k, ($hp-$y)*$k));
        $xc = $x+$w-$r;
        $yc = $y+$r;
        $this->_out(sprintf('%.2F %.2F l', $xc*$k, ($hp-$y)*$k));
        $this->_Arc($xc + $r*$MyArc, $yc - $r, $xc + $r, $yc - $r*$MyArc, $xc + $r, $yc);
        $xc = $x+$w-$r;
        $yc = $y+$h-$r;
        $this->_out(sprintf('%.2F %.2F l', ($x+$w)*$k, ($hp-$yc)*$k));
        $this->_Arc($xc + $r, $yc + $r*$MyArc, $xc + $r*$MyArc, $yc + $r, $xc, $yc + $r);
        $xc = $x+$r;
        $yc = $y+$h-$r;
        $this->_out(sprintf('%.2F %.2F l', $xc*$k, ($hp-($y+$h))*$k));
        $this->_Arc($xc - $r*$MyArc, $yc + $r, $xc - $r, $yc + $r*$MyArc, $xc - $r, $yc);
        $xc = $x+$r;
        $yc = $y+$r;
        $this->_out(sprintf('%.2F %.2F l', $x*$k, ($hp-$yc)*$k));
        $this->_Arc($xc - $r, $yc - $r*$MyArc, $xc - $r*$MyArc, $yc - $r, $xc, $yc - $r);
        $this->_out($op);
    }

    function _Arc($x1, $y1, $x2, $y2, $x3, $y3) {
        $h = $this->h;
        $this->_out(sprintf('%.2F %.2F %.2F %.2F %.2F %.2F c', $x1*$this->k, ($h-$y1)*$this->k,
            $x2*$this->k, ($h-$y2)*$this->k, $x3*$this->k, ($h-$y3)*$this->k));
    }
}

$pdf = new K9PDF();
$pdf->setLogoPath($LOGO_PATH);
$pdf->SetMargins(15, 15, 15);
$pdf->SetAutoPageBreak(true, 25);
$pdf->AddPage();

// Reference badge
$pdf->RefBadge($ref, $service, $sig_date);

// Owner info
$pdf->SectionTitle('Owner Information');
$pdf->InfoRow('Full Name', $owner['fullName'] ?? '');
$pdf->InfoRow('Phone', $owner['phone'] ?? '');
$pdf->InfoRow('Email', $owner['email'] ?? '');
$pdf->InfoRow('Address', $owner['address'] ?? '');
$pdf->InfoRow('City', $owner['city'] ?? '');
$pdf->InfoRow('Postal Code', $owner['postalCode'] ?? '');
$pdf->InfoRow('Emergency Contact Name', $emergency_name);
$pdf->InfoRow('Emergency Contact Phone', $emergency_phone);
$pdf->Ln(5);

// Pet info
$pdf->SectionTitle('Pet Information');
foreach (petRows($dog, $pet_type_display) as $label => $val) $pdf->InfoRow($label, $val);
$pdf->Ln(5);

// Additional pets
if (!empty($additional_dogs)) {
    foreach ($additional_dogs as $i => $aDog) {
        $pdf->SectionTitle('Pet #' . ($i + 2) . ' Information');
        foreach (petRows($aDog) as $label => $val) $pdf->InfoRow($label, $val);
        $pdf->Ln(5);
    }
}

// Vet + feeding
$care_rows = petCareRows($pet_care);
if (!empty($care_rows)) {
    $pdf->SectionTitle('Veterinarian & Feeding');
    foreach ($care_rows as $label => $val) $pdf->InfoRow($label, $val);
    $pdf->Ln(5);
}

// Service details (all selected services)
foreach ($all_service_data as $svc_id => $details) {
    $svc_title = $service_labels[$svc_id] ?? $svc_id;
    $current_label_map = $label_maps[$svc_id] ?? [];
    $pdf->SectionTitle($svc_title);
    foreach ($details as $key => $val) {
        if ($val === '' || $val === false || (is_array($val) && empty($val))) continue;
        if (isDuplicateVetField($key, $val, $pet_care)) continue;
        $label = getLabelForField($key, $current_label_map);
        $pdf->InfoRow($label, plainValue($val));
    }
    $pdf->Ln(5);
}

// Signature section (title + 2 rows + signature box kept together)
$pdf->SectionTitle('Signature', !empty($sig_image) ? 70 : 20);
$pdf->InfoRow('Signed by', $sig_name);
$pdf->InfoRow('Date', $sig_date);

// Signature image
if (!empty($sig_image) && strpos($sig_image, 'data:image/png;base64,') === 0) {
    $sig_raw = base64_decode(str_replace('data:image/png;base64,', '', $sig_image));
    $sig_tmp = tempnam(sys_get_temp_dir(), 'k9sig_') . '.png';
    file_put_contents($sig_tmp, $sig_raw);

    $pdf->Ln(3);
    $pdf->SetDrawColor(229, 231, 235);
    $pdf->SetFillColor(249, 250, 251);

    $boxY = $pdf->GetY();
    if ($boxY > 240) {
        $pdf->AddPage();
        $boxY = $pdf->GetY();
    }

    $pdf->RoundedRect(15, $boxY, 100, 40, 2, 'DF');
    $pdf->Image($sig_tmp, 20, $boxY + 5, 90, 30);
    $pdf->Ln(45);

    @unlink($sig_tmp);
}

// Photo ID (embedded on its own page, scaled to fit)
if ($id_image) {
    $id_tmp = tempnam(sys_get_temp_dir(), 'k9id_');
    file_put_contents($id_tmp, $id_image['bytes']);
    try {
        // Fit inside 140 x 110 mm, keeping the aspect ratio
        $ratio = min(140 / $id_image['w'], 110 / $id_image['h']);
        $iw = $id_image['w'] * $ratio;
        $ih = $id_image['h'] * $ratio;
        $pdf->Ln(4);
        $pdf->SectionTitle('Photo ID', $ih + 4);
        $pdf->Image($id_tmp, 15, $pdf->GetY() + 2, $iw, $ih, $id_image['ext'] === 'png' ? 'PNG' : 'JPG');
        $pdf->SetY($pdf->GetY() + $ih + 6);
    } catch (Throwable $e) {
        // Unsupported PNG variant etc. — the image is still attached to the email
        $pdf->InfoRow('Photo ID', 'Attached to the email as an image file.');
    }
    @unlink($id_tmp);
}

// Generate PDF string
$pdf_content = $pdf->Output('S');
$pdf_filename = "K9Movement_{$ref}.pdf";


// ═══════════════════════════════════════
// HTML EMAIL TEMPLATES
// ═══════════════════════════════════════

$owner_name  = htmlspecialchars($owner['fullName'] ?? '');
$owner_email_safe = htmlspecialchars($owner['email'] ?? '');
$owner_phone = htmlspecialchars($owner['phone'] ?? '');
$owner_address = htmlspecialchars($owner['address'] ?? '');
$owner_city = htmlspecialchars($owner['city'] ?? '');
$owner_postal = htmlspecialchars($owner['postalCode'] ?? '');
$owner_emergency_name  = htmlspecialchars($emergency_name);
$owner_emergency_phone = htmlspecialchars($emergency_phone);
$dog_name = htmlspecialchars($dog['name'] ?? '');
$dog_breed = htmlspecialchars($dog['breed'] ?? '');
$dog_age = htmlspecialchars($dog['age'] ?? '');
$dog_gender = htmlspecialchars($dog['gender'] ?? '');
$dog_weight = htmlspecialchars($dog['weight'] ?? '');
$dog_spayed = htmlspecialchars(plainValue($dog['spayedNeutered'] ?? ''));
$pet_rows_html = htmlRows(petRows($dog, $pet_type_display));
$care_rows = petCareRows($pet_care);
$pet_care_html = '';
if (!empty($care_rows)) {
    $care_rows_html = htmlRows($care_rows);
    $pet_care_html = <<<CARE
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Veterinarian &amp; Feeding</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        {$care_rows_html}
      </table>
    </td>
  </tr>
CARE;
}
$pet_word = $is_other ? 'pet' : 'dog';
$pet_summary = $dog_name;
$pet_summary_extra = $is_other
    ? trim(($animal_type !== '' ? ucfirst($animal_type) : 'Pet') . ($dog_breed !== '' ? ', ' . $dog_breed : ''))
    : $dog_breed;
if ($pet_summary_extra !== '') $pet_summary .= ' (' . htmlspecialchars($pet_summary_extra) . ')';

// ─── ADDITIONAL DOGS HTML ───
$additional_dogs_html = '';
if (!empty($additional_dogs)) {
    foreach ($additional_dogs as $i => $aDog) {
        $num = $i + 2;
        $aRows = htmlRows(petRows($aDog));
        $additional_dogs_html .= <<<ADOG
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Pet #{$num} Information</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        {$aRows}
      </table>
    </td>
  </tr>
ADOG;
    }
}

// ─── ADMIN EMAIL (HTML + PDF attachment) ───
$admin_html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <tr>
    <td style="background: linear-gradient(135deg, #1a3a2a 0%, #0f2318 100%); padding:35px 40px; text-align:center;">
      <img src="cid:{$logo_cid}" width="180" height="180" alt="K9 Movement" style="border-radius:50%;border:3px solid rgba(255,255,255,0.3);">
      <p style="color:rgba(255,255,255,0.85);margin:12px 0 0;font-size:14px;">New Client Application Received</p>
    </td>
  </tr>

  <!-- REF BADGE -->
  <tr>
    <td style="padding:25px 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#edf6f0;border:1px solid #c4e2d0;border-radius:8px;">
        <tr>
          <td style="padding:15px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td><span style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Reference</span><br><strong style="font-size:16px;color:#1a3a2a;">{$ref}</strong></td>
                <td align="right"><span style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Service</span><br><strong style="font-size:14px;color:#1f2937;">{$service}</strong></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- OWNER INFO -->
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Owner Information</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;width:40%;">Full Name</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner_name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Phone</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner_phone}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Email</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;"><a href="mailto:{$owner_email_safe}" style="color:#1a3a2a;">{$owner_email_safe}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Address</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner_address}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">City</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner_city}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Postal Code</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner_postal}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Emergency Contact Name</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner_emergency_name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;">Emergency Contact Phone</td><td style="padding:8px 12px;color:#1f2937;">{$owner_emergency_phone}</td></tr>
      </table>
    </td>
  </tr>

  <!-- PET INFO -->
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Pet Information</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        {$pet_rows_html}
      </table>
    </td>
  </tr>

  {$additional_dogs_html}

  {$pet_care_html}

  <!-- SERVICE DETAILS -->
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Service Details</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        {$details_rows_html}
      </table>
    </td>
  </tr>

  <!-- SIGNATURE -->
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Signature</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;width:40%;">Signed by</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$sig_name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;">Date</td><td style="padding:8px 12px;color:#1f2937;">{$sig_date}</td></tr>
      </table>
    </td>
  </tr>

  <!-- PDF NOTE -->
  <tr>
    <td style="padding:25px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
        <tr>
          <td style="padding:15px 20px;font-size:13px;color:#1e40af;">
            &#128206; <strong>PDF attached</strong> — The complete application with the client's digital signature and photo ID is attached to this email as a PDF document. The photo ID is also attached as a separate image.
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">K9 Movement Portal &bull; Automated Notification</p>
      <p style="margin:4px 0 0;font-size:11px;color:#d1d5db;">Reply to this email to contact the client directly.</p>
    </td>
  </tr>

</table>
</td></tr></table>
</body>
</html>
HTML;


// ─── CLIENT EMAIL (HTML, no PDF) ───
$client_html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <tr>
    <td style="background: linear-gradient(135deg, #1a3a2a 0%, #0f2318 100%); padding:35px 40px; text-align:center;">
      <img src="cid:{$logo_cid}" width="180" height="180" alt="K9 Movement" style="border-radius:50%;border:3px solid rgba(255,255,255,0.3);">
      <p style="color:rgba(255,255,255,0.85);margin:12px 0 0;font-size:13px;letter-spacing:0.5px;">Professional Dog Training &amp; Care</p>
    </td>
  </tr>

  <!-- GREETING -->
  <tr>
    <td style="padding:35px 40px 0;">
      <h2 style="margin:0 0 8px;font-size:22px;color:#1f2937;">Thank you, {$owner_name}!</h2>
      <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.6;">We have received your application and our team is reviewing it. You will hear from us within <strong style="color:#1a3a2a;">24-48 business hours</strong>.</p>
    </td>
  </tr>

  <!-- SUMMARY CARD -->
  <tr>
    <td style="padding:25px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#edf6f0;border:1px solid #c4e2d0;border-radius:10px;">
        <tr>
          <td style="padding:20px 25px;">
            <p style="margin:0 0 4px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Your Application</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-top:10px;">
              <tr>
                <td style="padding:6px 0;color:#374151;font-weight:600;width:35%;">Reference</td>
                <td style="padding:6px 0;color:#1a3a2a;font-weight:700;font-size:16px;">{$ref}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#374151;font-weight:600;">Service</td>
                <td style="padding:6px 0;color:#1f2937;">{$service}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#374151;font-weight:600;">Date</td>
                <td style="padding:6px 0;color:#1f2937;">{$sig_date}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#374151;font-weight:600;">Pet</td>
                <td style="padding:6px 0;color:#1f2937;">{$pet_summary}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- WHAT'S NEXT -->
  <tr>
    <td style="padding:0 40px 25px;">
      <h3 style="margin:0 0 12px;font-size:15px;color:#1f2937;">What happens next?</h3>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:30px;"><span style="display:inline-block;width:24px;height:24px;background-color:#1a3a2a;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;">1</span></td>
          <td style="padding:8px 0 8px 8px;color:#374151;">Our team reviews your application</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:30px;"><span style="display:inline-block;width:24px;height:24px;background-color:#1a3a2a;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;">2</span></td>
          <td style="padding:8px 0 8px 8px;color:#374151;">We contact you to schedule a consultation</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:30px;"><span style="display:inline-block;width:24px;height:24px;background-color:#1a3a2a;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;">3</span></td>
          <td style="padding:8px 0 8px 8px;color:#374151;">We begin working with you and your {$pet_word}!</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 40px 30px;text-align:center;">
      <p style="margin:0 0 15px;font-size:14px;color:#6b7280;">Have questions? Don't hesitate to reach out.</p>
      <a href="mailto:info@k9movement.com" style="display:inline-block;background-color:#1a3a2a;color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:8px;font-size:14px;font-weight:600;">Contact Us</a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background-color:#f9fafb;padding:25px 40px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:13px;color:#6b7280;font-weight:600;">K9 Movement</p>
      <p style="margin:6px 0 0;font-size:11px;color:#9ca3af;">Professional Dog Training &amp; Care Services</p>
      <p style="margin:8px 0 0;font-size:11px;color:#d1d5db;">This is an automated confirmation. Please keep this email for your records.</p>
    </td>
  </tr>

</table>
</td></tr></table>
</body>
</html>
HTML;


// ═══════════════════════════════════════
// SEND EMAILS (MIME MULTIPART)
// ═══════════════════════════════════════

$boundary_mixed   = '----=_Part_' . md5(uniqid(time()));
$boundary_related = '----=_Rel_' . md5(uniqid(time() . 'rel'));

// ─── ADMIN EMAIL (HTML + embedded logo + PDF attachment) ───
$admin_subject = "=?UTF-8?B?" . base64_encode("New Application: {$owner['fullName']} — {$service} — {$ref}") . "?=";

$admin_headers = implode("\r\n", [
    "From: {$FROM_NAME} <{$FROM_EMAIL}>",
    "Reply-To: {$owner['fullName']} <{$owner['email']}>",
    "MIME-Version: 1.0",
    "Content-Type: multipart/mixed; boundary=\"{$boundary_mixed}\"",
    "X-Mailer: K9Movement-Portal/2.0",
]);

$admin_body = "--{$boundary_mixed}\r\n";
$admin_body .= "Content-Type: multipart/related; boundary=\"{$boundary_related}\"\r\n\r\n";

// HTML part
$admin_body .= "--{$boundary_related}\r\n";
$admin_body .= "Content-Type: text/html; charset=UTF-8\r\n";
$admin_body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$admin_body .= chunk_split(base64_encode($admin_html)) . "\r\n";

// Logo inline image
if ($logo_base64) {
    $admin_body .= "--{$boundary_related}\r\n";
    $admin_body .= "Content-Type: image/png\r\n";
    $admin_body .= "Content-Transfer-Encoding: base64\r\n";
    $admin_body .= "Content-ID: <{$logo_cid}>\r\n";
    $admin_body .= "Content-Disposition: inline; filename=\"k9logo.png\"\r\n\r\n";
    $admin_body .= chunk_split($logo_base64) . "\r\n";
}

$admin_body .= "--{$boundary_related}--\r\n\r\n";

// PDF attachment
$admin_body .= "--{$boundary_mixed}\r\n";
$admin_body .= "Content-Type: application/pdf; name=\"{$pdf_filename}\"\r\n";
$admin_body .= "Content-Transfer-Encoding: base64\r\n";
$admin_body .= "Content-Disposition: attachment; filename=\"{$pdf_filename}\"\r\n\r\n";
$admin_body .= chunk_split(base64_encode($pdf_content)) . "\r\n";

// Photo ID attachment
if ($id_image) {
    $id_filename = "K9Movement_{$ref}_PhotoID.{$id_image['ext']}";
    $admin_body .= "--{$boundary_mixed}\r\n";
    $admin_body .= "Content-Type: {$id_image['mime']}; name=\"{$id_filename}\"\r\n";
    $admin_body .= "Content-Transfer-Encoding: base64\r\n";
    $admin_body .= "Content-Disposition: attachment; filename=\"{$id_filename}\"\r\n\r\n";
    $admin_body .= chunk_split(base64_encode($id_image['bytes'])) . "\r\n";
}

$admin_body .= "--{$boundary_mixed}--";

$sent = mail($TO_EMAIL, $admin_subject, $admin_body, $admin_headers);


// ─── CLIENT EMAIL (HTML + embedded logo, no PDF) ───
if ($sent && !empty($owner['email'])) {
    $client_boundary_mixed   = '----=_CPart_' . md5(uniqid(time() . 'c'));
    $client_boundary_related = '----=_CRel_' . md5(uniqid(time() . 'cr'));

    $client_subject = "=?UTF-8?B?" . base64_encode("K9 Movement — Application Received ({$ref})") . "?=";

    $client_headers = implode("\r\n", [
        "From: {$FROM_NAME} <{$FROM_EMAIL}>",
        "Reply-To: {$FROM_EMAIL}",
        "MIME-Version: 1.0",
        "Content-Type: multipart/related; boundary=\"{$client_boundary_related}\"",
        "X-Mailer: K9Movement-Portal/2.0",
    ]);

    $client_body = "--{$client_boundary_related}\r\n";
    $client_body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $client_body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $client_body .= chunk_split(base64_encode($client_html)) . "\r\n";

    // Logo inline
    if ($logo_base64) {
        $client_body .= "--{$client_boundary_related}\r\n";
        $client_body .= "Content-Type: image/png\r\n";
        $client_body .= "Content-Transfer-Encoding: base64\r\n";
        $client_body .= "Content-ID: <{$logo_cid}>\r\n";
        $client_body .= "Content-Disposition: inline; filename=\"k9logo.png\"\r\n\r\n";
        $client_body .= chunk_split($logo_base64) . "\r\n";
    }

    $client_body .= "--{$client_boundary_related}--";

    mail($owner['email'], $client_subject, $client_body, $client_headers);
}


// ─── RESPONSE ───
if ($sent) {
    echo json_encode(['success' => true, 'ref' => $ref]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email']);
}

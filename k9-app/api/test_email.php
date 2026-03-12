<?php
// ═══ K9 MOVEMENT — Test Email Script ═══
// Run this on your PHP server: php test_email.php
// Or visit: https://your-domain.com/api/test_email.php

// Simulate POST request to send.php
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['HTTP_ORIGIN'] = 'https://k9movement.com';

$test_data = [
    'service' => 'training-assessment',
    'owner' => [
        'fullName'         => 'Ivan Test Client',
        'phone'            => '(416) 555-0199',
        'email'            => 'ivanjalid2@gmail.com',
        'address'          => '123 Test Street',
        'city'             => 'Toronto',
        'postalCode'       => 'M5V 2T6',
        'emergencyContact' => 'Emergency Person (416) 555-0000',
    ],
    'dog' => [
        'name'           => 'Buddy',
        'breed'          => 'Golden Retriever',
        'age'            => '3 years',
        'gender'         => 'male',
        'weight'         => '65 lbs',
        'spayedNeutered' => 'yes',
    ],
    'serviceData' => [
        'goals'               => 'Basic obedience and leash training',
        'source'              => 'Breeder',
        'howLong'             => '2 years',
        'breedFamiliarity'    => 'Very familiar',
        'temperament'         => 'Friendly and energetic',
        'fears'               => 'Loud noises',
        'aggression'          => 'None',
        'bitten'              => 'no',
        'commands'            => 'Sit, Stay, Come',
        'vaccinations'        => 'yes',
        'rabiesVaccine'       => 'yes',
    ],
    'signatureName'    => 'Ivan Test Client',
    'signatureDate'    => date('Y-m-d'),
    'signatureDataURL' => '',
];

// Override php://input with test data
// We need to write test data to a temp stream
$json = json_encode($test_data);

// Create a custom stream wrapper to override php://input
class TestInputStream {
    private $position = 0;
    private static $data = '';

    public static function setData($data) {
        self::$data = $data;
    }

    public function stream_open($path, $mode, $options, &$opened_path) {
        $this->position = 0;
        return true;
    }

    public function stream_read($count) {
        $ret = substr(self::$data, $this->position, $count);
        $this->position += strlen($ret);
        return $ret;
    }

    public function stream_eof() {
        return $this->position >= strlen(self::$data);
    }

    public function stream_stat() {
        return ['size' => strlen(self::$data)];
    }
}

// Register custom stream and override php://input behavior
// Since we can't override php://input, we'll just include the logic directly

echo "=== K9 MOVEMENT TEST EMAIL ===\n\n";
echo "Admin email:  ivanjalid@gmail.com\n";
echo "Client email: ivanjalid2@gmail.com\n";
echo "Service:      Dog Training Assessment\n";
echo "Client name:  Ivan Test Client\n\n";

// Write test data to a temp file and use it
$tmp = tempnam(sys_get_temp_dir(), 'k9test_');
file_put_contents($tmp, $json);

// Monkey-patch: replace file_get_contents('php://input') by including send.php
// Instead, let's just do a local HTTP request if possible, or run the logic directly

// Direct approach: extract the core logic
require_once __DIR__ . '/fpdf.php';

$TO_EMAIL   = 'ivanjalid@gmail.com';
$FROM_EMAIL = 'noreply@k9movement.com';
$FROM_NAME  = 'K9 Movement Portal';
$LOGO_PATH  = __DIR__ . '/../k9logo.png';

$data = $test_data;
$service_labels = [
    'training-assessment'   => 'Dog Training Assessment',
    'training-application'  => 'Training Application Form',
    'boarding-application'  => 'Walking / Sitting & Boarding Application',
    'walking-agreement'     => 'Dog Walking / Pet Sitting Agreement',
    'waiver-form'           => 'Walking / Sitting / Boarding Waiver',
];

$ref       = 'K9M-' . strtoupper(substr(base_convert(time(), 10, 36), -6));
$service   = $service_labels[$data['service']] ?? $data['service'];
$owner     = $data['owner'];
$dog       = $data['dog'];
$details   = $data['serviceData'];
$sig_name  = $data['signatureName'];
$sig_date  = $data['signatureDate'];
$sig_image = $data['signatureDataURL'];

$logo_base64 = '';
$logo_cid = 'k9logo_' . md5(time());
if (file_exists($LOGO_PATH)) {
    $logo_base64 = base64_encode(file_get_contents($LOGO_PATH));
}

// Include send.php label maps and functions
$label_maps = [
    'training-assessment' => [
        'goals' => 'Training Goals',
        'source' => 'Where Did You Get Your Dog?',
        'howLong' => 'How Long Have You Had Your Dog?',
        'breedFamiliarity' => 'Familiarity With Breed',
        'temperament' => 'Overall Temperament',
        'fears' => 'Fears',
        'aggression' => 'Aggression Issues',
        'bitten' => 'Has Dog Bitten Another Dog Or Person?',
        'commands' => 'Known Commands',
        'vaccinations' => 'Vaccinations Up To Date?',
        'rabiesVaccine' => 'Rabies Vaccine Current?',
    ],
];

$service_id = $data['service'];
$current_label_map = $label_maps[$service_id] ?? [];

function formatLabel($key) {
    $label = preg_replace('/([A-Z])/', ' $1', $key);
    return ucfirst(trim($label));
}

function formatValue($val) {
    if (is_array($val)) return htmlspecialchars(implode(', ', $val));
    if ($val === true || $val === 'yes') return 'Yes';
    if ($val === 'no') return 'No';
    return htmlspecialchars($val);
}

function getLabelForField($key, $map) {
    if (isset($map[$key])) return $map[$key];
    $label = preg_replace('/([A-Z])/', ' $1', $key);
    return ucfirst(trim($label));
}

$details_rows_html = '';
foreach ($details as $key => $val) {
    if ($val === '' || $val === false || (is_array($val) && empty($val))) continue;
    $label = getLabelForField($key, $current_label_map);
    $fval  = formatValue($val);
    $details_rows_html .= "<tr><td style='padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;width:40%;vertical-align:top;'>{$label}</td><td style='padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;'>{$fval}</td></tr>";
}

$owner_name  = htmlspecialchars($owner['fullName']);
$owner_email_safe = htmlspecialchars($owner['email']);
$owner_phone = htmlspecialchars($owner['phone']);

// ═══ GENERATE PDF ═══
class K9PDF extends FPDF {
    protected $logoPath;
    function setLogoPath($path) { $this->logoPath = $path; }
    function Header() {
        $this->SetFillColor(26, 58, 42);
        $this->Rect(0, 0, 210, 45, 'F');
        if ($this->logoPath && file_exists($this->logoPath)) {
            $this->Image($this->logoPath, 15, 6, 33, 33);
        }
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
    function SectionTitle($title) {
        $this->SetFont('Helvetica', 'B', 12);
        $this->SetTextColor(26, 58, 42);
        $this->Cell(0, 10, $this->utf8($title), 0, 1);
        $this->SetDrawColor(26, 58, 42);
        $this->SetLineWidth(0.5);
        $this->Line($this->GetX(), $this->GetY(), $this->GetX() + 180, $this->GetY());
        $this->Ln(3);
    }
    function InfoRow($label, $value) {
        $this->SetFont('Helvetica', 'B', 9);
        $this->SetTextColor(107, 114, 128);
        $this->Cell(55, 6, $this->utf8($label), 0, 0);
        $this->SetFont('Helvetica', '', 9);
        $this->SetTextColor(31, 41, 55);
        $this->MultiCell(125, 6, $this->utf8($value), 0);
        $this->Ln(1);
    }
    function utf8($str) {
        return iconv('UTF-8', 'ISO-8859-1//TRANSLIT//IGNORE', $str);
    }
    function RefBadge($ref, $service, $date) {
        $this->SetFont('Helvetica', 'B', 10);
        $this->SetTextColor(31, 41, 55);
        $this->SetFillColor(237, 246, 240);
        $this->SetDrawColor(26, 58, 42);
        $this->RoundedRect(15, $this->GetY(), 180, 22, 3, 'DF');
        $y = $this->GetY() + 3;
        $this->SetXY(20, $y);
        $this->SetFont('Helvetica', '', 9);
        $this->SetTextColor(107, 114, 128);
        $this->Cell(25, 6, 'Reference:', 0, 0);
        $this->SetFont('Helvetica', 'B', 9);
        $this->SetTextColor(26, 58, 42);
        $this->Cell(40, 6, $this->utf8($ref), 0, 0);
        $this->SetFont('Helvetica', '', 9);
        $this->SetTextColor(107, 114, 128);
        $this->Cell(20, 6, 'Service:', 0, 0);
        $this->SetFont('Helvetica', 'B', 9);
        $this->SetTextColor(31, 41, 55);
        $this->Cell(55, 6, $this->utf8($service), 0, 0);
        $this->SetFont('Helvetica', '', 9);
        $this->SetTextColor(107, 114, 128);
        $this->Cell(12, 6, 'Date:', 0, 0);
        $this->SetFont('Helvetica', 'B', 9);
        $this->SetTextColor(31, 41, 55);
        $this->Cell(0, 6, $this->utf8($date), 0, 1);
        $this->Ln(12);
    }
    function RoundedRect($x, $y, $w, $h, $r, $style = '') {
        $k = $this->k; $hp = $this->h;
        if ($style == 'F') $op = 'f'; elseif ($style == 'FD' || $style == 'DF') $op = 'B'; else $op = 'S';
        $MyArc = 4/3 * (sqrt(2) - 1);
        $this->_out(sprintf('%.2F %.2F m', ($x+$r)*$k, ($hp-$y)*$k));
        $xc = $x+$w-$r; $yc = $y+$r;
        $this->_out(sprintf('%.2F %.2F l', $xc*$k, ($hp-$y)*$k));
        $this->_Arc($xc + $r*$MyArc, $yc - $r, $xc + $r, $yc - $r*$MyArc, $xc + $r, $yc);
        $xc = $x+$w-$r; $yc = $y+$h-$r;
        $this->_out(sprintf('%.2F %.2F l', ($x+$w)*$k, ($hp-$yc)*$k));
        $this->_Arc($xc + $r, $yc + $r*$MyArc, $xc + $r*$MyArc, $yc + $r, $xc, $yc + $r);
        $xc = $x+$r; $yc = $y+$h-$r;
        $this->_out(sprintf('%.2F %.2F l', $xc*$k, ($hp-($y+$h))*$k));
        $this->_Arc($xc - $r*$MyArc, $yc + $r, $xc - $r, $yc + $r*$MyArc, $xc - $r, $yc);
        $xc = $x+$r; $yc = $y+$r;
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
$pdf->SetAutoPageBreak(true, 25);
$pdf->AddPage();
$pdf->RefBadge($ref, $service, $sig_date);

$pdf->SectionTitle('Owner Information');
$pdf->InfoRow('Full Name', $owner['fullName']);
$pdf->InfoRow('Phone', $owner['phone']);
$pdf->InfoRow('Email', $owner['email']);
$pdf->InfoRow('Address', $owner['address']);
$pdf->InfoRow('City', $owner['city']);
$pdf->InfoRow('Postal Code', $owner['postalCode']);
$pdf->InfoRow('Emergency Contact', $owner['emergencyContact']);
$pdf->Ln(5);

$pdf->SectionTitle('Dog Information');
$pdf->InfoRow('Name', $dog['name']);
$pdf->InfoRow('Breed', $dog['breed']);
$pdf->InfoRow('Age', $dog['age']);
$pdf->InfoRow('Gender', $dog['gender']);
$pdf->InfoRow('Weight', $dog['weight']);
$pdf->InfoRow('Spayed / Neutered', $dog['spayedNeutered']);
$pdf->Ln(5);

$pdf->SectionTitle('Service Details - ' . $service);
foreach ($details as $key => $val) {
    if ($val === '' || $val === false || (is_array($val) && empty($val))) continue;
    $label = getLabelForField($key, $current_label_map);
    $fval = is_array($val) ? implode(', ', $val) : ($val === true || $val === 'yes' ? 'Yes' : ($val === 'no' ? 'No' : $val));
    $pdf->InfoRow($label, $fval);
}
$pdf->Ln(5);
$pdf->SectionTitle('Signature');
$pdf->InfoRow('Signed by', $sig_name);
$pdf->InfoRow('Date', $sig_date);

$pdf_content = $pdf->Output('S');
$pdf_filename = "K9Movement_{$ref}.pdf";

// ═══ EMAIL TEMPLATES ═══
$admin_html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr>
    <td style="background: linear-gradient(135deg, #1a3a2a 0%, #0f2318 100%); padding:30px 40px; text-align:center;">
      <img src="cid:{$logo_cid}" width="70" height="70" alt="K9 Movement" style="border-radius:50%;margin-bottom:12px;border:3px solid rgba(255,255,255,0.3);">
      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:1px;">K9 MOVEMENT</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">New Client Application Received</p>
    </td>
  </tr>
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
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Owner Information</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;width:40%;">Full Name</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner_name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Phone</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner_phone}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Email</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;"><a href="mailto:{$owner_email_safe}" style="color:#1a3a2a;">{$owner_email_safe}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Address</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner['address']}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">City</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner['city']}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Postal Code</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$owner['postalCode']}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;">Emergency Contact</td><td style="padding:8px 12px;color:#1f2937;">{$owner['emergencyContact']}</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Dog Information</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;width:40%;">Name</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$dog['name']}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Breed</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$dog['breed']}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Age</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$dog['age']}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Gender</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$dog['gender']}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Weight</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$dog['weight']}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;">Spayed / Neutered</td><td style="padding:8px 12px;color:#1f2937;">{$dog['spayedNeutered']}</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Service Details</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        {$details_rows_html}
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#1a3a2a;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #1a3a2a;padding-bottom:8px;">Signature</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;width:40%;">Signed by</td><td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$sig_name}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:600;color:#374151;">Date</td><td style="padding:8px 12px;color:#1f2937;">{$sig_date}</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:25px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;">
        <tr>
          <td style="padding:15px 20px;font-size:13px;color:#1e40af;">
            &#128206; <strong>PDF attached</strong> — The complete application with the client's digital signature is attached to this email as a PDF document.
          </td>
        </tr>
      </table>
    </td>
  </tr>
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

$client_html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:20px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <tr>
    <td style="background: linear-gradient(135deg, #1a3a2a 0%, #0f2318 100%); padding:35px 40px; text-align:center;">
      <img src="cid:{$logo_cid}" width="70" height="70" alt="K9 Movement" style="border-radius:50%;margin-bottom:12px;border:3px solid rgba(255,255,255,0.3);">
      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:700;letter-spacing:1px;">K9 MOVEMENT</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;letter-spacing:0.5px;">Professional Dog Training &amp; Care</p>
    </td>
  </tr>
  <tr>
    <td style="padding:35px 40px 0;">
      <h2 style="margin:0 0 8px;font-size:22px;color:#1f2937;">Thank you, {$owner_name}!</h2>
      <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.6;">We have received your application and our team is reviewing it. You will hear from us within <strong style="color:#1a3a2a;">24-48 business hours</strong>.</p>
    </td>
  </tr>
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
                <td style="padding:6px 0;color:#374151;font-weight:600;">Dog</td>
                <td style="padding:6px 0;color:#1f2937;">{$dog['name']} ({$dog['breed']})</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
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
          <td style="padding:8px 0 8px 8px;color:#374151;">We begin working with you and your dog!</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px 30px;text-align:center;">
      <p style="margin:0 0 15px;font-size:14px;color:#6b7280;">Have questions? Don't hesitate to reach out.</p>
      <a href="mailto:{$FROM_EMAIL}" style="display:inline-block;background-color:#1a3a2a;color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:8px;font-size:14px;font-weight:600;">Contact Us</a>
    </td>
  </tr>
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

// ═══ SEND EMAILS ═══
$boundary_mixed   = '----=_Part_' . md5(uniqid(time()));
$boundary_related = '----=_Rel_' . md5(uniqid(time() . 'rel'));

// Admin email
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

$admin_body .= "--{$boundary_related}\r\n";
$admin_body .= "Content-Type: text/html; charset=UTF-8\r\n";
$admin_body .= "Content-Transfer-Encoding: base64\r\n\r\n";
$admin_body .= chunk_split(base64_encode($admin_html)) . "\r\n";

if ($logo_base64) {
    $admin_body .= "--{$boundary_related}\r\n";
    $admin_body .= "Content-Type: image/png\r\n";
    $admin_body .= "Content-Transfer-Encoding: base64\r\n";
    $admin_body .= "Content-ID: <{$logo_cid}>\r\n";
    $admin_body .= "Content-Disposition: inline; filename=\"k9logo.png\"\r\n\r\n";
    $admin_body .= chunk_split($logo_base64) . "\r\n";
}

$admin_body .= "--{$boundary_related}--\r\n\r\n";

$admin_body .= "--{$boundary_mixed}\r\n";
$admin_body .= "Content-Type: application/pdf; name=\"{$pdf_filename}\"\r\n";
$admin_body .= "Content-Transfer-Encoding: base64\r\n";
$admin_body .= "Content-Disposition: attachment; filename=\"{$pdf_filename}\"\r\n\r\n";
$admin_body .= chunk_split(base64_encode($pdf_content)) . "\r\n";

$admin_body .= "--{$boundary_mixed}--";

echo "Sending ADMIN email to {$TO_EMAIL}...\n";
$sent_admin = mail($TO_EMAIL, $admin_subject, $admin_body, $admin_headers);
echo $sent_admin ? "  -> ADMIN email SENT OK\n" : "  -> ADMIN email FAILED\n";

// Client email
if ($sent_admin) {
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

    if ($logo_base64) {
        $client_body .= "--{$client_boundary_related}\r\n";
        $client_body .= "Content-Type: image/png\r\n";
        $client_body .= "Content-Transfer-Encoding: base64\r\n";
        $client_body .= "Content-ID: <{$logo_cid}>\r\n";
        $client_body .= "Content-Disposition: inline; filename=\"k9logo.png\"\r\n\r\n";
        $client_body .= chunk_split($logo_base64) . "\r\n";
    }

    $client_body .= "--{$client_boundary_related}--";

    $client_email = 'ivanjalid2@gmail.com';
    echo "Sending CLIENT email to {$client_email}...\n";
    $sent_client = mail($client_email, $client_subject, $client_body, $client_headers);
    echo $sent_client ? "  -> CLIENT email SENT OK\n" : "  -> CLIENT email FAILED\n";
}

echo "\nRef: {$ref}\n";
echo "Done.\n";

@unlink($tmp);

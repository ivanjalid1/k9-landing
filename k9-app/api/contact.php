<?php
// ═══════════════════════════════════════════════════════
// K9 MOVEMENT — Contact Form Handler
// HTML Emails + Embedded Logo (No PDF)
// ═══════════════════════════════════════════════════════

// ─── CONFIG ───
$TO_EMAIL   = 'ivanjalid@gmail.com';
$FROM_EMAIL = 'noreply@form.k9movement.com';
$FROM_NAME  = 'K9 Movement Website';
$LOGO_PATH  = __DIR__ . '/../k9logo.png';

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

// ─── RATE LIMITING (10 per IP per hour) ───
$rate_dir = sys_get_temp_dir() . '/k9_contact_rate';
if (!is_dir($rate_dir)) @mkdir($rate_dir, 0755, true);

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_file = $rate_dir . '/' . md5($ip) . '.json';
$now = time();
$requests = [];

if (file_exists($rate_file)) {
    $requests = json_decode(file_get_contents($rate_file), true) ?: [];
    $requests = array_values(array_filter($requests, fn($t) => ($now - $t) < 3600));
}

if (count($requests) >= 10) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Too many requests. Please try again later.']);
    exit;
}

$requests[] = $now;
file_put_contents($rate_file, json_encode(array_values($requests)), LOCK_EX);

// ─── PARSE INPUT ───
$input = json_decode(file_get_contents('php://input'), true);

$name    = trim($input['name'] ?? '');
$email   = trim($input['email'] ?? '');
$phone   = trim($input['phone'] ?? '');
$service = trim($input['service'] ?? '');
$message = trim($input['message'] ?? '');

// ─── VALIDATE ───
if (!$name || !$email || !$service) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, email, and service are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']);
    exit;
}

// Sanitize
$name    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// ─── REFERENCE NUMBER ───
$ref  = 'K9C-' . strtoupper(substr(base_convert(time(), 10, 36), -4)) . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 3));
$date = date('F j, Y \a\t g:i A');

// ─── LOGO BASE64 FOR EMAILS ───
$logo_base64 = '';
$logo_cid = 'k9logo_' . md5(time());
if (file_exists($LOGO_PATH)) {
    $logo_base64 = base64_encode(file_get_contents($LOGO_PATH));
}

// ═══════════════════════════════════════
// ADMIN EMAIL (Full contact details + logo)
// ═══════════════════════════════════════

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
      <img src="cid:{$logo_cid}" width="140" height="140" alt="K9 Movement" style="border-radius:50%;border:3px solid rgba(255,255,255,0.3);">
      <p style="color:rgba(255,255,255,0.85);margin:12px 0 0;font-size:14px;">New Contact Form Inquiry</p>
    </td>
  </tr>

  <!-- REF BADGE -->
  <tr>
    <td style="padding:25px 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8EB;border:1px solid #F0D9A0;border-radius:8px;">
        <tr>
          <td style="padding:15px 20px;">
            <div style="margin-bottom:10px;">
              <span style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Reference</span><br>
              <strong style="font-size:16px;color:#92400e;">{$ref}</strong>
            </div>
            <div>
              <span style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Type</span><br>
              <strong style="font-size:13px;color:#92400e;">Contact Inquiry</strong>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CONTACT DETAILS -->
  <tr>
    <td style="padding:25px 40px 0;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#92400e;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #E8A838;padding-bottom:8px;">Contact Details</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
        <tr>
          <td style="padding:10px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;width:35%;">Full Name</td>
          <td style="padding:10px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;"><strong>{$name}</strong></td>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Email</td>
          <td style="padding:10px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;"><a href="mailto:{$email}" style="color:#E8A838;font-weight:600;">{$email}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Phone</td>
          <td style="padding:10px 12px;color:#1f2937;border-bottom:1px solid #f0f0f0;">{$phone}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-weight:600;color:#374151;border-bottom:1px solid #f0f0f0;">Service</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">
            <span style="display:inline-block;background:#FFF8EB;color:#92400e;padding:4px 14px;border-radius:4px;font-weight:700;font-size:13px;border:1px solid #F0D9A0;">{$service}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;font-weight:600;color:#374151;vertical-align:top;">Message</td>
          <td style="padding:10px 12px;color:#1f2937;line-height:1.6;">{$message}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- SUBMITTED INFO -->
  <tr>
    <td style="padding:25px 40px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
        <tr>
          <td style="padding:12px 20px;font-size:12px;color:#6b7280;">
            Submitted on <strong>{$date}</strong>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- REPLY BUTTON -->
  <tr>
    <td style="padding:25px 40px 30px;text-align:center;">
      <a href="mailto:{$email}?subject=Re: Your K9 Movement Inquiry ({$ref})" style="display:inline-block;background-color:#E8A838;color:#0a0a0a;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:14px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Reply to {$name}</a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">K9 Movement Website &bull; Contact Form Notification</p>
      <p style="margin:4px 0 0;font-size:11px;color:#d1d5db;">Reply to this email to contact the client directly.</p>
    </td>
  </tr>

</table>
</td></tr></table>
</body>
</html>
HTML;

// ═══════════════════════════════════════
// CLIENT CONFIRMATION EMAIL (with logo)
// ═══════════════════════════════════════

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
      <img src="cid:{$logo_cid}" width="140" height="140" alt="K9 Movement" style="border-radius:50%;border:3px solid rgba(255,255,255,0.3);">
      <p style="color:rgba(255,255,255,0.85);margin:12px 0 0;font-size:13px;letter-spacing:0.5px;">Professional Dog Training &amp; Care</p>
    </td>
  </tr>

  <!-- GREETING -->
  <tr>
    <td style="padding:35px 40px 0;">
      <h2 style="margin:0 0 8px;font-size:22px;color:#1f2937;">Thank you, {$name}!</h2>
      <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.6;">We have received your inquiry and our team will get back to you within <strong style="color:#1a3a2a;">24 hours</strong>.</p>
    </td>
  </tr>

  <!-- SUMMARY CARD -->
  <tr>
    <td style="padding:25px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8EB;border:1px solid #F0D9A0;border-radius:10px;">
        <tr>
          <td style="padding:20px 25px;">
            <p style="margin:0 0 4px;font-size:11px;color:#92400e;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Your Inquiry</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-top:10px;">
              <tr>
                <td style="padding:6px 0;color:#374151;font-weight:600;width:35%;">Reference</td>
                <td style="padding:6px 0;color:#92400e;font-weight:700;font-size:16px;">{$ref}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#374151;font-weight:600;">Service</td>
                <td style="padding:6px 0;color:#1f2937;">{$service}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#374151;font-weight:600;">Date</td>
                <td style="padding:6px 0;color:#1f2937;">{$date}</td>
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
          <td style="padding:8px 0;vertical-align:top;width:30px;"><span style="display:inline-block;width:24px;height:24px;background-color:#E8A838;color:#0a0a0a;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;">1</span></td>
          <td style="padding:8px 0 8px 8px;color:#374151;">Our team reviews your message</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:30px;"><span style="display:inline-block;width:24px;height:24px;background-color:#E8A838;color:#0a0a0a;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;">2</span></td>
          <td style="padding:8px 0 8px 8px;color:#374151;">We respond with personalized information about your service</td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:30px;"><span style="display:inline-block;width:24px;height:24px;background-color:#E8A838;color:#0a0a0a;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;">3</span></td>
          <td style="padding:8px 0 8px 8px;color:#374151;">We schedule a consultation or next steps together!</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 40px 30px;text-align:center;">
      <p style="margin:0 0 15px;font-size:14px;color:#6b7280;">Have more questions? Don't hesitate to reach out.</p>
      <a href="mailto:info@k9movement.com" style="display:inline-block;background-color:#E8A838;color:#0a0a0a;text-decoration:none;padding:12px 30px;border-radius:8px;font-size:14px;font-weight:700;">Contact Us</a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background-color:#f9fafb;padding:25px 40px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:13px;color:#6b7280;font-weight:600;">K9 Movement</p>
      <p style="margin:6px 0 0;font-size:11px;color:#9ca3af;">Professional Dog Training &amp; Care Services</p>
      <p style="margin:4px 0 0;font-size:11px;color:#9ca3af;">Halton &amp; Surrounding Areas, Ontario, Canada</p>
      <p style="margin:8px 0 0;font-size:11px;color:#d1d5db;">This is an automated confirmation. Please keep this email for your records.</p>
    </td>
  </tr>

</table>
</td></tr></table>
</body>
</html>
HTML;


// ═══════════════════════════════════════
// SEND EMAILS (MIME MULTIPART with embedded logo)
// ═══════════════════════════════════════

$boundary_related = '----=_Rel_' . md5(uniqid(time()));

// ─── ADMIN EMAIL (HTML + embedded logo) ───
$admin_subject = "=?UTF-8?B?" . base64_encode("New Contact: {$name} — {$service} ({$ref})") . "?=";

$admin_headers = implode("\r\n", [
    "From: {$FROM_NAME} <{$FROM_EMAIL}>",
    "Reply-To: {$name} <{$email}>",
    "MIME-Version: 1.0",
    "Content-Type: multipart/related; boundary=\"{$boundary_related}\"",
    "X-Mailer: K9Movement-Website/2.0",
]);

$admin_body = "--{$boundary_related}\r\n";
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

$admin_body .= "--{$boundary_related}--";

$sent = mail($TO_EMAIL, $admin_subject, $admin_body, $admin_headers);


// ─── CLIENT CONFIRMATION EMAIL (HTML + embedded logo) ───
if ($sent) {
    $client_boundary_related = '----=_CRel_' . md5(uniqid(time() . 'cr'));

    $client_subject = "=?UTF-8?B?" . base64_encode("K9 Movement — We Received Your Message ({$ref})") . "?=";

    $client_headers = implode("\r\n", [
        "From: {$FROM_NAME} <{$FROM_EMAIL}>",
        "Reply-To: {$FROM_EMAIL}",
        "MIME-Version: 1.0",
        "Content-Type: multipart/related; boundary=\"{$client_boundary_related}\"",
        "X-Mailer: K9Movement-Website/2.0",
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

    mail($email, $client_subject, $client_body, $client_headers);
}


// ─── RESPONSE ───
if ($sent) {
    echo json_encode(['success' => true, 'ref' => $ref]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email. Please try again.']);
}

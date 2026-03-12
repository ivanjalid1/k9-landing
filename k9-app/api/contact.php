<?php
// ═══════════════════════════════════════════════════════
// K9 MOVEMENT — Contact Form Handler
// ═══════════════════════════════════════════════════════

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ─── CONFIG ───
$TO_EMAIL   = 'info@k9movement.com';
$FROM_EMAIL = 'noreply@form.k9movement.com';
$FROM_NAME  = 'K9 Movement Website';

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
    echo json_encode(['success' => false, 'error' => 'Too many requests. Please try again later.']);
    exit;
}

$requests[] = $now;
file_put_contents($rate_file, json_encode($requests));

// ─── PARSE INPUT ───
$input = json_decode(file_get_contents('php://input'), true);

$name    = trim($input['name'] ?? '');
$email   = trim($input['email'] ?? '');
$phone   = trim($input['phone'] ?? '');
$service = trim($input['service'] ?? '');
$message = trim($input['message'] ?? '');

// ─── VALIDATE ───
if (!$name || !$email || !$service) {
    echo json_encode(['success' => false, 'error' => 'Name, email, and service are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Invalid email address.']);
    exit;
}

// Sanitize
$name    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$phone   = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
$service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// ─── BUILD EMAIL ───
$date = date('F j, Y \a\t g:i A');

$html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
  <!-- Header -->
  <tr>
    <td style="background:#0a0a0a;padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#E8A838;font-size:22px;font-weight:bold;letter-spacing:2px;">
        K9 MOVEMENT
      </h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:1px;">
        NEW CONTACT FORM SUBMISSION
      </p>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="padding:32px;">
      <p style="margin:0 0 20px;color:#666;font-size:13px;">
        Received on {$date}
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px;width:120px;vertical-align:top;">Name</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;vertical-align:top;"><strong>{$name}</strong></td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Email</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;vertical-align:top;"><a href="mailto:{$email}" style="color:#E8A838;">{$email}</a></td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Phone</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;vertical-align:top;">{$phone ?: '—'}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Service</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;vertical-align:top;">
            <span style="display:inline-block;background:#FFF8EB;color:#C4891E;padding:4px 12px;border-radius:4px;font-weight:600;font-size:13px;">{$service}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Message</td>
          <td style="padding:12px 0;color:#333;font-size:14px;line-height:1.6;vertical-align:top;">{$message ?: '—'}</td>
        </tr>
      </table>
      <div style="margin-top:28px;padding-top:20px;border-top:2px solid #E8A838;">
        <a href="mailto:{$email}" style="display:inline-block;background:#E8A838;color:#0a0a0a;padding:10px 24px;font-size:13px;font-weight:bold;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
          Reply to {$name}
        </a>
      </div>
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="background:#f9f7f3;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#999;font-size:11px;">
        K9 Movement — Halton &amp; Surrounding Areas, Ontario, Canada
      </p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
HTML;

// ─── SEND EMAIL ───
$boundary = md5(uniqid(time()));

$headers  = "From: {$FROM_NAME} <{$FROM_EMAIL}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$subject = "New Contact: {$name} — {$service}";

$sent = @mail($TO_EMAIL, $subject, $html, $headers);

if ($sent) {
    // ─── AUTO-REPLY TO CLIENT ───
    $reply_html = <<<REPLY
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:32px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
  <tr>
    <td style="background:#0a0a0a;padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#E8A838;font-size:22px;font-weight:bold;letter-spacing:2px;">K9 MOVEMENT</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:32px;">
      <h2 style="margin:0 0 16px;color:#222;font-size:20px;">Thank you, {$name}!</h2>
      <p style="color:#555;font-size:14px;line-height:1.7;">
        We've received your message about <strong>{$service}</strong> and will get back to you within 24 hours.
      </p>
      <p style="color:#555;font-size:14px;line-height:1.7;">
        In the meantime, feel free to reach us at <a href="mailto:info@k9movement.com" style="color:#E8A838;">info@k9movement.com</a>.
      </p>
      <p style="margin-top:24px;color:#555;font-size:14px;">
        Warm regards,<br><strong>Emma Vazquez</strong><br>
        <span style="color:#999;font-size:13px;">Founder, K9 Movement</span>
      </p>
    </td>
  </tr>
  <tr>
    <td style="background:#f9f7f3;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#999;font-size:11px;">K9 Movement — Halton &amp; Surrounding Areas, Ontario</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
REPLY;

    $reply_headers  = "From: {$FROM_NAME} <{$FROM_EMAIL}>\r\n";
    $reply_headers .= "MIME-Version: 1.0\r\n";
    $reply_headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    @mail($email, "Thank you for contacting K9 Movement!", $reply_html, $reply_headers);

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to send email. Please try again.']);
}

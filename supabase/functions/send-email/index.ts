const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Brown Hat Academy <noreply@brownhat.academy>";
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://brownhat.academy";

// Brand colours (from index.css)
const C = {
  bg: "#fafaf9",          // off-white page background
  card: "#ffffff",        // email card background
  border: "#e8e0d8",      // warm grey border
  headerBg: "#3d2314",    // dark brown header  (hsl 20 35% 16%)
  headerBorder: "#5c3520",// slightly lighter brown border
  primary: "#a05432",     // burnt sienna – buttons, links  (hsl 20 57% 40%)
  primaryHover: "#8a4428",// darker for hover state
  text: "#171717",        // near-black body text
  muted: "#6b5b4e",       // warm grey muted text
  subtle: "#9c8577",      // lighter muted
  footerBg: "#f2ece6",    // light warm footer
};

interface EmailPayload {
  user: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

function getActionUrl(payload: EmailPayload): string {
  const { token_hash, email_action_type, redirect_to } = payload.email_data;
  const siteUrl = payload.email_data.site_url || SITE_URL;
  return `${siteUrl}/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&next=${encodeURIComponent(redirect_to)}`;
}

function emailShell(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Brown Hat Academy</title>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.bg};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header / Logo -->
          <tr>
            <td style="background-color:${C.headerBg};border-radius:12px 12px 0 0;padding:28px 40px;text-align:center;border:1px solid ${C.headerBorder};border-bottom:none;">
              <img src="${SITE_URL}/bhlogo.png" alt="Brown Hat Academy" width="160" style="height:auto;display:block;margin:0 auto;" />
            </td>
          </tr>

          <!-- Card body -->
          <tr>
            <td style="background-color:${C.card};border:1px solid ${C.border};border-top:none;padding:40px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${C.footerBg};border:1px solid ${C.border};border-top:none;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:${C.subtle};">
                <a href="${SITE_URL}" style="color:${C.primary};text-decoration:none;font-weight:500;">brownhat.academy</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}/privacy" style="color:${C.subtle};text-decoration:none;">Privacy</a>
                &nbsp;&middot;&nbsp;
                <a href="${SITE_URL}/terms" style="color:${C.subtle};text-decoration:none;">Terms</a>
              </p>
              <p style="margin:0;font-size:11px;color:${C.subtle};">&copy; 2026 Brown Hat Academy. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, url: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr>
      <td style="background-color:${C.primary};border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">${label}</a>
      </td>
    </tr>
  </table>`;
}

function fallbackLink(url: string): string {
  return `
  <p style="margin:0 0 4px;font-size:13px;color:${C.muted};">Or copy and paste this link into your browser:</p>
  <p style="margin:0;word-break:break-all;font-size:12px;">
    <a href="${url}" style="color:${C.primary};text-decoration:none;">${url}</a>
  </p>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${C.border};margin:28px 0;" />`;
}

// ─── Email builders ───────────────────────────────────────────────────────────

function buildSignupEmail(name: string, url: string): { subject: string; html: string } {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  return {
    subject: "Confirm your Brown Hat Academy account",
    html: emailShell(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${C.text};">Confirm your email</h1>
      <p style="margin:0 0 20px;font-size:15px;color:${C.muted};line-height:1.5;">${greeting} thanks for signing up. Click the button below to verify your email address and activate your account.</p>
      ${ctaButton("Confirm Email Address", url)}
      ${divider()}
      ${fallbackLink(url)}
      ${divider()}
      <p style="margin:0;font-size:13px;color:${C.subtle};">If you didn't create a Brown Hat Academy account, you can safely ignore this email.</p>
    `),
  };
}

function buildPasswordResetEmail(name: string, url: string): { subject: string; html: string } {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  return {
    subject: "Reset your Brown Hat Academy password",
    html: emailShell(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${C.text};">Reset your password</h1>
      <p style="margin:0 0 20px;font-size:15px;color:${C.muted};line-height:1.5;">${greeting} we received a request to reset your password. This link expires in <strong style="color:${C.text};">1 hour</strong>.</p>
      ${ctaButton("Reset Password", url)}
      ${divider()}
      ${fallbackLink(url)}
      ${divider()}
      <p style="margin:0;font-size:13px;color:${C.subtle};">If you didn't request a password reset, you can safely ignore this email — your password won't change.</p>
    `),
  };
}

function buildMagicLinkEmail(name: string, url: string): { subject: string; html: string } {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  return {
    subject: "Your Brown Hat Academy sign-in link",
    html: emailShell(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${C.text};">Your sign-in link</h1>
      <p style="margin:0 0 20px;font-size:15px;color:${C.muted};line-height:1.5;">${greeting} click the button below to sign in. This link is valid for <strong style="color:${C.text};">1 hour</strong> and can only be used once.</p>
      ${ctaButton("Sign In", url)}
      ${divider()}
      ${fallbackLink(url)}
      ${divider()}
      <p style="margin:0;font-size:13px;color:${C.subtle};">If you didn't request this link, you can safely ignore this email.</p>
    `),
  };
}

function buildInviteEmail(name: string, url: string): { subject: string; html: string } {
  return {
    subject: "You've been invited to Brown Hat Academy",
    html: emailShell(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:${C.text};">You're invited</h1>
      <p style="margin:0 0 20px;font-size:15px;color:${C.muted};line-height:1.5;">${name ? `Hi ${name}, you've` : "You've"} been invited to join Brown Hat Academy — a cybersecurity learning platform from foundations to advanced certifications. Accept your invitation to get started.</p>
      ${ctaButton("Accept Invitation", url)}
      ${divider()}
      ${fallbackLink(url)}
      ${divider()}
      <p style="margin:0;font-size:13px;color:${C.subtle};">If you weren't expecting this invitation, you can safely ignore this email.</p>
    `),
  };
}

// ─── Handler ─────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const payload: EmailPayload = await req.json();
    const { user, email_data } = payload;
    const name = user.user_metadata?.full_name ?? "";
    const actionType = email_data.email_action_type;
    const actionUrl = getActionUrl(payload);

    let emailContent: { subject: string; html: string };

    switch (actionType) {
      case "signup":
      case "email_change_current":
      case "email_change_new":
        emailContent = buildSignupEmail(name, actionUrl);
        break;
      case "recovery":
        emailContent = buildPasswordResetEmail(name, actionUrl);
        break;
      case "magic_link":
        emailContent = buildMagicLinkEmail(name, actionUrl);
        break;
      case "invite":
        emailContent = buildInviteEmail(name, actionUrl);
        break;
      default:
        emailContent = buildSignupEmail(name, actionUrl);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [user.email],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", resData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resData }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Email sent (${actionType}) to ${user.email}: ${resData.id}`);
    return new Response(
      JSON.stringify({ success: true, id: resData.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

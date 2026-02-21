import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { sendLovableEmail, parseEmailWebhookPayload } from 'npm:@lovable.dev/email-js'
import { WebhookError, verifyWebhookRequest } from 'npm:@lovable.dev/webhooks-js'
import {
  Body, Button, Container, Head, Heading, Html,
  Img, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

// ─── Config ──────────────────────────────────────────────────────────────────

const SITE_NAME = "Brown Hat Academy"
const SENDER_DOMAIN = "notify.brownhat.academy"
const ROOT_DOMAIN = "brownhat.academy"
const FROM_DOMAIN = "brownhat.academy"
const SITE_URL = `https://${ROOT_DOMAIN}`
const LOGO_URL = 'https://fwxfhupzkjjbodymckrl.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1'
const SAMPLE_EMAIL = "user@example.test"

// ─── Shared styles ───────────────────────────────────────────────────────────

const s = {
  main: { backgroundColor: '#fafaf9', fontFamily: 'Inter, Arial, sans-serif' },
  container: { maxWidth: '560px', margin: '40px auto', borderRadius: '12px', overflow: 'hidden' as const, border: '1px solid #e8e0d8' },
  logoSection: { backgroundColor: '#3d2314', padding: '28px 40px', textAlign: 'center' as const },
  logo: { display: 'block', margin: '0 auto' },
  body: { backgroundColor: '#ffffff', padding: '36px 40px' },
  h1: { fontSize: '22px', fontWeight: 'bold' as const, color: '#171717', margin: '0 0 16px' },
  text: { fontSize: '14px', color: '#6b5b4e', lineHeight: '1.6', margin: '0 0 20px' },
  link: { color: '#a05432', textDecoration: 'underline' },
  button: { backgroundColor: '#a05432', color: '#ffffff', fontSize: '15px', fontWeight: '600', borderRadius: '8px', padding: '13px 28px', textDecoration: 'none', display: 'inline-block' as const, margin: '8px 0 24px' },
  footer: { fontSize: '12px', color: '#9c8577', margin: '24px 0 0', borderTop: '1px solid #e8e0d8', paddingTop: '20px' },
  code: { fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 'bold' as const, color: '#a05432', margin: '8px 0 24px', letterSpacing: '0.15em' },
}

const LogoHeader = () => (
  <Section style={s.logoSection}>
    <Img src={LOGO_URL} alt="Brown Hat Academy" width={160} style={s.logo} />
  </Section>
)

// ─── Templates ───────────────────────────────────────────────────────────────

const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: any) => (
  <Html lang="en" dir="ltr"><Head />
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={s.main}><Container style={s.container}>
      <LogoHeader />
      <Section style={s.body}>
        <Heading style={s.h1}>Welcome to Brown Hat Academy!</Heading>
        <Text style={s.text}>Thanks for signing up for <Link href={siteUrl} style={s.link}><strong>{siteName}</strong></Link>!</Text>
        <Text style={s.text}>Please confirm your email address (<Link href={`mailto:${recipient}`} style={s.link}>{recipient}</Link>) by clicking the button below:</Text>
        <Button style={s.button} href={confirmationUrl}>Get Started</Button>
        <Text style={s.footer}>If you didn't create an account, you can safely ignore this email.</Text>
      </Section>
    </Container></Body>
  </Html>
)

const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: any) => (
  <Html lang="en" dir="ltr"><Head />
    <Preview>You've been invited to join {siteName}</Preview>
    <Body style={s.main}><Container style={s.container}>
      <LogoHeader />
      <Section style={s.body}>
        <Heading style={s.h1}>You've been invited</Heading>
        <Text style={s.text}>You've been invited to join <Link href={siteUrl} style={s.link}><strong>{siteName}</strong></Link>. Click below to accept and create your account.</Text>
        <Button style={s.button} href={confirmationUrl}>Accept Invitation</Button>
        <Text style={s.footer}>If you weren't expecting this, you can safely ignore this email.</Text>
      </Section>
    </Container></Body>
  </Html>
)

const MagicLinkEmail = ({ siteName, confirmationUrl }: any) => (
  <Html lang="en" dir="ltr"><Head />
    <Preview>Your login link for {siteName}</Preview>
    <Body style={s.main}><Container style={s.container}>
      <LogoHeader />
      <Section style={s.body}>
        <Heading style={s.h1}>Your login link</Heading>
        <Text style={s.text}>Click the button below to log in to {siteName}. This link will expire shortly.</Text>
        <Button style={s.button} href={confirmationUrl}>Log In</Button>
        <Text style={s.footer}>If you didn't request this link, you can safely ignore this email.</Text>
      </Section>
    </Container></Body>
  </Html>
)

const RecoveryEmail = ({ siteName, confirmationUrl }: any) => (
  <Html lang="en" dir="ltr"><Head />
    <Preview>Reset your password for {siteName}</Preview>
    <Body style={s.main}><Container style={s.container}>
      <LogoHeader />
      <Section style={s.body}>
        <Heading style={s.h1}>Reset your password</Heading>
        <Text style={s.text}>We received a request to reset your password for {siteName}. Click below to choose a new password.</Text>
        <Button style={s.button} href={confirmationUrl}>Reset Password</Button>
        <Text style={s.footer}>If you didn't request this, you can safely ignore this email. Your password will not be changed.</Text>
      </Section>
    </Container></Body>
  </Html>
)

const EmailChangeEmail = ({ siteName, email, newEmail, confirmationUrl }: any) => (
  <Html lang="en" dir="ltr"><Head />
    <Preview>Confirm your email change for {siteName}</Preview>
    <Body style={s.main}><Container style={s.container}>
      <LogoHeader />
      <Section style={s.body}>
        <Heading style={s.h1}>Confirm your email change</Heading>
        <Text style={s.text}>You requested to change your email for {siteName} from <Link href={`mailto:${email}`} style={s.link}>{email}</Link> to <Link href={`mailto:${newEmail}`} style={s.link}>{newEmail}</Link>.</Text>
        <Text style={s.text}>Click the button below to confirm:</Text>
        <Button style={s.button} href={confirmationUrl}>Confirm Email Change</Button>
        <Text style={s.footer}>If you didn't request this, please secure your account immediately.</Text>
      </Section>
    </Container></Body>
  </Html>
)

const ReauthenticationEmail = ({ token }: any) => (
  <Html lang="en" dir="ltr"><Head />
    <Preview>Your verification code</Preview>
    <Body style={s.main}><Container style={s.container}>
      <LogoHeader />
      <Section style={s.body}>
        <Heading style={s.h1}>Confirm reauthentication</Heading>
        <Text style={s.text}>Use the code below to confirm your identity:</Text>
        <Text style={s.code}>{token}</Text>
        <Text style={s.footer}>This code will expire shortly. If you didn't request this, you can safely ignore this email.</Text>
      </Section>
    </Container></Body>
  </Html>
)

// ─── Routing ─────────────────────────────────────────────────────────────────

const EMAIL_SUBJECTS: Record<string, string> = {
  signup: 'Confirm your email',
  invite: "You've been invited",
  magiclink: 'Your login link',
  recovery: 'Reset your password',
  email_change: 'Confirm your new email',
  reauthentication: 'Your verification code',
}

const EMAIL_TEMPLATES: Record<string, React.ComponentType<any>> = {
  signup: SignupEmail,
  invite: InviteEmail,
  magiclink: MagicLinkEmail,
  recovery: RecoveryEmail,
  email_change: EmailChangeEmail,
  reauthentication: ReauthenticationEmail,
}

const SAMPLE_DATA: Record<string, object> = {
  signup: { siteName: SITE_NAME, siteUrl: SITE_URL, recipient: SAMPLE_EMAIL, confirmationUrl: SITE_URL },
  magiclink: { siteName: SITE_NAME, confirmationUrl: SITE_URL },
  recovery: { siteName: SITE_NAME, confirmationUrl: SITE_URL },
  invite: { siteName: SITE_NAME, siteUrl: SITE_URL, confirmationUrl: SITE_URL },
  email_change: { siteName: SITE_NAME, email: SAMPLE_EMAIL, newEmail: SAMPLE_EMAIL, confirmationUrl: SITE_URL },
  reauthentication: { token: '123456' },
}

// ─── Handlers ────────────────────────────────────────────────────────────────

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-lovable-signature, x-lovable-timestamp, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

async function handlePreview(req: Request): Promise<Response> {
  const previewCors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' }
  if (req.method === 'OPTIONS') return new Response(null, { headers: previewCors })

  const apiKey = Deno.env.get('LOVABLE_API_KEY')
  if (!apiKey || req.headers.get('Authorization') !== `Bearer ${apiKey}`)
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...previewCors, 'Content-Type': 'application/json' } })

  const { type } = await req.json()
  const EmailTemplate = EMAIL_TEMPLATES[type]
  if (!EmailTemplate)
    return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), { status: 400, headers: { ...previewCors, 'Content-Type': 'application/json' } })

  const html = await renderAsync(React.createElement(EmailTemplate, SAMPLE_DATA[type] || {}))
  return new Response(html, { status: 200, headers: { ...previewCors, 'Content-Type': 'text/html; charset=utf-8' } })
}

async function handleWebhook(req: Request): Promise<Response> {
  const apiKey = Deno.env.get('LOVABLE_API_KEY')
  if (!apiKey) return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  let payload: any, run_id = ''
  try {
    const verified = await verifyWebhookRequest({ req, secret: apiKey, parser: parseEmailWebhookPayload })
    payload = verified.payload
    run_id = payload.run_id
  } catch (error) {
    if (error instanceof WebhookError) {
      if (['invalid_signature', 'missing_timestamp', 'invalid_timestamp', 'stale_timestamp'].includes(error.code))
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  if (!run_id) return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  if (payload.version !== '1') return new Response(JSON.stringify({ error: `Unsupported payload version: ${payload.version}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  const emailType = payload.data.action_type
  const EmailTemplate = EMAIL_TEMPLATES[emailType]
  if (!EmailTemplate) return new Response(JSON.stringify({ error: `Unknown email type: ${emailType}` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  const templateProps = {
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
    recipient: payload.data.email,
    confirmationUrl: payload.data.url,
    token: payload.data.token,
    email: payload.data.email,
    newEmail: payload.data.new_email,
  }

  const html = await renderAsync(React.createElement(EmailTemplate, templateProps))
  const text = await renderAsync(React.createElement(EmailTemplate, templateProps), { plainText: true })

  const callbackUrl = payload.data.callback_url
  if (!callbackUrl) return new Response(JSON.stringify({ error: 'Missing callback_url in payload' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  const result = await sendLovableEmail(
    { run_id, to: payload.data.email, from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`, sender_domain: SENDER_DOMAIN, subject: EMAIL_SUBJECTS[emailType] || 'Notification', html, text, purpose: 'transactional' },
    { apiKey, sendUrl: callbackUrl }
  )

  return new Response(JSON.stringify({ success: true, message_id: result.message_id }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (new URL(req.url).pathname.endsWith('/preview')) return handlePreview(req)
  try {
    return await handleWebhook(req)
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})

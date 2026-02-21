/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

const LOGO_URL = 'https://fwxfhupzkjjbodymckrl.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img src={LOGO_URL} alt="Brown Hat Academy" width={160} style={logo} />
        </Section>
        <Section style={body}>
          <Heading style={h1}>Confirm your email change</Heading>
          <Text style={text}>
            You requested to change your email address for {siteName} from{' '}
            <Link href={`mailto:${email}`} style={link}>
              {email}
            </Link>{' '}
            to{' '}
            <Link href={`mailto:${newEmail}`} style={link}>
              {newEmail}
            </Link>
            .
          </Text>
          <Text style={text}>Click the button below to confirm this change:</Text>
          <Button style={button} href={confirmationUrl}>
            Confirm Email Change
          </Button>
          <Text style={footer}>
            If you didn't request this change, please secure your account immediately.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#fafaf9', fontFamily: 'Inter, Arial, sans-serif' }
const container = {
  maxWidth: '560px',
  margin: '40px auto',
  borderRadius: '12px',
  overflow: 'hidden' as const,
  border: '1px solid #e8e0d8',
}
const logoSection = {
  backgroundColor: '#3d2314',
  padding: '28px 40px',
  textAlign: 'center' as const,
}
const logo = { display: 'block', margin: '0 auto' }
const body = { backgroundColor: '#ffffff', padding: '36px 40px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#171717', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#6b5b4e', lineHeight: '1.6', margin: '0 0 20px' }
const link = { color: '#a05432', textDecoration: 'underline' }
const button = {
  backgroundColor: '#a05432',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  borderRadius: '8px',
  padding: '13px 28px',
  textDecoration: 'none',
  display: 'inline-block' as const,
  margin: '8px 0 24px',
}
const footer = {
  fontSize: '12px',
  color: '#9c8577',
  margin: '24px 0 0',
  borderTop: '1px solid #e8e0d8',
  paddingTop: '20px',
}

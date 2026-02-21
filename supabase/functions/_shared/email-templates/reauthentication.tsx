/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
  siteUrl?: string
}

export const ReauthenticationEmail = ({
  token,
  siteUrl = 'https://brownhat.academy',
}: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src={`${siteUrl}/bhlogo.png`}
            alt="Brown Hat Academy"
            width={160}
            style={logo}
          />
        </Section>
        <Section style={body}>
          <Heading style={h1}>Confirm reauthentication</Heading>
          <Text style={text}>Use the code below to confirm your identity:</Text>
          <Text style={codeStyle}>{token}</Text>
          <Text style={footer}>
            This code will expire shortly. If you didn't request this, you can
            safely ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#a05432',
  margin: '8px 0 24px',
  letterSpacing: '0.15em',
}
const footer = {
  fontSize: '12px',
  color: '#9c8577',
  margin: '24px 0 0',
  borderTop: '1px solid #e8e0d8',
  paddingTop: '20px',
}

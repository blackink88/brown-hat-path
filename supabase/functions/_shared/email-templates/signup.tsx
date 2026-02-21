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

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for {siteName}</Preview>
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
          <Heading style={h1}>Confirm your email</Heading>
          <Text style={text}>
            Thanks for signing up for{' '}
            <Link href={siteUrl} style={link}>
              <strong>{siteName}</strong>
            </Link>
            !
          </Text>
          <Text style={text}>
            Please confirm your email address (
            <Link href={`mailto:${recipient}`} style={link}>
              {recipient}
            </Link>
            ) by clicking the button below:
          </Text>
          <Button style={button} href={confirmationUrl}>
            Verify Email
          </Button>
          <Text style={footer}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

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

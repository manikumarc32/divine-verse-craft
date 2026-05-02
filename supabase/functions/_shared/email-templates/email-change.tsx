/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Head, Heading, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface EmailChangeEmailProps {
  siteName: string
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({ oldEmail, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your DivineVerse Art email change</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="EMAIL CHANGE" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>Confirm your email change</Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid }}>
            Just making sure this is you.
          </Text>

          <GoldDivider />

          <Text style={styles.text}>
            You requested to change your DivineVerse Art email from{' '}
            <Link href={`mailto:${oldEmail}`} style={styles.link}>{oldEmail}</Link>{' '}
            to{' '}
            <Link href={`mailto:${newEmail}`} style={styles.link}>{newEmail}</Link>.
          </Text>

          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={confirmationUrl} style={styles.button}>Confirm email change</Button>
          </Section>

          <Text style={styles.footer}>
            If you didn't request this change, please secure your account immediately by
            resetting your password.
          </Text>
        </Section>
        <BrandFooter />
      </Outer>
    </Body>
  </Html>
)

export default EmailChangeEmail

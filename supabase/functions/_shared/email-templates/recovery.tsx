/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your password for DivineVerse Art</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="PASSWORD RESET" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>Reset your password</Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid }}>
            We received a request to reset your DivineVerse Art password.
          </Text>

          <GoldDivider />

          <Text style={styles.text}>
            Click the button below to choose a new password. This link expires in 1 hour for your security.
          </Text>

          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={confirmationUrl} style={styles.button}>Reset password</Button>
          </Section>

          <Text style={styles.footer}>
            If you didn't request this, you can safely ignore this email — your password won't change.
          </Text>
        </Section>
        <BrandFooter />
      </Outer>
    </Body>
  </Html>
)

export default RecoveryEmail

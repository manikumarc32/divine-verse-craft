/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({ confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your DivineVerse Art sign-in link</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="SIGN IN LINK" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>Your sign-in link</Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid }}>
            Tap to enter your DivineVerse Art account.
          </Text>

          <GoldDivider />

          <Text style={styles.text}>
            This magic link will expire shortly. Do not share it with anyone.
          </Text>

          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={confirmationUrl} style={styles.button}>Sign in</Button>
          </Section>

          <Text style={styles.footer}>
            If you didn't request this link, you can safely ignore this email.
          </Text>
        </Section>
        <BrandFooter />
      </Outer>
    </Body>
  </Html>
)

export default MagicLinkEmail

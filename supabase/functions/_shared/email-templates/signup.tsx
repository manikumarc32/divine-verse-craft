/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ confirmationUrl }: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for DivineVerse Art</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="CONFIRM YOUR EMAIL" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>Namaste 🙏</Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid }}>
            One small step before we can welcome you in.
          </Text>

          <GoldDivider />

          <Text style={styles.text}>
            Please confirm your email so we know it's really you.
            Once confirmed, your DivineVerse Art account is ready to use.
          </Text>

          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={confirmationUrl} style={styles.button}>Confirm email</Button>
          </Section>

          <Text style={styles.footer}>
            If you didn't create an account, you can safely ignore this email.
          </Text>
        </Section>
        <BrandFooter />
      </Outer>
    </Body>
  </Html>
)

export default SignupEmail

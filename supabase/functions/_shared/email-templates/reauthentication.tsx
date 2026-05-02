/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Head, Heading, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your DivineVerse Art verification code</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="VERIFICATION CODE" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>Confirm it's you</Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid }}>
            Use the code below to confirm your identity.
          </Text>

          <GoldDivider />

          <Text style={styles.code}>{token}</Text>

          <Text style={styles.footer}>
            This code expires shortly. If you didn't request it, you can safely ignore this email.
          </Text>
        </Section>
        <BrandFooter />
      </Outer>
    </Body>
  </Html>
)

export default ReauthenticationEmail

/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Head, Heading, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to DivineVerse Art</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="YOU'RE INVITED" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>You've been invited 🪷</Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid }}>
            Welcome to{' '}
            <Link href={siteUrl} style={styles.link}>DivineVerse Art</Link>.
          </Text>

          <GoldDivider />

          <Text style={styles.text}>
            Accept the invitation below to create your account and begin your journey
            with sacred art.
          </Text>

          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={confirmationUrl} style={styles.button}>Accept invitation</Button>
          </Section>

          <Text style={styles.footer}>
            If you weren't expecting this invitation, you can safely ignore this email.
          </Text>
        </Section>
        <BrandFooter />
      </Outer>
    </Body>
  </Html>
)

export default InviteEmail

/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface WelcomeProps {
  firstName?: string
}

const WelcomeEmail = ({ firstName }: WelcomeProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Namaste! Welcome to DivineVerse Art 🙏</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="SACRED ART · CRAFTED WITH DEVOTION" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>
            Namaste{firstName ? `, ${firstName}` : ''} 🙏
          </Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid, fontStyle: 'italic' }}>
            Welcome to our family.
          </Text>

          <GoldDivider />

          <Text style={styles.text}>
            We're honoured you've joined DivineVerse Art. Each piece in our collection
            carries the weight of an ancient verse — from the Bhagavad Gita, the Ramayana,
            and the timeless mantras of our tradition — rendered with care into art you
            can hang in your home, your meditation space, or gift to someone you love.
          </Text>

          <Text style={styles.text}>
            Every print is crafted in our UK studio on premium materials. We don't rush.
            We don't compromise. And we always include the verse, its translation, and
            its deeper meaning — so the art speaks to your heart as well as your eyes.
          </Text>

          <Heading as="h2" style={styles.h2}>Where to begin</Heading>

          <Section style={{ ...styles.card, padding: '14px 18px' }}>
            <Text style={{ ...styles.text, margin: '0 0 4px', fontWeight: 'bold' as const }}>
              🛍️ Browse the collection
            </Text>
            <Text style={{ ...styles.muted, margin: 0 }}>
              Curated verses, ready to hang.
            </Text>
          </Section>

          <Section style={{ ...styles.card, padding: '14px 18px' }}>
            <Text style={{ ...styles.text, margin: '0 0 4px', fontWeight: 'bold' as const }}>
              ✨ Build your own
            </Text>
            <Text style={{ ...styles.muted, margin: 0 }}>
              Create a custom piece with the verse closest to you.
            </Text>
          </Section>

          <Section style={{ ...styles.card, padding: '14px 18px' }}>
            <Text style={{ ...styles.text, margin: '0 0 4px', fontWeight: 'bold' as const }}>
              📖 Learn the stories
            </Text>
            <Text style={{ ...styles.muted, margin: 0 }}>
              Read about the verses behind the art.
            </Text>
          </Section>

          <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
            <Button href="https://divinverseart.com/shop" style={styles.button}>
              Explore the shop
            </Button>
          </Section>

          <Text style={{ ...styles.muted, textAlign: 'center', marginTop: '24px' }}>
            If you have questions about a verse, a custom piece, or anything else —
            simply reply. We read every message.
          </Text>
        </Section>
        <BrandFooter replyTo="namaste@divinverseart.com" />
      </Outer>
    </Body>
  </Html>
)

export const template = {
  component: WelcomeEmail,
  subject: 'Namaste! Welcome to DivineVerse Art 🙏',
  displayName: 'Welcome email',
  previewData: { firstName: 'Mani' },
} satisfies TemplateEntry

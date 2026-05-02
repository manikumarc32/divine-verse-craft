/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface ShippingNotificationProps {
  firstName?: string
  orderShortId?: string
  shipDate?: string
  carrier?: string
  trackingNumber?: string
  trackingUrl?: string
  addressLines?: string[]
  estimatedArrival?: string
}

const ShippingNotificationEmail = ({
  firstName,
  orderShortId = 'XXXXX',
  shipDate,
  carrier,
  trackingNumber,
  trackingUrl,
  addressLines = [],
  estimatedArrival,
}: ShippingNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your DivineVerse order #{orderShortId} is on its way ✈️</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="ORDER SHIPPED" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>
            {firstName ? `${firstName}, your blessing is on its way` : 'Your blessing is on its way'}
          </Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid }}>
            Order #{orderShortId} has just left our studio.
          </Text>

          <GoldDivider />

          <Section style={styles.card}>
            {shipDate && (
              <>
                <Text style={styles.label}>Shipped</Text>
                <Text style={{ ...styles.text, margin: '0 0 10px' }}>{shipDate}</Text>
              </>
            )}
            {carrier && (
              <>
                <Text style={styles.label}>Carrier</Text>
                <Text style={{ ...styles.text, margin: '0 0 10px' }}>{carrier}</Text>
              </>
            )}
            {trackingNumber && (
              <>
                <Text style={styles.label}>Tracking number</Text>
                <Text style={{ ...styles.text, margin: 0, fontFamily: 'monospace', fontSize: '14px' }}>
                  {trackingNumber}
                </Text>
              </>
            )}
          </Section>

          {trackingUrl && (
            <Section style={{ textAlign: 'center', margin: '20px 0 8px' }}>
              <Button href={trackingUrl} style={styles.button}>Track your package</Button>
            </Section>
          )}

          <Heading as="h2" style={styles.h2}>Shipping to</Heading>
          <Section style={styles.card}>
            {addressLines.map((line, i) => (
              <Text key={i} style={{ ...styles.text, margin: '0 0 2px' }}>{line}</Text>
            ))}
          </Section>

          {estimatedArrival && (
            <>
              <Heading as="h2" style={styles.h2}>Expected arrival</Heading>
              <Text style={styles.text}>{estimatedArrival}</Text>
            </>
          )}

          <Text style={{ ...styles.muted, textAlign: 'center', marginTop: '24px' }}>
            Hold this verse close — may it bring peace to your home.
          </Text>
        </Section>
        <BrandFooter replyTo="orders@divinverseart.com" />
      </Outer>
    </Body>
  </Html>
)

export const template = {
  component: ShippingNotificationEmail,
  subject: (d: Record<string, any>) =>
    `Your DivineVerse order #${d?.orderShortId ?? ''} is on its way ✈️`.replace('# ', '#'),
  displayName: 'Shipping notification',
  previewData: {
    firstName: 'Mani',
    orderShortId: 'A3F92K',
    shipDate: '4 May 2026',
    carrier: 'Royal Mail Tracked 48',
    trackingNumber: 'RM123456789GB',
    trackingUrl: 'https://track.royalmail.com/RM123456789GB',
    addressLines: ['Mani Kumar', '12 Lotus Street', 'London', 'SW1A 1AA', 'United Kingdom'],
    estimatedArrival: '6–7 May 2026',
  },
} satisfies TemplateEntry

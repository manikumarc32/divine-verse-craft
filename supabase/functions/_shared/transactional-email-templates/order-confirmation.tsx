/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandHeader, BrandFooter, Outer, GoldDivider, styles, brand } from './_brand.tsx'

interface OrderItem {
  title: string
  quantity: number
  lineTotal: string
  details?: string
}

interface OrderConfirmationProps {
  firstName?: string
  orderShortId?: string
  orderDate?: string
  items?: OrderItem[]
  addressLines?: string[]
  subtotal?: string
  shipping?: string
  total?: string
  estimatedDelivery?: string
  viewOrderUrl?: string
}

const OrderConfirmationEmail = ({
  firstName,
  orderShortId = 'XXXXX',
  orderDate,
  items = [],
  addressLines = [],
  subtotal = '£0.00',
  shipping = 'FREE',
  total = '£0.00',
  estimatedDelivery,
  viewOrderUrl = 'https://divinverseart.com/account/orders',
}: OrderConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your DivineVerse order #{orderShortId} is confirmed 🪷</Preview>
    <Body style={styles.body}>
      <Outer>
        <BrandHeader tagline="ORDER CONFIRMED" />
        <Section style={styles.contentSection}>
          <Heading as="h1" style={styles.h1}>
            {firstName ? `Namaste ${firstName},` : 'Namaste,'}
          </Heading>
          <Text style={{ ...styles.text, textAlign: 'center', color: brand.mid }}>
            Your sacred art is in our hands. Thank you for your order.
          </Text>

          <GoldDivider />

          <Section style={styles.card}>
            <Text style={styles.label}>Order Number</Text>
            <Text style={{ ...styles.text, margin: '0 0 10px', fontFamily: brand.fontHeading, fontSize: '17px' }}>
              #{orderShortId}
            </Text>
            {orderDate && (
              <>
                <Text style={styles.label}>Placed</Text>
                <Text style={{ ...styles.text, margin: 0 }}>{orderDate}</Text>
              </>
            )}
          </Section>

          <Heading as="h2" style={styles.h2}>Your items</Heading>
          {items.map((it, i) => (
            <Section
              key={i}
              style={{
                padding: '12px 0',
                borderBottom: i < items.length - 1 ? `1px solid ${brand.border}` : 'none',
              }}
            >
              <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: 'collapse' }}>
                <tr>
                  <td style={{ verticalAlign: 'top', paddingRight: '12px' }}>
                    <Text style={{ ...styles.text, margin: '0 0 2px', fontWeight: 'bold' as const }}>
                      {it.title} <span style={{ color: brand.mid, fontWeight: 'normal' as const }}>× {it.quantity}</span>
                    </Text>
                    {it.details && <Text style={{ ...styles.muted, margin: 0 }}>{it.details}</Text>}
                  </td>
                  <td style={{ verticalAlign: 'top', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Text style={{ ...styles.text, margin: 0, fontWeight: 'bold' as const }}>{it.lineTotal}</Text>
                  </td>
                </tr>
              </table>
            </Section>
          ))}

          <Section style={{ marginTop: '16px' }}>
            <table width="100%" cellPadding={0} cellSpacing={0}>
              <tr><td style={{ color: brand.mid, fontSize: '14px', padding: '4px 0' }}>Subtotal</td><td style={{ textAlign: 'right', fontSize: '14px', padding: '4px 0' }}>{subtotal}</td></tr>
              <tr><td style={{ color: brand.mid, fontSize: '14px', padding: '4px 0' }}>Shipping</td><td style={{ textAlign: 'right', fontSize: '14px', padding: '4px 0' }}>{shipping}</td></tr>
              <tr><td colSpan={2}><GoldDivider /></td></tr>
              <tr>
                <td style={{ ...styles.totalRow, paddingTop: 0 }}>Total</td>
                <td style={{ ...styles.totalRow, textAlign: 'right' as const, paddingTop: 0, color: brand.saffron }}>{total}</td>
              </tr>
            </table>
          </Section>

          <Heading as="h2" style={styles.h2}>Shipping to</Heading>
          <Section style={styles.card}>
            {addressLines.map((line, i) => (
              <Text key={i} style={{ ...styles.text, margin: '0 0 2px' }}>{line}</Text>
            ))}
          </Section>

          {estimatedDelivery && (
            <>
              <Heading as="h2" style={styles.h2}>Estimated delivery</Heading>
              <Text style={styles.text}>{estimatedDelivery}</Text>
            </>
          )}

          <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
            <Button href={viewOrderUrl} style={styles.button}>View your order</Button>
          </Section>

          <Text style={{ ...styles.muted, textAlign: 'center', marginTop: '20px' }}>
            We'll send you another email when your order ships.
          </Text>
        </Section>
        <BrandFooter replyTo="orders@divinverseart.com" />
      </Outer>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: (d: Record<string, any>) =>
    `Your DivineVerse order #${d?.orderShortId ?? ''} is confirmed 🪷`.replace('# ', '#'),
  displayName: 'Order confirmation',
  previewData: {
    firstName: 'Mani',
    orderShortId: 'A3F92K',
    orderDate: '2 May 2026',
    items: [
      { title: 'Bhagavad Gita 2.47 — Karma Yoga', quantity: 1, lineTotal: '£89.00', details: 'A3 · Premium Canvas · Gold Frame · English' },
      { title: 'Hanuman Chalisa Verse', quantity: 2, lineTotal: '£58.00', details: 'A4 · Matte · No frame · Sanskrit' },
    ],
    addressLines: ['Mani Kumar', '12 Lotus Street', 'London', 'SW1A 1AA', 'United Kingdom'],
    subtotal: '£147.00',
    shipping: 'FREE',
    total: '£147.00',
    estimatedDelivery: '3–5 working days (UK)',
    viewOrderUrl: 'https://divinverseart.com/account/orders',
  },
} satisfies TemplateEntry

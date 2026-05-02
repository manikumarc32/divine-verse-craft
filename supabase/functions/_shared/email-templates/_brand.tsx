/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Container, Hr, Img, Section, Text } from 'npm:@react-email/components@0.0.22'

// DivineVerse Art brand tokens (mirrors src/index.css)
export const brand = {
  saffron: '#D4760A',
  gold: '#B8942D',
  cream: '#FFFAF3',
  ink: '#2A1810',
  mid: '#6B5644',
  border: '#E8D9C2',
  white: '#FFFFFF',
  fontHeading: 'Georgia, "Times New Roman", serif',
  fontBody: 'Georgia, "Times New Roman", serif',
}

const LOTUS_SVG =
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'>` +
  `<g stroke='%23D4760A' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round' fill='none'>` +
  `<path d='M32 50 C18 46 12 36 12 32 C 18 30 24 32 32 36 C 40 32 46 30 52 32 C 52 36 46 46 32 50Z'/>` +
  `<path d='M32 48 C26 36 26 24 32 14 C 38 24 38 36 32 48Z'/>` +
  `<path d='M32 46 C22 38 16 28 18 18 C 26 22 30 30 32 40'/>` +
  `<path d='M32 46 C42 38 48 28 46 18 C 38 22 34 30 32 40'/>` +
  `<circle cx='32' cy='50' r='1.4' fill='%23D4760A'/>` +
  `</g></svg>`
export const LOTUS_DATA_URI = `data:image/svg+xml;utf8,${LOTUS_SVG}`

export const BrandHeader: React.FC<{ tagline?: string }> = ({ tagline }) => (
  <Section style={headerSection}>
    <Img
      src={LOTUS_DATA_URI}
      width="48"
      height="48"
      alt="DivineVerse Art"
      style={{ display: 'block', margin: '0 auto 12px' }}
    />
    <Text style={brandWordmark}>DivineVerse Art</Text>
    <Text style={omSymbol}>ॐ</Text>
    {tagline && <Text style={taglineText}>{tagline}</Text>}
  </Section>
)

export const GoldDivider: React.FC = () => (
  <Hr style={{ border: 'none', height: '1px', background: brand.gold, opacity: 0.45, margin: '20px 0' }} />
)

export const BrandFooter: React.FC = () => (
  <Section style={footerSection}>
    <Text style={footerTagline}>Sacred art, crafted with devotion 🪷</Text>
    <Text style={footerSmall}>
      DivineVerse Art ·{' '}
      <a href="https://divinverseart.com" style={{ color: brand.mid }}>divinverseart.com</a>
    </Text>
  </Section>
)

export const Outer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container style={outerContainer}>{children}</Container>
)

export const styles = {
  body: {
    backgroundColor: '#ffffff',
    margin: 0,
    padding: '24px 0',
    fontFamily: brand.fontBody,
    color: brand.ink,
  } as React.CSSProperties,
  contentSection: { padding: '24px 32px' } as React.CSSProperties,
  h1: {
    fontFamily: brand.fontHeading,
    fontSize: '24px',
    fontWeight: 'normal' as const,
    color: brand.ink,
    margin: '0 0 12px',
    textAlign: 'center' as const,
    lineHeight: '1.3',
  } as React.CSSProperties,
  text: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: brand.ink,
    margin: '0 0 16px',
  } as React.CSSProperties,
  link: { color: brand.saffron, textDecoration: 'underline' } as React.CSSProperties,
  button: {
    backgroundColor: brand.saffron,
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 'bold' as const,
    padding: '13px 30px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
  } as React.CSSProperties,
  footer: {
    fontSize: '12px',
    color: brand.mid,
    lineHeight: '1.5',
    margin: '24px 0 0',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  code: {
    fontFamily: 'Courier, monospace',
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: brand.saffron,
    margin: '0 0 24px',
    letterSpacing: '4px',
    textAlign: 'center' as const,
    background: brand.white,
    border: `1px solid ${brand.border}`,
    borderRadius: '6px',
    padding: '14px',
  } as React.CSSProperties,
}

const outerContainer: React.CSSProperties = {
  backgroundColor: brand.cream,
  maxWidth: '580px',
  margin: '0 auto',
  border: `1px solid ${brand.border}`,
  borderRadius: '8px',
  overflow: 'hidden',
}
const headerSection: React.CSSProperties = {
  background: brand.cream,
  padding: '32px 24px 16px',
  textAlign: 'center',
  borderBottom: `1px solid ${brand.border}`,
}
const brandWordmark: React.CSSProperties = {
  fontFamily: brand.fontHeading,
  fontSize: '20px',
  color: brand.saffron,
  margin: '0',
  letterSpacing: '0.5px',
  textAlign: 'center',
}
const omSymbol: React.CSSProperties = {
  fontSize: '22px',
  color: brand.gold,
  margin: '4px 0 0',
  textAlign: 'center',
}
const taglineText: React.CSSProperties = {
  fontSize: '11px',
  color: brand.mid,
  margin: '6px 0 0',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  textAlign: 'center',
}
const footerSection: React.CSSProperties = {
  borderTop: `1px solid ${brand.border}`,
  padding: '20px 32px 24px',
  textAlign: 'center',
  background: brand.cream,
}
const footerTagline: React.CSSProperties = {
  fontFamily: brand.fontHeading,
  fontSize: '13px',
  color: brand.gold,
  margin: '0 0 4px',
  fontStyle: 'italic',
  textAlign: 'center',
}
const footerSmall: React.CSSProperties = {
  fontSize: '11px',
  color: brand.mid,
  margin: '4px 0 0',
  textAlign: 'center',
}

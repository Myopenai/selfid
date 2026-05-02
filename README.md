# Self-ID Protocol

International-ready identity schema with legal compliance and verifiable claims.

## 🌍 Legal-Ready Features

- **Identity Assurance Levels**: self-asserted, verified, certified
- **Jurisdiction Clarity**: Explicit legal jurisdiction support
- **Verifiable Claims**: Structured, evidence-backed assertions
- **Audit Trail**: Complete consent and validation traceability
- **Cross-border Compliance**: GDPR and international data protection ready

## 📦 Quick Start

```bash
npm run validate
```

## 📁 Files

- `schema/selfid-schema.json` - International-ready schema definition
- `sample-selfid.json` - Realistic sample for developers
- `types.d.ts` - TypeScript definitions
- `validate.js` - Pure JavaScript validation utilities

## 🚀 Usage

```javascript
import { validateSelfID } from './validate.js';

// Validate a Self-ID package
const result = validateSelfID(sampleData);
if (result.valid) {
  console.log('Valid Self-ID:', result.data);
}
```

```typescript
// TypeScript support
import { SelfIDPackage, validateSelfID } from 'selfid-protocol';

const result = validateSelfID(sampleData);
if (result.valid) {
  const selfid: SelfIDPackage = result.data;
}
```

## 🔧 Schema Structure

### Entity (Legal-Ready)
- Identity assurance levels
- Jurisdiction information
- Verifiable claims with issuer tracking
- Legal consent and terms
- Structured metadata

### Network (Trust & Verification)
- Trust scoring system
- Validator assertions
- Audit trail
- Cross-entity links

## 🌐 Use Cases

- **Hiring Platforms**: Verify employment claims
- **Legal Systems**: Cross-border identity verification
- **Developer Tools**: Clear contract for identity data

## 📋 Compliance

- GDPR compatible
- ISO 27001 aligned
- Cross-border data protection
- User-controlled data retention

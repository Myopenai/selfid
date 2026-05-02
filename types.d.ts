/**
 * Self-ID Protocol TypeScript Definitions
 * International-ready identity schema with legal compliance
 */

export type AssuranceLevel = 'self-asserted' | 'verified' | 'certified';
export type IdentifierType = 'email' | 'phone' | 'url' | 'github' | 'linkedin' | 'twitter' | 'matrix' | 'other';
export type ClaimType = 'EMPLOYMENT' | 'EDUCATION' | 'CERTIFICATION' | 'AWARD' | 'MEMBERSHIP' | 'OTHER';
export type ClaimStatus = 'self-asserted' | 'verified' | 'certified' | 'revoked';
export type ValidatorType = 'ORG' | 'GOV' | 'EDU' | 'CERT' | 'PERSON';
export type LinkType = 'CIRCLE' | 'ORG' | 'COLLEAGUE' | 'CLIENT' | 'PARTNER' | 'OTHER';
export type AuditAction = 'CREATED' | 'UPDATED' | 'VALIDATED' | 'REVOKED' | 'LINKED';
export type DataController = 'self' | 'org' | 'third-party';
export type RetentionPolicy = 'user-controlled' | 'time-limited' | 'permanent';

export interface SelfIDPackage {
  type: 'SELF-ID-PACKAGE';
  version: string;
  entity: Entity;
  network: Network;
}

export interface Entity {
  id: string; // did:selfid:sha256:...
  assuranceLevel: AssuranceLevel;
  jurisdiction: string; // ISO 3166-1 alpha-2
  name: Name;
  identifiers: Identifier[];
  roles?: Role[];
  skills?: Skill[];
  claims?: Claim[];
  legal: Legal;
  meta: Metadata;
}

export interface Name {
  full: string;
  display?: string;
}

export interface Identifier {
  type: IdentifierType;
  value: string;
  verified?: boolean;
}

export interface Role {
  title: string;
  org: string;
  from?: string; // YYYY-MM
  to?: string; // YYYY-MM
  tags?: string[];
  evidenceRef?: string; // hash:...
}

export interface Skill {
  name: string;
  level: number; // 1-5
  framework?: string; // e.g., EU-eCF
}

export interface Claim {
  type: ClaimType;
  value: string;
  issuer: string;
  status: ClaimStatus;
}

export interface Legal {
  jurisdiction: string; // ISO 3166-1 alpha-2
  consentVersion: string;
  termsAcceptedAt: string; // ISO 8601 datetime
  dataController: DataController;
  retentionPolicy?: RetentionPolicy;
}

export interface Metadata {
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
  version: number;
}

export interface Network {
  trustScore: number; // 0-100
  validators?: Validator[];
  links?: Link[];
  auditTrail?: AuditEntry[];
}

export interface Validator {
  id: string;
  type: ValidatorType;
  jurisdiction?: string; // ISO 3166-1 alpha-2
  assertion: string;
  subjectRef?: string; // Reference to entity field
  evidenceHash?: string; // sha256:...
  timestamp: string; // ISO 8601 datetime
  assuranceLevel?: AssuranceLevel;
}

export interface Link {
  type: LinkType;
  label?: string;
  ref: string; // did:selfid:sha256:...
}

export interface AuditEntry {
  action: AuditAction;
  timestamp: string; // ISO 8601 datetime
  by?: string; // Entity ID that performed the action
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  data?: SelfIDPackage;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export declare function validateSelfID(data: unknown): ValidationResult;
export declare function calculateTrustScore(entity: Entity, network: Network): number;

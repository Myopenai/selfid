/**
 * Self-ID Protocol Validation
 * Pure JavaScript implementation - no dependencies required
 */

function validateDID(did) {
  const didPattern = /^did:selfid:sha256:[a-f0-9]{64}$/;
  return didPattern.test(did);
}

function validateCountryCode(code) {
  const countryCodePattern = /^[A-Z]{2}$/;
  return countryCodePattern.test(code);
}

function validateYearMonth(date) {
  const datePattern = /^\d{4}-\d{2}$/;
  if (!datePattern.test(date)) return false;
  
  const [year, month] = date.split('-').map(Number);
  return year >= 1900 && year <= 2100 && month >= 1 && month <= 12;
}

function validateHash(hash) {
  const hashPattern = /^hash:[a-f0-9]{64}$/;
  return hashPattern.test(hash);
}

function validateSHA256(hash) {
  const hashPattern = /^sha256:[a-f0-9]{64}$/;
  return hashPattern.test(hash);
}

function calculateTrustScore(entity, network) {
  let score = 0;
  
  if (entity.identifiers && entity.identifiers.length > 0) {
    score += 5;
  }
  
  const verifiedIdentifiers = entity.identifiers?.filter(id => id.verified) || [];
  score += verifiedIdentifiers.length * 2;
  
  if (entity.roles && entity.roles.length > 0) {
    score += entity.roles.length * 3;
  }
  
  if (entity.skills && entity.skills.length > 0) {
    score += entity.skills.length * 2;
  }
  
  const verifiedClaims = entity.claims?.filter(claim => claim.status === 'verified') || [];
  score += verifiedClaims.length * 5;
  
  const certifiedClaims = entity.claims?.filter(claim => claim.status === 'certified') || [];
  score += certifiedClaims.length * 10;
  
  if (network.validators && network.validators.length > 0) {
    score += network.validators.length * 8;
  }
  
  if (network.auditTrail && network.auditTrail.length > 0) {
    score += network.auditTrail.length * 1;
  }
  
  return Math.min(score, 100);
}

function validateSelfID(data) {
  try {
    if (typeof data !== 'object' || data === null) {
      return {
        valid: false,
        errors: [{ field: 'root', message: 'Data must be an object' }]
      };
    }
    
    if (data.type !== 'SELF-ID-PACKAGE') {
      return {
        valid: false,
        errors: [{ field: 'type', message: 'Type must be SELF-ID-PACKAGE' }]
      };
    }
    
    if (!data.version || !/^SNP-\d+\.\d+$/.test(data.version)) {
      return {
        valid: false,
        errors: [{ field: 'version', message: 'Invalid version format' }]
      };
    }
    
    const errors = [];
    
    // Validate entity
    if (!data.entity) {
      errors.push({ field: 'entity', message: 'Entity is required' });
    } else {
      if (!data.entity.id || !validateDID(data.entity.id)) {
        errors.push({ field: 'entity.id', message: 'Invalid DID format' });
      }
      
      if (!data.entity.assuranceLevel || !['self-asserted', 'verified', 'certified'].includes(data.entity.assuranceLevel)) {
        errors.push({ field: 'entity.assuranceLevel', message: 'Invalid assurance level' });
      }
      
      if (!data.entity.jurisdiction || !validateCountryCode(data.entity.jurisdiction)) {
        errors.push({ field: 'entity.jurisdiction', message: 'Invalid jurisdiction code' });
      }
      
      if (!data.entity.name || !data.entity.name.full) {
        errors.push({ field: 'entity.name', message: 'Name is required' });
      }
      
      if (!data.entity.identifiers || data.entity.identifiers.length === 0) {
        errors.push({ field: 'entity.identifiers', message: 'At least one identifier is required' });
      }
      
      if (!data.entity.legal) {
        errors.push({ field: 'entity.legal', message: 'Legal information is required' });
      } else {
        if (!data.entity.legal.jurisdiction || !validateCountryCode(data.entity.legal.jurisdiction)) {
          errors.push({ field: 'entity.legal.jurisdiction', message: 'Invalid legal jurisdiction code' });
        }
        
        if (!data.entity.legal.consentVersion) {
          errors.push({ field: 'entity.legal.consentVersion', message: 'Consent version is required' });
        }
        
        if (!data.entity.legal.termsAcceptedAt) {
          errors.push({ field: 'entity.legal.termsAcceptedAt', message: 'Terms acceptance date is required' });
        }
      }
    }
    
    // Validate network
    if (!data.network) {
      errors.push({ field: 'network', message: 'Network is required' });
    } else {
      if (typeof data.network.trustScore !== 'number' || data.network.trustScore < 0 || data.network.trustScore > 100) {
        errors.push({ field: 'network.trustScore', message: 'Trust score must be between 0 and 100' });
      }
    }
    
    if (errors.length > 0) {
      return { valid: false, errors };
    }
    
    // Calculate and verify trust score
    const calculatedScore = calculateTrustScore(data.entity, data.network);
    if (data.network.trustScore !== calculatedScore) {
      errors.push({
        field: 'network.trustScore',
        message: `Trust score mismatch. Expected ${calculatedScore}, got ${data.network.trustScore}`
      });
    }
    
    if (errors.length > 0) {
      return { valid: false, errors };
    }
    
    return { valid: true, data };
  } catch (error) {
    return {
      valid: false,
      errors: [{ field: 'root', message: error.message }]
    };
  }
}

// Load and validate sample file when run directly
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const samplePath = join(__dirname, 'sample-selfid.json');
  const sampleData = JSON.parse(readFileSync(samplePath, 'utf-8'));
  
  console.log('🔍 Validating Self-ID sample...');
  const result = validateSelfID(sampleData);
  
  if (result.valid) {
    console.log('✅ Sample Self-ID is valid!');
    console.log(`📊 Trust Score: ${result.data.network.trustScore}`);
    console.log(`🆔 Entity ID: ${result.data.entity.id}`);
    console.log(`🌍 Jurisdiction: ${result.data.entity.jurisdiction}`);
    console.log(`🔐 Assurance Level: ${result.data.entity.assuranceLevel}`);
  } else {
    console.log('❌ Sample Self-ID validation failed:');
    result.errors.forEach(error => {
      console.log(`  - ${error.field}: ${error.message}`);
    });
  }
} catch (error) {
  console.error('❌ Error reading sample file:', error.message);
}

export { validateSelfID, calculateTrustScore };

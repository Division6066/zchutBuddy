#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * 
 * Verifies that all required environment variables are present and properly configured
 * for development and production environments.
 */

const fs = require('fs');
const path = require('path');

// Required environment variables
const REQUIRED_VARS = {
  // Convex Backend
  NEXT_PUBLIC_CONVEX_URL: {
    required: true,
    format: 'https://*.convex.cloud',
    description: 'Convex deployment URL',
    env: 'dev/prod',
  },
  CONVEX_DEPLOYMENT: {
    required: false, // Optional for Vercel, needed for dev
    format: 'dev:* or prod:*',
    description: 'Convex deployment ID',
    env: 'dev only',
  },
  // OpenRouter API
  OPENROUTER_API_KEY: {
    required: true,
    format: 'sk-or-v1-*',
    description: 'OpenRouter API key for AI models',
    env: 'dev/prod',
  },
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {
    required: true,
    format: 'pk_test_* or pk_live_*',
    description: 'Clerk publishable API key',
    env: 'dev/prod',
  },
  CLERK_SECRET_KEY: {
    required: true,
    format: 'sk_test_* or sk_live_*',
    description: 'Clerk secret API key',
    env: 'dev/prod',
  },
  // Site Configuration
  SITE_URL: {
    required: true,
    format: 'http://localhost:3000 or https://yourdomain.com',
    description: 'Base URL of the application',
    env: 'dev/prod',
  },
  // Optional
  APP_PUBLIC_URL: {
    required: false,
    format: 'http://localhost:3000 or https://yourdomain.com',
    description: 'Public app URL (optional, defaults to SITE_URL)',
    env: 'dev/prod',
  },
};

const CONVEX_ENV_VARS = {
  AUTH_RESEND_KEY: {
    required: false,
    format: 're_*',
    description: 'Resend API key for email notifications',
    location: 'Convex Dashboard only',
  },
  AUTH_EMAIL_FROM: {
    required: false,
    format: 'email@domain.com',
    description: 'Email address to send from',
    location: 'Convex Dashboard only',
  },
  AUTH_GOOGLE_ID: {
    required: false,
    format: '*.apps.googleusercontent.com',
    description: 'Google OAuth client ID',
    location: 'Convex Dashboard only',
  },
  AUTH_GOOGLE_SECRET: {
    required: false,
    format: 'GOCSPX-*',
    description: 'Google OAuth client secret',
    location: 'Convex Dashboard only',
  },
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function maskValue(value, showChars = 8) {
  if (!value) return '(empty)';
  if (value.length <= showChars) return value;
  return value.substring(0, showChars) + '...' + value.substring(value.length - 4);
}

function checkEnvironmentVariables() {
  log('\n' + '='.repeat(70), 'cyan');
  log('ENVIRONMENT VARIABLES VERIFICATION', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  let missingRequired = [];
  let invalidFormat = [];
  let allGood = true;

  // Check .env.local
  const envLocalPath = path.join(process.cwd(), '.env.local');
  let envVars = {};

  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const lines = envContent.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    lines.forEach(line => {
      const [key, ...val] = line.split('=');
      if (key) {
        envVars[key.trim()] = val.join('=').trim();
      }
    });
    log('✓ Found .env.local file\n', 'green');
  } else {
    log('✗ .env.local file not found\n', 'red');
    allGood = false;
  }

  // Check required variables
  log('REQUIRED VARIABLES (for development and production):', 'blue');
  log('-'.repeat(70));

  Object.entries(REQUIRED_VARS).forEach(([key, config]) => {
    const value = envVars[key];
    const isPresent = !!value;
    const status = isPresent ? '✓' : '✗';
    const statusColor = isPresent ? 'green' : 'red';

    log(
      `${status} ${key.padEnd(35)} ${config.description.padEnd(30)}`,
      statusColor
    );

    if (!isPresent && config.required) {
      missingRequired.push(key);
      allGood = false;
    } else if (isPresent) {
      log(`  Format: ${config.format}`, 'cyan');
      log(`  Value:  ${maskValue(value)}`, 'cyan');
      log(`  Env:    ${config.env}`, 'cyan');

      // Validate format
      if (key === 'NEXT_PUBLIC_CONVEX_URL' && !validateUrl(value)) {
        log(`  ⚠️  Invalid URL format!`, 'red');
        invalidFormat.push(key);
        allGood = false;
      } else if (key === 'SITE_URL' && !validateUrl(value)) {
        log(`  ⚠️  Invalid URL format!`, 'red');
        invalidFormat.push(key);
        allGood = false;
      }
    } else if (!config.required) {
      log(`  (optional)`, 'yellow');
    }
    log('');
  });

  // Summary
  log('='.repeat(70), 'cyan');
  log('SUMMARY', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  if (missingRequired.length > 0) {
    log(`✗ Missing ${missingRequired.length} required variable(s):`, 'red');
    missingRequired.forEach(v => log(`  - ${v}`, 'red'));
    log('');
  }

  if (invalidFormat.length > 0) {
    log(`✗ ${invalidFormat.length} variable(s) with invalid format:`, 'red');
    invalidFormat.forEach(v => log(`  - ${v}`, 'red'));
    log('');
  }

  if (allGood) {
    log('✓ All required environment variables are properly configured!', 'green');
  } else {
    log('✗ Some environment variables are missing or invalid.', 'red');
  }

  log('\n' + '='.repeat(70), 'cyan');
  log('CONVEX DASHBOARD ENVIRONMENT VARIABLES', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  log('The following variables should be set in your Convex Dashboard:', 'blue');
  log('(Dashboard → Settings → Environment Variables)\n', 'cyan');

  Object.entries(CONVEX_ENV_VARS).forEach(([key, config]) => {
    log(`${key}`, 'yellow');
    log(`  Description: ${config.description}`, 'cyan');
    log(`  Format:      ${config.format}`, 'cyan');
    log(`  Required:    ${config.required ? 'Yes' : 'No'}`, 'cyan');
    log(`  Location:    ${config.location}`, 'blue');
    log('');
  });

  log('='.repeat(70), 'cyan');
  log('VERCEL DEPLOYMENT CHECKLIST', 'cyan');
  log('='.repeat(70) + '\n', 'cyan');

  log('To deploy to Vercel, ensure these variables are set:', 'blue');
  log('(Vercel Dashboard → Project → Settings → Environment Variables)\n', 'cyan');

  const vercelVars = [
    ['NEXT_PUBLIC_CONVEX_URL', maskValue(envVars['NEXT_PUBLIC_CONVEX_URL']), '✓'],
    ['OPENROUTER_API_KEY', maskValue(envVars['OPENROUTER_API_KEY']), '✓'],
    ['SITE_URL', '(your Vercel URL)', '⚠️ Set after first deploy'],
    ['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', maskValue(envVars['NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY']), '✓'],
    ['CLERK_SECRET_KEY', maskValue(envVars['CLERK_SECRET_KEY']), '✓'],
  ];

  vercelVars.forEach(([name, value, status]) => {
    const statusColor = status === '✓' ? 'green' : 'yellow';
    log(`${status} ${name}`, statusColor);
    log(`    ${value}\n`, 'cyan');
  });

  log('='.repeat(70) + '\n', 'cyan');

  return allGood;
}

// Run verification
const isValid = checkEnvironmentVariables();
process.exit(isValid ? 0 : 1);


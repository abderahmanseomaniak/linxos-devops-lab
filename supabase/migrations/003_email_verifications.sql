-- Table for storing OTP codes for email verification (form submission)
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '10 minutes',
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_email_code
  ON email_verifications (email, code);

-- Auto-cleanup old codes (older than 1 hour)
CREATE INDEX IF NOT EXISTS idx_email_verifications_created_at
  ON email_verifications (created_at);

-- Enable RLS (but API routes use service_role, so bypass is fine)
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Grant REST API access (for debugging)
GRANT ALL ON TABLE email_verifications TO anon, authenticated;

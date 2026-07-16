# Supabase Integration Setup Guide

Follow these steps to create the database table in your Supabase project so that the contact form submissions can be saved.

## 1. Run the SQL Command
Go to your [Supabase Dashboard](https://supabase.com), select your project (`fldbdrmdvfjhziormmhw`), navigate to the **SQL Editor** tab in the sidebar, create a new query, paste the following SQL command, and click **Run**:

```sql
-- Create the contact enquiries table
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow service role key (admin) to read/write freely without constraints
CREATE POLICY "Allow service role full access" 
ON contact_enquiries 
TO service_role 
USING (true) 
WITH CHECK (true);
```

Once this script runs, the form submissions will begin saving to the database automatically.

-- ============================================================
-- 037_contacts_last_purchase_at
--
-- Adds a native "last purchase date" field to contacts, shown as a
-- column in the Contacts table. This CRM has no built-in orders/
-- e-commerce model, so the value is populated externally (CSV
-- backfill from legacy sales data, future imports, manual edits).
--
-- Idempotent.
-- ============================================================

ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS last_purchase_at TIMESTAMPTZ;

COMMENT ON COLUMN contacts.last_purchase_at IS
  'Date of the contact''s most recent purchase. Not derived from any in-app order system — populated via CSV import or manual edit.';

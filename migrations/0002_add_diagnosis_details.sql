-- The remote database already contains diagnosis_details from a pre-migration
-- setup step. Keep this migration as a recorded no-op so future migrations can
-- proceed without attempting to add the column again.
SELECT 1;

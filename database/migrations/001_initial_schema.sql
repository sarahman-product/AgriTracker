-- AgriTrack Database Migration
-- Run this to create all necessary tables in Turso

-- ===================
-- USERS & AUTH
-- ===================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  mobile TEXT NOT NULL UNIQUE,
  email TEXT,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'field_agent',
  status TEXT NOT NULL DEFAULT 'pending',
  organization_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS agent_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  state TEXT,
  district TEXT,
  block TEXT,
  village TEXT,
  organization TEXT,
  profile_photo_url TEXT,
  id_proof_url TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS otp_requests (
  id TEXT PRIMARY KEY,
  mobile TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ===================
-- PROGRAMS & CROPS
-- ===================

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT DEFAULT 'active',
  start_date TEXT,
  end_date TEXT,
  geography_json TEXT,
  procurement_enabled INTEGER DEFAULT 0,
  grn_enabled INTEGER DEFAULT 0,
  vendor_enabled INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS clusters (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  name TEXT NOT NULL,
  state TEXT,
  district TEXT,
  block TEXT,
  villages_json TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE TABLE IF NOT EXISTS agent_program_mapping (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  cluster_id TEXT,
  role TEXT DEFAULT 'agent',
  status TEXT DEFAULT 'active',
  active_from TEXT,
  active_to TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (cluster_id) REFERENCES clusters(id)
);

CREATE TABLE IF NOT EXISTS crop_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS crop_groups (
  id TEXT PRIMARY KEY,
  category_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (category_id) REFERENCES crop_categories(id)
);

CREATE TABLE IF NOT EXISTS crops (
  id TEXT PRIMARY KEY,
  group_id TEXT,
  name TEXT NOT NULL,
  scientific_name TEXT,
  growing_season TEXT,
  harvest_months TEXT,
  FOREIGN KEY (group_id) REFERENCES crop_groups(id)
);

CREATE TABLE IF NOT EXISTS crop_varieties (
  id TEXT PRIMARY KEY,
  crop_id TEXT NOT NULL,
  variety_name TEXT NOT NULL,
  origin TEXT,
  typical_yield_kg_per_acre REAL,
  days_to_harvest INTEGER,
  FOREIGN KEY (crop_id) REFERENCES crops(id)
);

CREATE TABLE IF NOT EXISTS crop_stages (
  id TEXT PRIMARY KEY,
  crop_id TEXT NOT NULL,
  stage_name TEXT NOT NULL,
  stage_order INTEGER NOT NULL,
  duration_days INTEGER,
  description TEXT,
  prerequisite_stage_id TEXT,
  FOREIGN KEY (crop_id) REFERENCES crops(id),
  FOREIGN KEY (prerequisite_stage_id) REFERENCES crop_stages(id)
);

CREATE TABLE IF NOT EXISTS program_crop_mapping (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  crop_id TEXT NOT NULL,
  season TEXT,
  variety_required INTEGER DEFAULT 0,
  stage_template_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (crop_id) REFERENCES crops(id)
);

CREATE TABLE IF NOT EXISTS program_ui_config (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  crop_id TEXT,
  module_key TEXT NOT NULL,
  display_name TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_enabled INTEGER DEFAULT 1,
  FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- ===================
-- FARMERS & FARMS
-- ===================

CREATE TABLE IF NOT EXISTS farmers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  father_name TEXT,
  gender TEXT,
  date_of_birth TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  pincode TEXT,
  gps_location_json TEXT,
  aadhar_number TEXT,
  voter_id TEXT,
  farmer_category TEXT,
  is_fpo_member INTEGER DEFAULT 0,
  is_shg_member INTEGER DEFAULT 0,
  kyc_status TEXT DEFAULT 'pending',
  kyc_rejection_reason TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS farmer_program_mapping (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  cluster_id TEXT,
  agent_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (agent_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS farms (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  area_acres REAL NOT NULL,
  ownership_type TEXT,
  soil_type TEXT,
  irrigation_type TEXT,
  land_survey_number TEXT,
  centroid_lat REAL,
  centroid_lng REAL,
  gps_accuracy REAL,
  boundary_json TEXT,
  calculated_area REAL,
  is_gps_verified INTEGER DEFAULT 0,
  farm_photos_json TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id)
);

CREATE TABLE IF NOT EXISTS crop_enrollments (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  farm_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  crop_id TEXT NOT NULL,
  variety_id TEXT,
  season TEXT,
  sowing_date TEXT,
  expected_harvest_date TEXT,
  area_enrolled REAL,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  FOREIGN KEY (farm_id) REFERENCES farms(id),
  FOREIGN KEY (program_id) REFERENCES programs(id),
  FOREIGN KEY (crop_id) REFERENCES crops(id)
);

-- ===================
-- SURVEYS
-- ===================

CREATE TABLE IF NOT EXISTS survey_templates (
  id TEXT PRIMARY KEY,
  program_id TEXT,
  crop_id TEXT,
  stage_id TEXT,
  parent_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  form_schema_json TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS survey_logic_config (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL,
  logic_type TEXT NOT NULL,
  trigger_field TEXT,
  offset_days INTEGER,
  previous_survey_id TEXT,
  recurrence_rule_json TEXT,
  grace_period_days INTEGER,
  FOREIGN KEY (survey_id) REFERENCES survey_templates(id)
);

CREATE TABLE IF NOT EXISTS survey_instances (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL,
  crop_enrollment_id TEXT NOT NULL,
  farmer_id TEXT NOT NULL,
  farm_id TEXT NOT NULL,
  assigned_agent_id TEXT NOT NULL,
  activation_date TEXT,
  due_date TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (survey_id) REFERENCES survey_templates(id),
  FOREIGN KEY (crop_enrollment_id) REFERENCES crop_enrollments(id),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  FOREIGN KEY (assigned_agent_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS survey_responses (
  id TEXT PRIMARY KEY,
  instance_id TEXT NOT NULL,
  response_json TEXT NOT NULL,
  media_refs_json TEXT,
  gps_json TEXT,
  submitted_by TEXT,
  device_timestamp TEXT,
  server_timestamp TEXT DEFAULT (datetime('now')),
  sync_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'submitted',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (instance_id) REFERENCES survey_instances(id),
  FOREIGN KEY (submitted_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS survey_override_logs (
  id TEXT PRIMARY KEY,
  instance_id TEXT NOT NULL,
  action TEXT NOT NULL,
  old_value_json TEXT,
  new_value_json TEXT,
  reason TEXT,
  changed_by TEXT,
  changed_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (instance_id) REFERENCES survey_instances(id)
);

-- ===================
-- INPUTS & ACTIVITIES
-- ===================

CREATE TABLE IF NOT EXISTS input_records (
  id TEXT PRIMARY KEY,
  crop_enrollment_id TEXT NOT NULL,
  input_type TEXT NOT NULL,
  product TEXT,
  nutrient_type TEXT,
  quantity REAL,
  unit TEXT,
  date TEXT,
  cost REAL,
  method TEXT,
  photo_refs_json TEXT,
  gps_json TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (crop_enrollment_id) REFERENCES crop_enrollments(id)
);

CREATE TABLE IF NOT EXISTS pest_disease_records (
  id TEXT PRIMARY KEY,
  crop_enrollment_id TEXT NOT NULL,
  issue_type TEXT NOT NULL,
  severity TEXT,
  photo_refs_json TEXT,
  recommendation TEXT,
  follow_up_date TEXT,
  is_advised_accepted INTEGER DEFAULT 0,
  gps_json TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (crop_enrollment_id) REFERENCES crop_enrollments(id)
);

CREATE TABLE IF NOT EXISTS farm_visits (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  farm_id TEXT,
  crop_enrollment_id TEXT,
  agent_id TEXT NOT NULL,
  visit_type TEXT,
  purpose TEXT,
  gps_start_json TEXT,
  gps_end_json TEXT,
  notes TEXT,
  photos_json TEXT,
  started_at TEXT,
  ended_at TEXT,
  duration_minutes INTEGER,
  is_suspicious INTEGER DEFAULT 0,
  suspicion_reason TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  FOREIGN KEY (agent_id) REFERENCES users(id)
);

-- ===================
-- SAMPLING
-- ===================

CREATE TABLE IF NOT EXISTS samples (
  id TEXT PRIMARY KEY,
  crop_enrollment_id TEXT NOT NULL,
  sample_type TEXT NOT NULL,
  sample_code TEXT,
  date TEXT,
  gps_json TEXT,
  photo_refs_json TEXT,
  status TEXT DEFAULT 'pending',
  lab_dispatch_date TEXT,
  result_uploaded INTEGER DEFAULT 0,
  lab_result_ref TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (crop_enrollment_id) REFERENCES crop_enrollments(id)
);

-- ===================
-- HARVEST & PROCUREMENT
-- ===================

CREATE TABLE IF NOT EXISTS harvests (
  id TEXT PRIMARY KEY,
  crop_enrollment_id TEXT NOT NULL,
  harvest_date TEXT,
  quantity REAL,
  unit TEXT,
  quality_json TEXT,
  photo_refs_json TEXT,
  gps_json TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (crop_enrollment_id) REFERENCES crop_enrollments(id)
);

CREATE TABLE IF NOT EXISTS procurements (
  id TEXT PRIMARY KEY,
  farmer_id TEXT NOT NULL,
  crop_enrollment_id TEXT NOT NULL,
  center_id TEXT,
  gross_qty REAL NOT NULL,
  moisture_percent INTEGER,
  admixture_percent REAL,
  net_qty REAL,
  grade TEXT,
  rate REAL,
  amount REAL,
  payment_mode TEXT,
  payment_status TEXT DEFAULT 'pending',
  lot_id TEXT,
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (farmer_id) REFERENCES farmers(id),
  FOREIGN KEY (crop_enrollment_id) REFERENCES crop_enrollments(id)
);

CREATE TABLE IF NOT EXISTS lots (
  id TEXT PRIMARY KEY,
  lot_number TEXT NOT NULL UNIQUE,
  program_id TEXT,
  crop_id TEXT,
  center_id TEXT,
  total_qty REAL,
  grade TEXT,
  status TEXT DEFAULT 'created',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- ===================
-- GRN
-- ===================

CREATE TABLE IF NOT EXISTS grns (
  id TEXT PRIMARY KEY,
  grn_number TEXT NOT NULL UNIQUE,
  procurement_id TEXT,
  lot_id TEXT,
  farmer_id TEXT,
  crop_id TEXT,
  net_weight REAL,
  grade TEXT,
  total_amount REAL,
  payment_mode TEXT,
  payment_status TEXT,
  qr_payload TEXT,
  qr_code_url TEXT,
  pdf_url TEXT,
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'created',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS grn_amendments (
  id TEXT PRIMARY KEY,
  grn_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  previous_values_json TEXT,
  new_values_json TEXT,
  reason TEXT,
  amended_by TEXT,
  approved_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (grn_id) REFERENCES grns(id)
);

-- ===================
-- VENDORS & DISPATCH
-- ===================

CREATE TABLE IF NOT EXISTS vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  gst_number TEXT,
  contact_person TEXT,
  contact_mobile TEXT,
  contact_email TEXT,
  address TEXT,
  warehouse_lat REAL,
  warehouse_lng REAL,
  capacity_mt REAL,
  license_number TEXT,
  license_validity TEXT,
  license_doc_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS dispatches (
  id TEXT PRIMARY KEY,
  dispatch_number TEXT NOT NULL UNIQUE,
  lot_id TEXT NOT NULL,
  grn_id TEXT,
  from_center_id TEXT,
  to_vendor_id TEXT NOT NULL,
  dispatch_date TEXT,
  vehicle_number TEXT,
  driver_name TEXT,
  driver_mobile TEXT,
  dispatched_qty REAL,
  expected_delivery_date TEXT,
  eway_bill_number TEXT,
  qr_code TEXT,
  status TEXT DEFAULT 'created',
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (lot_id) REFERENCES lots(id),
  FOREIGN KEY (to_vendor_id) REFERENCES vendors(id)
);

CREATE TABLE IF NOT EXISTS delivery_confirmations (
  id TEXT PRIMARY KEY,
  dispatch_id TEXT NOT NULL,
  received_qty REAL,
  received_at TEXT,
  quality_observations TEXT,
  discrepancy_notes TEXT,
  discrepancy_percent REAL,
  confirmed_by TEXT,
  is_acknowledged INTEGER DEFAULT 0,
  acknowledged_by TEXT,
  acknowledged_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (dispatch_id) REFERENCES dispatches(id)
);

-- ===================
-- TRACEABILITY
-- ===================

CREATE TABLE IF NOT EXISTS traceability_events (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data_json TEXT,
  timestamp TEXT DEFAULT (datetime('now')),
  created_by TEXT
);

-- ===================
-- SYNC QUEUE
-- ===================

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  data_json TEXT,
  local_timestamp TEXT,
  sync_timestamp TEXT,
  status TEXT DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- ===================
-- INDEXES
-- ===================

CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_farmers_mobile ON farmers(mobile);
CREATE INDEX IF NOT EXISTS idx_farmers_program ON farmer_program_mapping(program_id);
CREATE INDEX IF NOT EXISTS idx_farms_farmer ON farms(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_enrollments_farmer ON crop_enrollments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crop_enrollments_farm ON crop_enrollments(farm_id);
CREATE INDEX IF NOT EXISTS idx_survey_instances_enrollment ON survey_instances(crop_enrollment_id);
CREATE INDEX IF NOT EXISTS idx_survey_instances_status ON survey_instances(status);
CREATE INDEX IF NOT EXISTS idx_procurements_farmer ON procurements(farmer_id);
CREATE INDEX IF NOT EXISTS idx_grns_lot ON grns(lot_id);
CREATE INDEX IF NOT EXISTS idx_dispatches_lot ON dispatches(lot_id);

-- Done!
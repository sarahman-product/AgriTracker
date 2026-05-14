# Module 6: Procurement / Buying

## Overview
Digitizes the complete farmer buying process - from harvest quantity estimation to actual purchase, quality grading, rate calculation, and payment tracking. Creates digital lot records for the GRN and traceability pipeline.

## User Stories

### US 6.1: Procurement Entry
**As a** procurement manager/field agent, **I want to** digitally record a farmer's crop purchase with quality parameters, **so that** an auto-generated GRN and traceable lot record is created.

**Acceptance Criteria:**
1. Procurement Date: Required, cannot be future
2. Farmer: Required, must have active crop enrollment
3. Crop & Variety: Auto-populated from enrollment
4. Procurement Center: Required, from mapped centers
5. Gross Weight: Required, positive, max 50,000 kg
6. Moisture %: Required, 0-100, integer
7. Admixture %: Required, 0-100, max 2 decimals
8. Net Weight: Auto-calculated (Gross - Deductions)
9. Grade: Required, A/B/C/Reject dropdown
10. Rate per kg: Required, program rate range validation
11. Total Amount: Auto-calculated (Net Wt x Rate)
12. Payment Mode: Cash/Cheque/NEFT/UPI
13. Lot Number: Auto-generated
14. Agent Notes: Optional, max 500 chars

### US 6.2: Lot Creation & Management
**As a** procurement manager, **I want to** aggregate procurement entries into lots, **so that** lots become the atomic unit of traceability.

**Acceptance Criteria:**
1. Manual lot creation by grouping entries
2. Auto-creation based on aggregation rules
3. Same crop, similar grade, same center
4. Lot is the unit for dispatch and traceability

### US 6.3: Harvest Quantity Tracking
**As a** field agent, **I want to** record farmer harvest quantity estimates during field visits, **so that** procurement pipeline can be tracked.

**Acceptance Criteria:**
1. Estimates recorded during pre-harvest visits
2. Creates procurement pipeline view
3. Procurement entries matched against estimates
4. Procurement coverage tracking

### US 6.4: Farmer Procurement Flow
**As a** procurement manager, **I want to** complete procurement entry with all quality parameters, **so that** GRN is auto-generated and farmer is notified.

**Acceptance Criteria:**
1. All mandatory fields validated
2. Net weight and total amount auto-calculated
3. GRN generated on save
4. Lot number assigned
5. Farmer notified via SMS
6. Entry appears in manager dashboard instantly

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/procurements | Create procurement entry |
| GET | /api/v1/procurements | List procurements |
| GET | /api/v1/procurements/:id | Get procurement details |
| PUT | /api/v1/procurements/:id | Update procurement |
| POST | /api/v1/lots | Create lot |
| GET | /api/v1/lots | List lots |
| GET | /api/v1/lots/:id | Get lot details |
| POST | /api/v1/lots/:id/add-entry | Add procurement to lot |
| GET | /api/v1/lots/:id/procurements | Get lot procurements |
| POST | /api/v1/harvest-estimates | Record harvest estimate |
| GET | /api/v1/harvest-estimates | List estimates |
| GET | /api/v1/procurements/pipeline | Get procurement pipeline |

## Database Tables

### procurements
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| procurement_date | DATE | NOT NULL |
| farmer_id | UUID | FOREIGN KEY |
| enrollment_id | UUID | FOREIGN KEY |
| center_id | UUID | FOREIGN KEY |
| crop_id | UUID | FOREIGN KEY |
| variety_id | UUID | FOREIGN KEY |
| gross_weight | DECIMAL(10,2) | NOT NULL |
| moisture_percent | INTEGER | NOT NULL |
| admixture_percent | DECIMAL(5,2) | NOT NULL |
| deductions_weight | DECIMAL(10,2) | Calculated |
| net_weight | DECIMAL(10,2) | Calculated |
| grade | ENUM | A,B,C,reject |
| rate_per_kg | DECIMAL(10,2) | NOT NULL |
| total_amount | DECIMAL(15,2) | Calculated |
| payment_mode | ENUM | cash,cheque,neft,upi |
| payment_status | ENUM | pending,paid,overdue |
| lot_id | UUID | FOREIGN KEY |
| grn_id | UUID | FOREIGN KEY |
| agent_notes | TEXT | |
| created_by | UUID | FOREIGN KEY |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### lots
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| lot_number | VARCHAR(50) | UNIQUE, NOT NULL |
| crop_id | UUID | FOREIGN KEY |
| center_id | UUID | FOREIGN KEY |
| grade | ENUM | |
| total_quantity | DECIMAL(10,2) | |
| status | ENUM | created,dispatched,delivered |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### procurement_centers
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| code | VARCHAR(20) | UNIQUE |
| address | TEXT | |
| gps_location | JSONB | |
| program_ids | UUID[] | |
| is_active | BOOLEAN | DEFAULT true |

### harvest_estimates
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| farmer_id | UUID | FOREIGN KEY |
| enrollment_id | UUID | FOREIGN KEY |
| estimated_quantity | DECIMAL(10,2) | |
| estimate_date | DATE | |
| created_by | UUID | FOREIGN KEY |
| created_at | TIMESTAMP | |

## Validations

### Procurement Entry
- Future dates not allowed
- Farmer must have active crop enrollment
- Rate must be within program rate card range
- Net weight = Gross - (moisture deduction + admixture deduction)

### Quality Parameters
- Moisture: 0-100, integer
- Admixture: 0-100, max 2 decimal places

### Lot Aggregation
- Same crop required
- Similar grade required (within one grade level)
- Same procurement center required

## Technical Notes

- Payment gateway integration excluded from MVP (Phase 2)
- Rate card engine excluded from MVP
- Works fully offline - saves locally, syncs on reconnect
- Priority: Procurement > GRN > Survey Responses > Visits
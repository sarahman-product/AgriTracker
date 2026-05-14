# Module 3: Farmer & Farm Management

## Overview
The core data collection module. It manages the complete farmer profile lifecycle - from first registration to full KYC, bank detail collection, farm geo-tagging, and multi-crop tracking.

## User Stories

### US 3.1: Farmer Onboarding
**As a** field agent, **I want to** onboard farmers directly from the mobile app, even offline, **so that** farmer registration can happen in remote areas.

**Acceptance Criteria:**
1. Multi-step wizard with inline validations
2. Duplicate detection in real-time
3. Real-time geo-location capture
4. All fields with proper validations:
   - Personal: First name, last name, father/spouse name, gender, DOB, mobile, photo
   - Address: Village, block, district, state, pincode, GPS location
   - Identity: Aadhar (12-digit with Luhn check), Aadhar photo, voter ID optional
   - Farmer Category: Small/Marginal/Large, FPO/SHG membership
   - Bank Details: Account holder, account number, IFSC (API validation), bank name, branch, cancelled cheque

### US 3.2: Farm Onboarding
**As a** field agent, **I want to** create farm records with geo-tagged boundaries for each farmer, **so that** farm data feeds into procurement and yield calculations.

**Acceptance Criteria:**
1. Multiple farms per farmer supported
2. Farm Name: Required, unique per farmer
3. Farm Area: Required, positive number, max 1000 acres
4. Ownership Type: Owned/Leased/Shared
5. Land Survey Number: Optional
6. Soil Type: Black/Red/Sandy/Loam/Clay (dropdown)
7. Irrigation Type: Drip/Flood/Sprinkler/Rainfed (dropdown)
8. GPS Polygon: Min 4 GPS points required
9. Farm Photos: Up to 5, min 1 required

### US 3.3: Crop Enrollment
**As a** field agent, **I want to** enroll specific crops on a farm for the current program season, **so that** procurement pipeline can be tracked.

**Acceptance Criteria:**
1. Capture sowing date, expected harvest date
2. Select variety from master list
3. Seed source tracking
4. Sown area recording
5. Intercropping supported (multiple crops per farm)

### US 3.4: Farmer KYC & Document Management
**As a** field agent/manager, **I want to** complete the KYC workflow for farmers, **so that** identity verification status is tracked.

**Acceptance Criteria:**
1. KYC Status: Pending/In Progress/Verified/Rejected
2. Rejection includes reason
3. Re-submission workflow for rejected KYC
4. Document upload and verification tracking

### US 3.5: Farm Geo-Tagging
**As a** field agent, **I want to** geo-tag a farmer's farm boundaries, **so that** the exact farm location and area can be verified and used for satellite monitoring.

**Acceptance Criteria:**
1. Agent walks farm boundary and captures polygon with min 4 GPS points
2. Farm area auto-calculated from GPS polygon
3. GPS accuracy must be < 10 meters
4. Farm polygon visible on map overlay
5. Works offline with GPS hardware

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/farmers | Create farmer (offline-capable) |
| GET | /api/v1/farmers | List farmers with filtering |
| GET | /api/v1/farmers/:id | Get farmer details |
| PUT | /api/v1/farmers/:id | Update farmer |
| DELETE | /api/v1/farmers/:id | Soft delete farmer |
| POST | /api/v1/farms | Create farm with GPS polygon |
| GET | /api/v1/farms | List farms |
| GET | /api/v1/farms/:id | Get farm details |
| PUT | /api/v1/farms/:id | Update farm |
| POST | /api/v1/crop-enrollments | Enroll crop on farm |
| GET | /api/v1/crop-enrollments | List enrollments |
| PUT | /api/v1/crop-enrollments/:id | Update enrollment |
| POST | /api/v1/farmers/:id/kyc | Submit KYC documents |
| GET | /api/v1/farmers/:id/kyc | Get KYC status |
| PUT | /api/v1/farmers/:id/kyc/verify | Verify KYC (manager) |
| GET | /api/v1/farmers/search | Search farmers (Elasticsearch) |
| GET | /api/v1/farms/:id/polygon | Get farm GPS polygon |

## Database Tables

### farmers
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | |
| father_spouse_name | VARCHAR(200) | |
| gender | ENUM | male,female,other |
| date_of_birth | DATE | |
| mobile | VARCHAR(10) | NOT NULL |
| alternate_mobile | VARCHAR(10) | |
| photo_url | VARCHAR(500) | |
| village | VARCHAR(255) | |
| block | VARCHAR(255) | |
| district | VARCHAR(255) | |
| state | VARCHAR(255) | |
| pincode | VARCHAR(6) | |
| gps_location | JSONB | {lat, lng} |
| aadhar_number | VARCHAR(12) | UNIQUE, encrypted |
| aadhar_front_url | VARCHAR(500) | |
| aadhar_back_url | VARCHAR(500) | |
| voter_id | VARCHAR(20) | |
| farmer_category | ENUM | small,marginal,large |
| is_fpo_member | BOOLEAN | DEFAULT false |
| is_shg_member | BOOLEAN | DEFAULT false |
| kyc_status | ENUM | pending,in_progress,verified,rejected |
| kyc_rejection_reason | TEXT | |
| enrolled_by | UUID | FOREIGN KEY (users) |
| program_id | UUID | FOREIGN KEY |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### farmer_bank_details
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| farmer_id | UUID | FOREIGN KEY |
| account_holder_name | VARCHAR(255) | NOT NULL |
| account_number | VARCHAR(50) | NOT NULL, encrypted |
| ifsc_code | VARCHAR(11) | NOT NULL |
| bank_name | VARCHAR(255) | |
| branch_name | VARCHAR(255) | |
| cancelled_cheque_url | VARCHAR(500) | |
| is_verified | BOOLEAN | DEFAULT false |

### farms
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| farmer_id | UUID | FOREIGN KEY |
| farm_name | VARCHAR(100) | NOT NULL |
| area_acres | DECIMAL(10,2) | NOT NULL |
| ownership_type | ENUM | owned,leased,shared |
| land_survey_number | VARCHAR(100) | |
| soil_type | ENUM | black,red,sandy,loam,clay |
| irrigation_type | ENUM | drip,flood,sprinkler,rainfed |
| gps_polygon | JSONB | Array of {lat,lng} points |
| calculated_area | DECIMAL(10,2) | Auto-calculated |
| is_gps_verified | BOOLEAN | DEFAULT false |
| farm_photos | VARCHAR(500)[] | Max 5 URLs |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### crop_enrollments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| farm_id | UUID | FOREIGN KEY |
| crop_id | UUID | FOREIGN KEY |
| variety_id | UUID | FOREIGN KEY |
| program_id | UUID | FOREIGN KEY |
| season | VARCHAR(50) | |
| sowing_date | DATE | |
| expected_harvest_date | DATE | |
| seed_source | VARCHAR(100) | |
| sown_area | DECIMAL(10,2) | |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

## Validations

### Farmer Mobile
- 10-digit Indian format
- Unique in system

### Aadhar Number
- 12 digits
- Luhn check validation
- Field-level encrypted storage

### IFSC Code
- 11 characters
- API validation via bank service

### GPS Polygon
- Minimum 4 points required
- Auto-calculate area from polygon

### Photo Requirements
- Farmer photo: min 100KB, max 5MB
- Farm photos: min 1, max 5, max 5MB each
- Aadhar photos: front and back required

## Technical Notes

- Offline-first: Create, edit, view fully supported offline
- Duplicate detection on mobile number
- KYC document verification excluded from MVP (Phase 2)
- Bank API integration excluded from MVP
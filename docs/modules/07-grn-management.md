# Module 7: GRN Management

## Overview
Auto-generates digital Goods Receipt Notes for every procurement event. Each GRN contains a unique QR code encoding the lot's full traceability data. GRNs are primary financial and compliance documents.

## User Stories

### US 7.1: Auto GRN Generation
**As a** procurement manager, **I want to** have GRN auto-generated on procurement save, **so that** manual GRN creation is eliminated.

**Acceptance Criteria:**
1. GRN auto-generated within seconds of procurement save
2. GRN contains all procurement details, quality parameters, payment info
3. Unique QR code generated
4. No manual GRN creation step required

### US 7.2: GRN Contents
**As an** Admin, **I want to** have all required fields in GRN, **so that** it serves as a complete financial and compliance document.

**Acceptance Criteria:**
- Header: GRN Number (unique), Date, Procurement Center, Program Name
- Farmer Details: Farmer Name, Farmer ID, Village, Farm ID
- Crop Details: Crop Name, Variety, Crop Season
- Quality Parameters: Gross Weight, Moisture %, Admixture %, Net Weight, Grade
- Financial: Rate per kg, Total Amount, Payment Mode, Payment Status
- Lot Information: Lot Number, Lot QR Code
- Signatures: Agent Name & Signature, Farmer Signature/Thumbprint, Center Supervisor
- Traceability: QR Code encoding Lot ID, Farmer ID, Farm ID, Crop ID, Procurement Date

### US 7.3: QR Code Generation & Scanning
**As a** stakeholder, **I want to** scan the QR code to retrieve complete origin history, **so that** traceability is verified.

**Acceptance Criteria:**
1. QR encodes full traceability payload as signed JWT
2. QR can be scanned at any supply chain point
3. Tampering detected and shown

### US 7.4: PDF Generation & Sharing
**As a** user, **I want to** download or share GRN as professionally formatted PDF, **so that** physical documents are eliminated.

**Acceptance Criteria:**
1. A4 formatted PDF generation
2. Download, print, or share via WhatsApp
3. PDFs stored immutably in cloud storage
4. Version tracking for amendments

### US 7.5: Amendment Workflow
**As a** procurement manager, **I want to** amend GRN within 48 hours with manager approval, **so that** corrections are tracked.

**Acceptance Criteria:**
1. Amendments within 48 hours only
2. Manager approval required
3. New version created (v1.0, v1.1)
4. Audit trail showing original values, changed values, reason, approver

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/grns/generate | Auto-generate GRN for procurement |
| GET | /api/v1/grns | List GRNs |
| GET | /api/v1/grns/:id | Get GRN details |
| GET | /api/v1/grns/:id/pdf | Download GRN as PDF |
| GET | /api/v1/grns/:id/qr | Get QR code image |
| POST | /api/v1/grns/:id/amend | Amend GRN |
| GET | /api/v1/grns/:id/history | Get GRN version history |
| GET | /api/v1/grns/procurement/:procurementId | Get GRN by procurement |

## Database Tables

### grns
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| grn_number | VARCHAR(50) | UNIQUE, NOT NULL |
| procurement_id | UUID | FOREIGN KEY |
| lot_id | UUID | FOREIGN KEY |
| farmer_id | UUID | FOREIGN KEY |
| crop_id | UUID | FOREIGN KEY |
| variety_id | UUID | FOREIGN KEY |
| net_weight | DECIMAL(10,2) | |
| grade | ENUM | |
| total_amount | DECIMAL(15,2) | |
| payment_mode | ENUM | |
| payment_status | ENUM | |
| qr_payload | TEXT | Signed JWT |
| qr_code_url | VARCHAR(500) | |
| pdf_url | VARCHAR(500) | |
| version | INTEGER | DEFAULT 1 |
| status | ENUM | created,amended |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### grn_amendments
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| grn_id | UUID | FOREIGN KEY |
| version | INTEGER | NOT NULL |
| previous_values | JSONB | |
| new_values | JSONB | |
| reason | TEXT | |
| amended_by | UUID | FOREIGN KEY |
| approved_by | UUID | FOREIGN KEY |
| created_at | TIMESTAMP | |

### grn_signatures
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| grn_id | UUID | FOREIGN KEY |
| role | ENUM | agent,farmer,supervisor |
| signature_type | ENUM | digital,thumbnail |
| signature_data | TEXT | Base64 |
| signed_at | TIMESTAMP | |

## Validations

### GRN Generation
- Automatically triggered on procurement save
- QR payload signed with private key
- PDF generated within 5 seconds

### Amendment
- Only within 48 hours of creation
- Manager approval required
- Creates new version, preserves original

### QR Code
- Signed JWT payload
- Contains: lot_id, farmer_id, farm_id, crop_id, procurement_date
- Tamper detection on scan

## Technical Notes

- Amendment workflow excluded from MVP
- WhatsApp sharing excluded from MVP (Phase 2)
- PDF generation: Puppeteer headless Chrome
- QR generation: qrcode.js
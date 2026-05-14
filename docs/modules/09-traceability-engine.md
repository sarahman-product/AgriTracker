# Module 9: Traceability Engine

## Overview
Provides farmer-to-market traceability for every lot - from the specific farmer and farm that grew the crop, through procurement, GRN, dispatch, to the final warehouse or market destination. Enables premium pricing, export compliance, and fraud prevention.

## User Stories

### US 9.1: End-to-End Lot Traceability
**As a** Program Manager, **I want to** view the complete traceability chain for any lot, **so that** I can verify origin and compliance.

**Acceptance Criteria:**
1. Complete chain: Farmers (origin) -> Farm + Geo-location -> Crop Variety + Season -> POP Compliance Data -> Harvest Date -> Procurement Event -> GRN -> Dispatch -> Vehicle + Route -> Warehouse Receipt -> Market/Buyer
2. All nodes timestamped and verified
3. Data accessible in real-time

### US 9.2: QR Scan Traceability
**As a** buyer/auditor/consumer, **I want to** scan a QR code on a shipment bag and see the complete farm-to-door history, **so that** I can verify origin claims and compliance.

**Acceptance Criteria:**
1. QR scan opens page in 2 seconds
2. Shows farm origin on map
3. Shows farmer category and certification status
4. Shows crop details and practices compliance
5. Shows full journey timeline
6. Page accessible without login
7. QR tampering detected

### US 9.3: Batch Aggregation Traceability
**As a** export manager, **I want to** combine multiple lots into a batch with inherited traceability, **so that** EUDR compliance is met.

**Acceptance Criteria:**
1. Multiple lots combined into batch
2. Batch inherits all constituent lot profiles
3. Batch QR code links to individual lot histories
4. Supports EU Deforestation Regulation requirements

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/trace/:lotId | Get full traceability chain for lot |
| GET | /api/v1/trace/qr/:code | Lookup by QR code |
| GET | /api/v1/trace/public/:lotId | Public trace view (no auth) |
| GET | /api/v1/trace/farmer/:farmerId | Get traces by farmer |
| POST | /api/v1/trace/batches | Create batch |
| GET | /api/v1/trace/batches/:id | Get batch traceability |
| GET | /api/v1/trace/batches/:id/lots | Get batch constituent lots |
| POST | /api/v1/trace/verify | Verify QR authenticity |

## Database Tables

### traceability_chains
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| lot_id | UUID | FOREIGN KEY |
| farmer_id | UUID | FOREIGN KEY |
| farm_id | UUID | FOREIGN KEY |
| crop_id | UUID | FOREIGN KEY |
| variety_id | UUID | FOREIGN KEY |
| season | VARCHAR(50) | |
| sowing_date | DATE | |
| harvest_date | DATE | |
| procurement_date | DATE | |
| grn_id | UUID | |
| dispatch_id | UUID | |
| delivery_id | UUID | |
| compliance_score | DECIMAL(5,2) | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### traceability_nodes
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| chain_id | UUID | FOREIGN KEY |
| node_type | VARCHAR(50) | farm,procurement,grn,dispatch,delivery |
| node_id | UUID | |
| node_data | JSONB | |
| gps_location | JSONB | |
| timestamp | TIMESTAMP | |
| is_verified | BOOLEAN | DEFAULT true |

### trace_batches
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| batch_code | VARCHAR(50) | UNIQUE |
| lot_ids | UUID[] | |
| created_at | TIMESTAMP | |
| created_by | UUID | |

### qr_scan_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| qr_code | VARCHAR(255) | |
| lot_id | UUID | |
| scanned_at | TIMESTAMP | |
| scan_location | JSONB | |
| is_valid | BOOLEAN | |

## Public Traceability View

### Origin Section
- State, District, Village
- Farm GPS location on map

### Farmer Section
- First name only (privacy)
- Category (Small/Marginal/Large)
- Certification status

### Crop Section
- Crop name, variety, season
- Sowing date, harvest date

### Practices Section
- Summary of POP compliance (% stages completed)
- No raw data exposed

### Journey Section
- Visual timeline: Farm -> Procurement -> Dispatch -> Delivery

### Certifications Section
- Any organic or program certifications

### Authenticity Section
- Verified badge or tampered warning

## Validations

### QR Code
- Signed JWT payload
- Timestamp validation
- Tamper detection on decode

### Public View
- No authentication required
- Limited data exposure (privacy)
- Rate limiting: 1000 requests/minute

## Technical Notes

- Consumer-facing QR page excluded from MVP (Phase 3)
- Batch aggregation traceability excluded from MVP (Phase 2)
- Blockchain anchoring excluded from Phase 3
- CDN caching for high-traffic trace pages
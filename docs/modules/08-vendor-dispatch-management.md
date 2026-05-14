# Module 8: Vendor & Dispatch Management

## Overview
Manages the post-GRN supply chain - from procurement center to warehouse to end market. Tracks vendor relationships, dispatch events, vehicle movements, and quantity reconciliation.

## User Stories

### US 8.1: Vendor Onboarding
**As an** Admin, **I want to** register vendors with complete business and banking details, **so that** they can participate in the supply chain.

**Acceptance Criteria:**
1. Vendor Name: Legal business name
2. Vendor Code: Auto-generated unique code
3. GST Number: GSTIN with API validation
4. Contact Person: Name, mobile, email
5. Warehouse Address: Full address with GPS
6. Storage Capacity: Maximum storage in MT
7. Commodity License: Number, validity, document upload
8. Bank Details: For payment reconciliation

### US 8.2: Dispatch Creation
**As a** procurement manager, **I want to** create dispatch records for lot movement, **so that** goods can be tracked from procurement center to vendor.

**Acceptance Criteria:**
1. Lot Number: From GRN (required)
2. Dispatch Date and Time: Required
3. From: Procurement Center
4. To: Vendor/Warehouse dropdown
5. Vehicle Number: Format validated
6. Driver Name and Mobile: Required
7. Quantity Dispatched: Must match GRN lot quantity
8. Expected Delivery Date: Required
9. E-Way Bill Number: Optional
10. Dispatch QR code generated for vehicle

### US 8.3: Delivery Confirmation
**As a** vendor/warehouse operator, **I want to** confirm delivery by scanning dispatch QR code, **so that** received goods are recorded in the system.

**Acceptance Criteria:**
1. QR scan opens delivery confirmation
2. Record received quantity
3. Record received timestamp
4. Record quality observations
5. Record discrepancy notes
6. Discrepancies > 2% trigger reconciliation alert

### US 8.4: Quantity Reconciliation
**As a** procurement manager, **I want to** track quantity at every node, **so that** discrepancies are detected and resolved.

**Acceptance Criteria:**
1. Track: Procurement -> Dispatch -> Received
2. Flag discrepancies at each step
3. Require manager acknowledgment
4. Reconciliation report available:
   - Total procurement vs dispatched vs received
   - By lot, program, and period

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/vendors | Create vendor |
| GET | /api/v1/vendors | List vendors |
| GET | /api/v1/vendors/:id | Get vendor details |
| PUT | /api/v1/vendors/:id | Update vendor |
| DELETE | /api/v1/vendors/:id | Deactivate vendor |
| POST | /api/v1/dispatches | Create dispatch |
| GET | /api/v1/dispatches | List dispatches |
| GET | /api/v1/dispatches/:id | Get dispatch details |
| POST | /api/v1/dispatches/:id/confirm | Vendor confirms delivery |
| GET | /api/v1/dispatches/:id/receive | Get dispatch for receipt |
| GET | /api/v1/reconciliation | Get reconciliation report |
| GET | /api/v1/reconciliation/lot/:lotId | Lot-level reconciliation |

## Database Tables

### vendors
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| vendor_name | VARCHAR(255) | NOT NULL |
| vendor_code | VARCHAR(20) | UNIQUE |
| gst_number | VARCHAR(15) | UNIQUE |
| contact_person | VARCHAR(255) | |
| contact_mobile | VARCHAR(10) | |
| contact_email | VARCHAR(255) | |
| warehouse_address | TEXT | |
| warehouse_gps | JSONB | {lat, lng} |
| storage_capacity_mt | DECIMAL(10,2) | |
| commodity_license_number | VARCHAR(100) | |
| commodity_license_validity | DATE | |
| commodity_license_doc_url | VARCHAR(500) | |
| bank_account_name | VARCHAR(255) | |
| bank_account_number | VARCHAR(50) | |
| bank_ifsc | VARCHAR(11) | |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | |

### dispatches
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| dispatch_number | VARCHAR(50) | UNIQUE |
| lot_id | UUID | FOREIGN KEY |
| from_center_id | UUID | FOREIGN KEY |
| to_vendor_id | UUID | FOREIGN KEY |
| dispatch_date | TIMESTAMP | NOT NULL |
| vehicle_number | VARCHAR(20) | NOT NULL |
| driver_name | VARCHAR(255) | |
| driver_mobile | VARCHAR(10) | |
| dispatched_quantity | DECIMAL(10,2) | NOT NULL |
| expected_delivery_date | DATE | |
| eway_bill_number | VARCHAR(50) | |
| qr_code | TEXT | |
| status | ENUM | created,in_transit,delivered,received |
| created_by | UUID | FOREIGN KEY |
| created_at | TIMESTAMP | |

### delivery_confirmations
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| dispatch_id | UUID | FOREIGN KEY |
| received_quantity | DECIMAL(10,2) | |
| received_at | TIMESTAMP | |
| quality_observations | TEXT | |
| discrepancy_notes | TEXT | |
| discrepancy_percent | DECIMAL(5,2) | |
| confirmed_by | UUID | FOREIGN KEY |
| is_acknowledged | BOOLEAN | DEFAULT false |
| acknowledged_by | UUID | |
| acknowledged_at | TIMESTAMP | |

### quantity_reconciliations
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| lot_id | UUID | FOREIGN KEY |
| procurement_qty | DECIMAL(10,2) | |
| dispatched_qty | DECIMAL(10,2) | |
| received_qty | DECIMAL(10,2) | |
| dispatch_discrepancy | DECIMAL(10,2) | |
| receipt_discrepancy | DECIMAL(10,2) | |
| status | ENUM | ok,flagged,resolved |
| resolved_by | UUID | |
| resolved_at | TIMESTAMP | |

## Validations

### Dispatch
- Quantity cannot exceed available lot quantity
- Vehicle number format validation
- Driver mobile validation

### Delivery Confirmation
- QR scan required
- Discrepancy > 2% triggers alert
- Requires supervisor confirmation for over-receipt

## Technical Notes

- Vehicle tracking excluded from MVP
- E-way bill integration excluded from MVP
- Vendor portal with login for delivery confirmation (Phase 2)
- Offline QR scan mode supported
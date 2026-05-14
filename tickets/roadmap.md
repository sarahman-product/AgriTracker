# AgriTrack Development Roadmap

## Overview
This roadmap outlines the phased development approach for AgriTrack, based on the Product Requirements Document v1.0. The project is divided into three major phases: MVP (Months 0-4), Phase 2 (Months 4-8), and Phase 3 (Months 8-15).

---

## Phase 1: MVP (Months 0-4)

### Timeline
- **Start**: Month 0
- **End**: Month 4
- **Goal**: Core platform with offline-first mobile app, basic procurement workflow, and QR-based traceability

### Epics

#### Epic 1: Authentication & User Management
**Priority**: P0 (Critical)
**Description**: OTP-based login, role-based access control, hierarchy management
**Deliverables**:
- JWT-based authentication system
- 6 user roles (Super Admin, Admin, Program Manager, Cluster Manager, Field Agent, Vendor)
- Territory mapping with geo-fencing (warning mode)
- User registration and profile management

#### Epic 2: Program & Crop Framework
**Priority**: P0 (Critical)
**Description**: Configuration backbone for programs, crops, and stages
**Deliverables**:
- Program creation and management
- 4-level crop taxonomy (Category > Crop Group > Crop > Variety)
- Crop stage configuration with prerequisite support
- Program crop mapping with KPI targets

#### Epic 3: Farmer & Farm Management
**Priority**: P0 (Critical)
**Description**: Core data collection - farmer onboarding, farm geo-tagging, crop enrollment
**Deliverables**:
- Multi-step farmer onboarding wizard (offline-capable)
- Farm creation with GPS polygon capture
- Multi-crop enrollment per farm
- Basic KYC status tracking (no document verification)

#### Epic 4: Dynamic POP Engine
**Priority**: P1 (High)
**Description**: Survey builder and response capture
**Deliverables**:
- Survey builder with 6 field types (text, numeric, single/multi select, date, photo, GPS)
- Conditional logic engine (show/hide based on answers)
- Survey response capture (offline)
- Input tracking forms (fertilizer, pesticide, irrigation, harvest)

#### Epic 5: Visit Tracking
**Priority**: P1 (High)
**Description**: Geo-stamped visit records
**Deliverables**:
- Visit creation with auto GPS capture
- Visit history with filtering
- Suspicious visit detection (< 2 min, GPS mismatch)
- Activity log per farmer

#### Epic 6: Procurement & Buying
**Priority**: P0 (Critical)
**Description**: Digital procurement workflow
**Deliverables**:
- Procurement entry with quality parameters (moisture, admixture, grade)
- Auto net weight calculation
- Lot creation and management
- Harvest quantity estimation

#### Epic 7: GRN Management
**Priority**: P0 (Critical)
**Description**: Auto GRN generation with QR code
**Deliverables**:
- Auto GRN generation on procurement save
- GRN contents (header, farmer, crop, quality, financial, signatures)
- QR code generation (signed JWT payload)
- PDF generation (A4 format)

#### Epic 8: Vendor & Dispatch Management
**Priority**: P2 (Medium)
**Description**: Post-procurement supply chain
**Deliverables**:
- Basic vendor onboarding
- Dispatch creation with vehicle details
- Delivery confirmation via QR scan
- Basic quantity reconciliation (< 2% discrepancy flag)

#### Epic 9: Traceability Engine
**Priority**: P1 (High)
**Description**: End-to-end lot traceability
**Deliverables**:
- Lot traceability chain (farm to delivery)
- QR scan lookup (internal use)
- Basic compliance score calculation

#### Epic 10: Dashboard & Analytics
**Priority**: P2 (Medium)
**Description**: Role-specific dashboards
**Deliverables**:
- Field Agent dashboard (targets, farmers, pending surveys)
- Cluster Manager dashboard (agent performance, alerts)
- Procurement dashboard (quantity, quality, payment)
- Program Manager dashboard (KPI progress, crop coverage)

---

## Phase 2: Months 4-8

### Timeline
- **Start**: Month 4
- **End**: Month 8

### Goals
- Full KYC verification workflow
- Payment gateway integration
- Advanced analytics and reports
- WhatsApp integration
- Vendor portal

### New Features

| Feature | Description |
|---------|-------------|
| KYC Document Verification | Full verification workflow with document upload |
| Payment Gateway Integration | NEFT/UPI disbursements to farmers |
| Exportable Reports | Excel/PDF reports with scheduled delivery |
| WhatsApp Integration | GRN sharing, critical alerts to farmers |
| Video Capture Support | Survey video field type |
| Vendor Portal | Login-based delivery confirmation |
| Batch Aggregation Traceability | Multiple lots combined for export |

---

## Phase 3: Months 8-15

### Timeline
- **Start**: Month 8
- **End**: Month 15

### Goals
- AI-powered features
- Satellite monitoring
- Voice-based data entry
- Blockchain traceability
- Consumer-facing features

### Future Features

| Feature | Description |
|---------|-------------|
| AI Crop Advisory | OpenAI/Google Vertex AI integration |
| AI Disease Detection | ML-based image analysis |
| Satellite Crop Monitoring | NDVI from Sentinel-2/Planet |
| Voice-Based Data Entry | Bhashini API for regional languages |
| Blockchain Traceability | Immutable anchor for export compliance |
| Farmer Credit Scoring | AgriFinance integration |
| Consumer QR Page | Brand experience for end consumers |
| Predictive Yield Analytics | Weather + satellite + historical data |

---

## Technical Milestones

### Milestone 1: Foundation (Month 1)
- [ ] Project setup (frontend, backend, database)
- [ ] Authentication system (OTP, JWT)
- [ ] Database schema design and migrations
- [ ] API standards and documentation

### Milestone 2: Core Data (Month 2)
- [ ] Program & crop framework
- [ ] Farmer onboarding (offline-capable)
- [ ] Farm management with GPS
- [ ] Crop enrollment

### Milestone 3: Field Operations (Month 3)
- [ ] Survey builder
- [ ] Visit tracking
- [ ] Procurement entry
- [ ] GRN auto-generation

### Milestone 4: Supply Chain (Month 4)
- [ ] Vendor management
- [ ] Dispatch workflow
- [ ] Basic traceability
- [ ] Role-based dashboards
- [ ] **MVP Release**

---

## Phase-wise Build Plan (Execution PRD v2.0)

Based on the Developer Build PRD, the following sprint-based build plan should be followed:

### Sprint 0: Foundation
- Project setup, folder structure
- Turso database connection
- Auth skeleton (OTP, JWT)
- UI theme and base components

**Output**: Running APK shell + backend/API skeleton

### Sprint 1: Agent Management
- Agent registration
- Login with OTP verification
- Admin approval workflow
- Program mapping

**Output**: Agent can register and access mapped program

### Sprint 2: Program Configuration
- Program/crop/season configuration
- Dynamic home UI based on program/crop
- UI module configuration

**Output**: Home UI changes by selected program/crop

### Sprint 3: Farmer & Farm Data
- Farmer onboarding
- Farm/plot creation with GPS
- Crop enrollment

**Output**: Full farmer-farm-crop data capture

### Sprint 4: Survey Engine
- Survey template builder
- Survey logic configuration
- Survey instance generation at farmer-farm-crop level

**Output**: Configurable surveys working per farmer/farm/crop

### Sprint 5: Activity Hub
- POP/Advisory content
- Input records (seed, fertilizer, CP, irrigation)
- Pest/disease monitoring
- Farm visits
- Sampling management

**Output**: Complete crop activity hub

### Sprint 6: Procurement & GRN
- Harvest recording
- Procurement entry
- Lot creation
- GRN auto-generation

**Output**: Buying and GRN flow working

### Sprint 7: Supply Chain
- Vendor management
- Dispatch creation
- Delivery confirmation
- Traceability chain view

**Output**: Farm-to-vendor traceability visible

### Sprint 8: Dashboard & Polish
- Role-based dashboards
- Reports and exports
- Offline sync hardening
- QA and bug fixes

**Output**: Pilot-ready APK

---

## Database Strategy

### MVP: Turso Database
As per Execution PRD v2.0, the MVP will use Turso as the database layer for rapid build and iteration. This allows for quick schema changes during development.

### Production: PostgreSQL + PostGIS
For production scale, migration to PostgreSQL with PostGIS for geo-queries is recommended.

---

## Dependencies

### External Services (MVP)
| Service | Purpose | Integration |
|---------|---------|--------------|
| Turso | MVP database | Direct |
| PostgreSQL + PostGIS | Production database | Direct |
| Redis | Session & cache | Direct |
| Firebase Cloud Messaging | Push notifications | SDK |
| Twilio / MSG91 | SMS (OTP, alerts) | API |
| AWS S3 / Azure Blob | Media storage | SDK |
| Elasticsearch | Farmer search | API |

### Build Tools
- Frontend: React Native (Expo), React.js
- Backend: Node.js + NestJS
- Database: Turso (MVP), PostgreSQL (production)
- PDF: Puppeteer
- QR: qrcode.js

---

## Risks & Mitigations

| Risk | Probability | Mitigation |
|------|-------------|-------------|
| Agent adoption failure | Medium | Guided onboarding, vernacular UI, training |
| Offline sync conflicts | Low | CRDT-based sync, manual conflict queue |
| Survey config errors | High | Preview mode, staging environment |
| GPS spoofing | Medium | Server validation, anomaly detection |
| Scale failure | Medium | Auto-scaling, load testing before harvest |

---

## Success Metrics

### Adoption
- Daily Active Agents: > 85% of registered
- Farmer Onboarding: > 5 per agent per week
- Survey Completion: > 85%
- App Session Duration: > 8 minutes

### Data Quality
- GPS Capture Rate: > 95%
- Photo Capture Rate: > 90%
- Duplicate Farmer Rate: < 0.5%
- Survey Completeness: > 98%

### Supply Chain
- GRN Auto-generation: 100%
- Traceability Coverage: > 98%
- Dispatch Reconciliation: > 95%
- Lot-to-Market Tracking: > 90%

---

## Notes

- All dates are relative to project start (Month 0)
- MVP scope excludes features marked "Excluded from MVP" in PRD
- Phase 2 and 3 scope subject to MVP feedback and market conditions
- Monthly sprint planning recommended for agile execution

---

## Edge Cases and Business Rules

These edge cases must be handled in development, not decided ad-hoc:

| Edge Case | Handling |
|-----------|----------|
| Agent registers with duplicate mobile number | Block registration; show existing status. If old account inactive, allow admin merge/reactivation. |
| Agent has no approved program mapping | Login allowed but show "No Active Program Assigned" screen. |
| Agent has multiple programs | Show program selection screen after login. |
| Agent has one active program | Open that program home directly. |
| Farmer already exists in another program | Allow reuse; map existing farmer to new program rather than recreate duplicate. |
| Same farmer mobile but different village/name | Show duplicate warning; allow admin override only. |
| Farm area entered greater than known landholding | Warn and require reason/approval depending on program. |
| Crop area greater than farm area | Block or require admin override (Recommend: block in MVP). |
| Sowing date missing | Use crop enrollment date or onboarding date as fallback based on survey config. |
| Survey due but previous survey missing | Follow rule: block, auto-close, or admin override. Default: sequential surveys require previous completion. |
| Two agents open same survey offline | First successful sync wins; duplicate goes to conflict queue. |
| Agent removed from program before offline sync | Allow sync if activity timestamp was before removal; mark for manager review. |
| Banned chemical entered | Show compliance warning, flag record, notify manager; do not silently accept. |
| Procurement quantity exceeds harvest estimate | Warn and require manager approval if beyond threshold. |
| GRN created with wrong quantity | No delete; use amendment workflow. |
| Dispatch received quantity mismatch | Create discrepancy record and flag reconciliation dashboard. |
| Poor GPS accuracy | Allow save with warning, mark low_accuracy = true. For critical geo verification, require recapture. |
| Photo upload fails | Keep record saved and upload media in retry queue. |
| Device date/time manipulated | Store device timestamp and server sync timestamp; flag large mismatch. |

---

## Developer Prompt Template

When using AI tools to build modules, use this template:

```
Read docs/AgriTrack_Execution_PRD_v2.0.docx.

Build only MODULE: [module name].

Before coding, show:
1. Files to be created/modified
2. Database tables used
3. API endpoints
4. Validation rules
5. Business logic
6. Edge cases
7. Acceptance criteria

Do not build unrelated modules.
Do not hardcode crop/program survey logic.
Use configuration-driven design as defined in the PRD.
```

---

## Future Integration Roadmap

After MVP validation, AgriTrack should integrate with existing DeHaat systems:

| System | Integration Logic |
|--------|-------------------|
| AgriPulse APK | Embed AgriTrack module or expose selected workflows |
| DigiAcre CMS | Use as program/admin configuration layer |
| Kheti Farmer DB | Map AgriTrack farmer_id to Kheti farmer master ID |
| Farmer 360 | Open profile using farmer context |
| Crop Doctor | Pass farmer/crop/photo context, store diagnosis history |
| KhetEdge | Open advisory subscription for selected farmer/crop |
| LMS/POP | Use existing content repositories where available |
| ERP/Procurement | Push GRN/procurement/vendor dispatch after pilot validation |
# Module 5: Visit Tracking

## Overview
Provides geo-stamped, time-tracked records of every field visit by agents. Creates an auditable trail of agent activity and provides managers with real-time field visibility.

## User Stories

### US 5.1: Visit Creation
**As a** field agent, **I want to** initiate a visit on arrival at a farmer's location, **so that** my field activity is tracked with GPS and timestamps.

**Acceptance Criteria:**
1. System captures GPS coordinates on arrival
2. Timestamps visit start
3. Links visit to farmer and farm
4. On leaving, agent ends visit recording duration
5. Visit notes and photos can be attached

### US 5.2: Visit History & Activity Log
**As a** Cluster Manager, **I want to** view all visits with filtering and suspicious visit detection, **so that** I can monitor agent activity and compliance.

**Acceptance Criteria:**
1. Chronological activity log per farmer
2. Filter by agent, date range, visit type, program
3. Suspicious visits flagged automatically:
   - Duration < 2 minutes
   - GPS far from farmer's farm
4. Visit type categories: Farmer Visit, Survey Visit, Procurement Visit, Follow-up

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/visits | Start a visit |
| PUT | /api/v1/visits/:id | End a visit |
| GET | /api/v1/visits | List visits with filtering |
| GET | /api/v1/visits/:id | Get visit details |
| GET | /api/v1/visits/agent/:agentId | Get visits by agent |
| GET | /api/v1/visits/farmer/:farmerId | Get visits for farmer |
| GET | /api/v1/visits/map | Get visits on map view |
| GET | /api/v1/visits/suspicious | Get flagged suspicious visits |
| POST | /api/v1/visits/:id/notes | Add visit notes |
| POST | /api/v1/visits/:id/photos | Add visit photos |

## Database Tables

### visits
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| agent_id | UUID | FOREIGN KEY |
| farmer_id | UUID | FOREIGN KEY |
| farm_id | UUID | FOREIGN KEY |
| visit_type | ENUM | farmer,survey,procurement,followup |
| start_time | TIMESTAMP | NOT NULL |
| end_time | TIMESTAMP | |
| duration_minutes | INTEGER | Calculated |
| gps_start | JSONB | {lat, lng} |
| gps_end | JSONB | {lat, lng} |
| activities | VARCHAR[] | survey,photo,advice,procurement,other |
| notes | TEXT | Max 500 chars |
| photo_urls | VARCHAR[] | Max 5 |
| is_suspicious | BOOLEAN | DEFAULT false |
| suspicion_reason | TEXT | |
| created_at | TIMESTAMP | |

### visit_activities
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| visit_id | UUID | FOREIGN KEY |
| activity_type | VARCHAR(50) | |
| activity_data | JSONB | |
| created_at | TIMESTAMP | |

## Validations

### Visit Creation
- Farmer must exist and be active
- GPS accuracy validation (< 10 meters)
- Cannot start visit if previous visit not ended

### Visit End
- End time must be after start time
- GPS capture required on exit

### Suspicious Detection
- Duration < 2 minutes = suspicious
- Distance from farm > 500 meters = suspicious
- Manual override requires manager approval

## Technical Notes

- Works fully offline
- Auto GPS capture on visit start/end
- Route optimization excluded from MVP
- Gamification excluded from MVP
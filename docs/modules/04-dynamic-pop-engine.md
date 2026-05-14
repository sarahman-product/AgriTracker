# Module 4: Dynamic POP Engine

## Overview
The most technically sophisticated module. It enables admins to design complex, conditional, multimedia-capable crop stage surveys without engineering work.

## User Stories

### US 4.1: Survey Builder (Admin)
**As an** Admin/Program Manager, **I want to** design surveys using a drag-and-drop interface, **so that** crop stage-specific surveys can be created without coding.

**Acceptance Criteria:**
1. Surveys linked to specific crop stages
2. When crop reaches a stage, survey available to field agents
3. Support for field types: Text Input, Numeric, Single Select, Multi-Select, Date Picker, Photo Capture, GPS Capture, Signature, Section Header, Conditional Group, Table/Matrix

### US 4.2: Conditional Logic Engine
**As a** survey designer, **I want to** create conditional fields that show/hide based on answers, **so that** relevant questions are asked based on context.

**Acceptance Criteria:**
1. Support conditions: equals, not equals, greater than, less than, contains, is empty
2. Parent field selection
3. Trigger value configuration
4. Nested conditional groups supported

### US 4.3: POP Survey Response Capture
**As a** field agent, **I want to** fill surveys in the field during farmer visits, **so that** POP compliance and crop health data is captured accurately.

**Acceptance Criteria:**
1. Survey UI rendered dynamically from survey definition
2. Responses stored locally (offline)
3. Synced when connectivity returns
4. Each submission geo-stamped and time-stamped

### US 4.4: Input Tracking Forms
**As a** field agent, **I want to** record specialized input data, **so that** fertilizer, pesticide, irrigation, and harvest records are tracked.

**Acceptance Criteria:**
1. Fertilizer Application: product name, quantity, date, method
2. Pesticide/Herbicide: product, dose, spray date, interval
3. Irrigation Events: date, method, duration, water quantity
4. Harvesting Records: date, quantity, quality grade

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/surveys | List surveys with filtering |
| POST | /api/v1/surveys | Create survey |
| GET | /api/v1/surveys/:id | Get survey definition |
| PUT | /api/v1/surveys/:id | Update survey |
| DELETE | /api/v1/surveys/:id | Archive survey |
| POST | /api/v1/surveys/:id/publish | Publish survey |
| GET | /api/v1/surveys/:id/preview | Preview survey |
| GET | /api/v1/surveys/by-stage/:stageId | Get survey for crop stage |
| POST | /api/v1/survey-responses | Submit survey response |
| GET | /api/v1/survey-responses | List responses |
| GET | /api/v1/survey-responses/:id | Get response details |
| GET | /api/v1/survey-responses/pending | Get pending surveys by agent |
| POST | /api/v1/survey-responses/:id/amend | Amend response |

## Database Tables

### surveys
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | |
| program_id | UUID | FOREIGN KEY |
| crop_id | UUID | FOREIGN KEY |
| stage_id | UUID | FOREIGN KEY |
| form_schema_json | JSONB | Survey definition |
| is_active | BOOLEAN | DEFAULT false |
| is_published | BOOLEAN | DEFAULT false |
| version | INTEGER | DEFAULT 1 |
| created_by | UUID | FOREIGN KEY |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### survey_field_types
| Column | Type | Constraints |
|--------|------|-------------|
| type | VARCHAR(50) | PRIMARY KEY |
| name | VARCHAR(100) | |
| validation_schema | JSONB | |

### survey_responses
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| survey_id | UUID | FOREIGN KEY |
| enrollment_id | UUID | FOREIGN KEY |
| agent_id | UUID | FOREIGN KEY |
| responses_json | JSONB | |
| gps_location | JSONB | {lat, lng} |
| submitted_at | TIMESTAMP | |
| is_amended | BOOLEAN | DEFAULT false |
| amendment_reason | TEXT | |
| sync_status | ENUM | pending,synced,conflict,error |

### survey_fields
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| survey_id | UUID | FOREIGN KEY |
| field_type | VARCHAR(50) | |
| field_label | VARCHAR(255) | |
| field_key | VARCHAR(100) | Unique within survey |
| is_required | BOOLEAN | DEFAULT false |
| options | JSONB | For select types |
| validation_rules | JSONB | Min/max, regex |
| conditional_logic | JSONB | Parent field, condition |
| order_index | INTEGER | |

## Validations

### Field Types
- Text: min/max length, regex validation
- Numeric: min/max value, decimal places, unit
- Single Select: custom options, default value
- Multi Select: custom options, max selections
- Date: date range constraints
- Photo: min/max photos, min file size
- GPS: auto-capture or manual

### Conditional Logic
- Parent field must exist in survey
- Condition must be valid operator
- Trigger value must match expected type

### Survey Response
- All required fields must be filled
- GPS captured on submission
- Immutable after submission (amendment workflow)

## Technical Notes

- Video capture excluded from MVP (Phase 2)
- Voice entry excluded from Phase 2 (Phase 3)
- Auto-save on every field change for crash recovery
- Survey completion updates crop stage progress
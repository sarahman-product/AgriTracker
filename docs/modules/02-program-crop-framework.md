# Module 2: Program & Crop Framework

## Overview
The configurability backbone of the platform. It defines the universe of programs, crops, crop categories, varieties, and crop stages. All downstream modules derive their configuration from this module.

## User Stories

### US 2.1: Program Creation
**As an** Admin, **I want to** create programs with defined geographies, crops, date ranges, and hierarchies, **so that** different agri-interventions can be managed.

**Acceptance Criteria:**
1. Program Name: Required, unique, max 100 chars
2. Program Code: Required, unique, 4-10 chars, uppercase
3. Crop Categories: Multi-select from master list (at least one required)
4. Geography: State > District > Block multi-select (required)
5. Start/End Date: End date > Start date
6. Budget: Optional numeric
7. KPI Targets: Farmer count, area, procurement volume targets

### US 2.2: Universal Crop Framework
**As an** Admin, **I want to** manage a 4-level crop taxonomy, **so that** any crop, variety, in any geography can be configured without engineering work.

**Acceptance Criteria:**
- Level 1: Category (e.g., Spices, Horticulture, Cereals)
- Level 2: Crop Group (e.g., Seed Spices, Citrus Fruits)
- Level 3: Crop (e.g., Cumin, Orange)
- Level 4: Variety (e.g., Gujarat Cumin V1)

### US 2.3: Crop Stage Configuration
**As an** Admin, **I want to** configure growth stages for each crop, **so that** specific POP survey forms are triggered.

**Acceptance Criteria:**
1. Configurable stages: Sowing, Germination, Vegetative, Flowering, Fruiting, Harvest
2. Each stage has typical duration in days
3. Stages trigger specific POP survey forms
4. Stages are ordered with prerequisite stages support

### US 2.4: Program Crop Mapping
**As a** Program Manager, **I want to** map specific crops to a program with target metrics, **so that** program performance can be tracked.

**Acceptance Criteria:**
1. Link crops from master list to program
2. Set target area in acres
3. Set target farmer count
4. Track progress against targets

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/programs | Create new program |
| GET | /api/v1/programs | List programs |
| GET | /api/v1/programs/:id | Get program details |
| PUT | /api/v1/programs/:id | Update program |
| DELETE | /api/v1/programs/:id | Archive program |
| GET | /api/v1/crop-categories | List crop categories |
| POST | /api/v1/crop-categories | Create crop category |
| GET | /api/v1/crop-groups | List crop groups |
| POST | /api/v1/crop-groups | Create crop group |
| GET | /api/v1/crops | List crops |
| POST | /api/v1/crops | Create crop |
| GET | /api/v1/crop-varieties | List varieties by crop |
| POST | /api/v1/crop-varieties | Create variety |
| GET | /api/v1/crop-stages | List stages by crop |
| POST | /api/v1/crop-stages | Create crop stage |
| PUT | /api/v1/crop-stages/:id | Update crop stage order |
| POST | /api/v1/program-crops | Map crop to program |
| GET | /api/v1/program-crops/:programId | Get crops for program |

## Database Tables

### programs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| code | VARCHAR(10) | NOT NULL, UNIQUE |
| description | TEXT | |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |
| budget | DECIMAL(15,2) | |
| organization_id | UUID | FOREIGN KEY |
| geography | JSONB | State/District/Block |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### crop_category
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| icon | VARCHAR(255) | |
| description | TEXT | |
| is_active | BOOLEAN | DEFAULT true |

### crop_group
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| category_id | UUID | FOREIGN KEY |
| name | VARCHAR(100) | NOT NULL |
| description | TEXT | |

### crop_master
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| group_id | UUID | FOREIGN KEY |
| name | VARCHAR(100) | NOT NULL |
| scientific_name | VARCHAR(255) | |
| growing_season | VARCHAR(50) | |
| harvest_months | VARCHAR(50) | |

### crop_variety
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| crop_id | UUID | FOREIGN KEY |
| variety_name | VARCHAR(100) | NOT NULL |
| origin | VARCHAR(100) | |
| typical_yield_kg_per_acre | DECIMAL(10,2) | |
| days_to_harvest | INTEGER | |

### crop_stage
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| crop_id | UUID | FOREIGN KEY |
| stage_name | VARCHAR(50) | NOT NULL |
| stage_order | INTEGER | NOT NULL |
| duration_days | INTEGER | |
| description | TEXT | |
| prerequisite_stage_id | UUID | FOREIGN KEY (self) |

### program_crop
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| program_id | UUID | FOREIGN KEY |
| crop_id | UUID | FOREIGN KEY |
| target_area | DECIMAL(12,2) | |
| target_farmers | INTEGER | |
| is_active | BOOLEAN | DEFAULT true |

### program_kpi_targets
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| program_id | UUID | FOREIGN KEY |
| target_type | VARCHAR(50) | farmer_count, area, procurement |
| target_value | DECIMAL(12,2) | |
| current_value | DECIMAL(12,2) | DEFAULT 0 |

## Validations

### Program
- Program Code: 4-10 uppercase alphanumeric characters
- End date must be greater than start date
- At least one crop category required

### Crop Taxonomy
- 4-level hierarchy must be maintained
- Category, Group, Crop names must be unique within parent

### Crop Stage
- Stage order must be sequential
- Duration days must be positive integer

## Technical Notes

- Satellite monitoring integration excluded from MVP
- Stage progression triggers survey availability
- All queries use PostgreSQL with PostGIS for geo operations
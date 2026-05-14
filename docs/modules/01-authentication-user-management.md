# Module 1: Authentication & User Management

## Overview
Handles all authentication, role assignment, territory mapping, and hierarchy management for all 6 user roles. It is the security and access foundation of the entire platform.

## User Stories

### US 1.1: OTP-Based Login
**As a** field agent, **I want to** log in using my mobile number and OTP, **so that** I can access the platform securely without remembering passwords.

**Acceptance Criteria:**
1. OTP received within 30 seconds
2. OTP valid for 5 minutes
3. 3 failed attempts trigger 15-minute lockout
4. Successful login redirects to role-specific home screen
5. Session persists for 24 hours on mobile

### US 1.2: Agent Registration & Profile
**As an** Admin/Program Manager, **I want to** register new agents with personal details, territory assignment, and program mapping, **so that** they can access the platform with appropriate permissions.

**Acceptance Criteria:**
1. Agent receives login credentials post-registration approval
2. All required fields captured: Name, mobile, email, DOB, gender, photo
3. Professional details: Employee ID, designation, joining date, organization
4. Territory mapping: State, district, block, village cluster assignment
5. Program mapping: Agent can be mapped to multiple programs

### US 1.3: Hierarchy Management
**As an** Admin, **I want to** manage the 5-level hierarchy, **so that** users are properly organized and can access appropriate data.

**Acceptance Criteria:**
1. 5-level hierarchy: Organization > Program > Zone > Cluster > Village
2. Cluster Managers assigned to clusters
3. Program Managers assigned to programs
4. Field Agents assigned to village clusters

### US 1.4: Territory Mapping
**As an** Admin, **I want to** geo-fence agents to their assigned territories, **so that** data integrity is maintained.

**Acceptance Criteria:**
1. Geo-fence radius configurable per program (default: 5km)
2. Warning generated for out-of-territory farmer creation
3. Territory violations flagged in manager dashboard

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/otp | Send OTP to mobile number |
| POST | /api/v1/auth/verify | Verify OTP, return JWT token |
| POST | /api/v1/auth/refresh | Refresh JWT token |
| GET | /api/v1/users/me | Get current user profile + permissions |
| POST | /api/v1/users | Create new user (Admin) |
| GET | /api/v1/users | List users with filtering |
| GET | /api/v1/users/:id | Get user by ID |
| PUT | /api/v1/users/:id | Update user details |
| DELETE | /api/v1/users/:id | Deactivate user |
| GET | /api/v1/roles | List available roles |
| GET | /api/v1/hierarchy | Get hierarchy tree |

## Database Tables

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| mobile | VARCHAR(10) | NOT NULL, UNIQUE |
| email | VARCHAR(255) | UNIQUE |
| name | VARCHAR(255) | NOT NULL |
| role | ENUM | NOT NULL |
| organization_id | UUID | FOREIGN KEY |
| program_ids | UUID[] | |
| territory_id | UUID | FOREIGN KEY |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | |

### user_sessions
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY |
| token | TEXT | NOT NULL |
| refresh_token | TEXT | |
| expires_at | TIMESTAMP | NOT NULL |
| created_at | TIMESTAMP | |

### hierarchies
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| level | INTEGER | NOT NULL (1-5) |
| parent_id | UUID | FOREIGN KEY (self) |
| program_id | UUID | FOREIGN KEY |

### territories
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| type | ENUM(state,district,block,cluster,village) | NOT NULL |
| hierarchy_id | UUID | FOREIGN KEY |
| geo_polygon | JSONB | |
| radius_km | DECIMAL | DEFAULT 5 |

## Validations

### Mobile Number
- Must be 10-digit Indian format
- Must be unique in system

### OTP
- 6-digit numeric
- Valid for 5 minutes
- 3 failed attempts = 15-minute lockout

### Role Assignment
- Super Admin: Full CRUD on all modules
- Admin: Program config, user management, master data
- Program Manager: Program analytics, survey config, agent management
- Cluster Manager: Agent oversight, farmer approval, procurement review
- Field Agent: Farmer/farm onboarding, surveys, procurement entry
- Vendor: GRN receipt, dispatch confirmation, inventory view

## Permission Matrix

| Module | Super Admin | Admin | Prog. Mgr | Cluster Mgr | Field Agent | Vendor |
|--------|-------------|------|-----------|-------------|-------------|--------|
| User Management | Full | Full | View Only | View Only | None | None |
| Program Config | Full | Full | Edit | View | None | None |
| Dashboard | Full | Full | Program | Cluster | Personal | Limited |

## Technical Notes

- JWT token expiry: 24 hours for agents, 8 hours for admin roles
- OTP delivery: SMS primary, WhatsApp fallback
- Session storage: Redis for active sessions
- Password: Not used (OTP-based authentication)
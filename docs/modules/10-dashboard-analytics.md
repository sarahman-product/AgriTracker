# Module 10: Dashboard & Analytics

## Overview
Delivers role-specific analytics and operational intelligence to every stakeholder. Turns raw field data into actionable insights - from agent performance to program-level crop analytics.

## User Stories

### US 10.1: Field Agent Dashboard
**As a** field agent, **I want to** see my daily targets, farmer status, pending surveys, and recent activity, **so that** I can prioritize my work.

**Acceptance Criteria:**
- Today's Targets: Visits target vs completed
- My Farmers: Total active, pending KYC, pending surveys
- Pending Surveys: Farmers with overdue crop stage surveys
- Recent Visits: Last 5 visits with timestamps
- Sync Status: Last sync time, pending offline records count
- Notifications: Manager messages, system alerts

### US 10.2: Cluster Manager Dashboard
**As a** Cluster Manager, **I want to** monitor agent performance, territory coverage, procurement pipeline, and alerts, **so that** I can manage my cluster effectively.

**Acceptance Criteria:**
- Agent Performance: Visits, surveys, farmers per agent (table + chart)
- Territory Coverage: Farmers on map by village cluster
- Procurement Pipeline: Expected vs actual harvest quantity by crop
- Survey Compliance: % stage surveys completed per crop
- KYC Status: Farmers by KYC status (donut chart)
- Alerts Queue: Territory violations, suspicious visits, pending approvals

### US 10.3: Procurement Dashboard
**As a** Procurement Manager, **I want to** see procurement metrics by center, crop, grade, and payment status, **so that** I can track procurement operations.

**Acceptance Criteria:**
- Total Procured: MTD/YTD quantity and value, trend chart
- Procurement by Crop: Quantity and grade breakdown
- Lot Status: GRN generated, dispatched, received counts
- Quality Distribution: Grade A/B/C/Reject % pie chart
- Payment Status: Paid, pending, overdue amounts
- Center Performance: Comparison across procurement centers

### US 10.4: Program Manager Dashboard
**As a** Program Manager, **I want to** track KPI progress, crop coverage, yield analytics, and agent leaderboards, **so that** I can measure program effectiveness.

**Acceptance Criteria:**
- KPI Progress: Target vs actual (farmers, area, procurement volume)
- Crop Coverage Map: Heatmap of enrolled farms by geography
- Stage Progression: % of crop population at each POP stage
- Yield Analytics: Actual vs expected yield by variety
- Traceability Coverage: % of procurement with complete traceability
- Agent Leaderboard: Top performing agents by composite score

### US 10.5: Exportable Reports
**As a** manager, **I want to** export dashboard data as Excel or PDF, **so that** I can share with stakeholders.

**Acceptance Criteria:**
1. Export as Excel or PDF
2. Scheduled report delivery via email (manager/admin)
3. Available reports:
   - Farmer Master Report
   - Crop Status Report
   - Procurement Report
   - Agent Performance Report
   - Traceability Audit Report
   - KYC Compliance Report

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/analytics/dashboard/agent/:agentId | Agent dashboard data |
| GET | /api/v1/analytics/dashboard/cluster/:clusterId | Cluster manager dashboard |
| GET | /api/v1/analytics/dashboard/procurement | Procurement dashboard |
| GET | /api/v1/analytics/dashboard/program/:programId | Program manager dashboard |
| GET | /api/v1/analytics/kpis | Get KPI data |
| GET | /api/v1/analytics/agent-performance | Agent performance metrics |
| GET | /api/v1/analytics/procurement-trends | Procurement trend data |
| GET | /api/v1/analytics/crop-coverage | Crop coverage analytics |
| GET | /api/v1/reports/farmer-master | Farmer master report |
| GET | /api/v1/reports/crop-status | Crop status report |
| GET | /api/v1/reports/procurement | Procurement report |
| GET | /api/v1/reports/agent-performance | Agent performance report |
| POST | /api/v1/reports/schedule | Schedule report delivery |
| GET | /api/v1/reports/export/:type | Export report (Excel/PDF) |

## Database Tables

### dashboard_widgets
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| widget_type | VARCHAR(50) | NOT NULL |
| title | VARCHAR(255) | |
| data_source | VARCHAR(255) | |
| refresh_interval | INTEGER | seconds |
| config_json | JSONB | |

### scheduled_reports
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| report_type | VARCHAR(50) | NOT NULL |
| schedule_cron | VARCHAR(100) | |
| recipients | VARCHAR[] | email addresses |
| format | ENUM | excel,pdf |
| filters | JSONB | |
| is_active | BOOLEAN | DEFAULT true |
| last_run_at | TIMESTAMP | |
| created_by | UUID | |

### analytics_cache
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| dashboard_type | VARCHAR(50) | |
| entity_id | UUID | |
| cache_key | VARCHAR(255) | |
| data_json | JSONB | |
| expires_at | TIMESTAMP | |

## Validations

### Role-Based Access
- Agent sees only their own data
- Cluster Manager sees cluster-level data
- Program Manager sees program-level data
- Admin sees organization-wide data

### Data Freshness
- Real-time for online users
- Cached data shown offline
- Cache TTL: 5 minutes for active dashboards

### Export Limits
- Max 100,000 rows per export
- Timeout: 60 seconds

## Technical Notes

- Exportable reports excluded from MVP (Phase 2)
- Scheduled emails excluded from MVP (Phase 2)
- Dashboard load target: < 3 seconds with cached data
- Use Redis for dashboard data caching
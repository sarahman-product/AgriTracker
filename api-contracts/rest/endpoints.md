# AgriTrack API Endpoints Summary

## Base URL
```
Production: https://api.agritrack.in/v1
Staging: https://api-staging.agritrack.in/v1
Development: http://localhost:3000/v1
```

## Authentication
All endpoints (except public) require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/otp | Send OTP to mobile | Public |
| POST | /auth/verify | Verify OTP, return JWT | Public |
| POST | /auth/refresh | Refresh JWT token | JWT |
| POST | /auth/logout | Invalidate session | JWT |

---

## 2. User Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /users/me | Current user profile + permissions | JWT |
| POST | /users | Create new user | Admin |
| GET | /users | List users (paginated) | Admin |
| GET | /users/:id | Get user by ID | Admin |
| PUT | /users/:id | Update user | Admin |
| DELETE | /users/:id | Deactivate user | Admin |
| GET | /roles | List available roles | JWT |
| GET | /hierarchy | Get hierarchy tree | JWT |
| PUT | /users/:id/territory | Assign territory | Admin |

---

## 3. Program Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /programs | Create program | Admin |
| GET | /programs | List programs | JWT |
| GET | /programs/:id | Get program details | JWT |
| PUT | /programs/:id | Update program | Admin |
| DELETE | /programs/:id | Archive program | Admin |
| GET | /programs/:id/kpis | Get program KPI targets | JWT |
| PUT | /programs/:id/kpis | Update KPI targets | Admin |

---

## 4. Crop Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /crop-categories | List categories | JWT |
| POST | /crop-categories | Create category | Admin |
| GET | /crop-groups | List groups (filter by category) | JWT |
| POST | /crop-groups | Create group | Admin |
| GET | /crops | List crops (filter by group) | JWT |
| POST | /crops | Create crop | Admin |
| GET | /crop-varieties | List varieties (filter by crop) | JWT |
| POST | /crop-varieties | Create variety | Admin |
| GET | /crop-stages | List stages (filter by crop) | JWT |
| POST | /crop-stages | Create stage | Admin |
| PUT | /crop-stages/:id | Update stage order | Admin |

---

## 5. Farmer Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /farmers | Create farmer (offline) | Agent |
| GET | /farmers | List farmers (paginated) | JWT |
| GET | /farmers/:id | Get farmer details | JWT |
| PUT | /farmers/:id | Update farmer | Agent |
| DELETE | /farmers/:id | Soft delete farmer | Manager |
| GET | /farmers/search | Search farmers (Elasticsearch) | JWT |
| POST | /farmers/:id/kyc | Submit KYC documents | Agent |
| GET | /farmers/:id/kyc | Get KYC status | JWT |
| PUT | /farmers/:id/kyc/verify | Verify KYC | Manager |
| POST | /farmers/:id/assign-program | Assign to program | Manager |

---

## 6. Farm Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /farms | Create farm with GPS | Agent |
| GET | /farms | List farms | JWT |
| GET | /farms/:id | Get farm details | JWT |
| PUT | /farms/:id | Update farm | Agent |
| GET | /farms/:id/polygon | Get GPS polygon | JWT |
| GET | /farms/by-farmer/:farmerId | Get farms for farmer | JWT |

---

## 7. Crop Enrollment Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /crop-enrollments | Enroll crop on farm | Agent |
| GET | /crop-enrollments | List enrollments | JWT |
| GET | /crop-enrollments/:id | Get enrollment | JWT |
| PUT | /crop-enrollments/:id | Update enrollment | Agent |
| GET | /crop-enrollments/active | Active enrollments | JWT |

---

## 8. Survey Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /surveys | List surveys | JWT |
| POST | /surveys | Create survey | Manager |
| GET | /surveys/:id | Get survey definition | JWT |
| PUT | /surveys/:id | Update survey | Manager |
| DELETE | /surveys/:id | Archive survey | Manager |
| POST | /surveys/:id/publish | Publish survey | Manager |
| GET | /surveys/:id/preview | Preview survey | Manager |
| GET | /surveys/by-stage/:stageId | Get survey for stage | Agent |
| POST | /survey-responses | Submit response (offline) | Agent |
| GET | /survey-responses | List responses | JWT |
| GET | /survey-responses/pending | Get pending surveys | Agent |
| POST | /survey-responses/:id/amend | Amend response | Agent |

---

## 9. Visit Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /visits | Start visit | Agent |
| PUT | /visits/:id | End visit | Agent |
| GET | /visits | List visits (paginated) | JWT |
| GET | /visits/:id | Get visit details | JWT |
| GET | /visits/agent/:agentId | Get visits by agent | Manager |
| GET | /visits/farmer/:farmerId | Get visits for farmer | JWT |
| GET | /visits/map | Get visits on map | Manager |
| GET | /visits/suspicious | Get flagged visits | Manager |
| POST | /visits/:id/notes | Add notes | Agent |
| POST | /visits/:id/photos | Add photos | Agent |

---

## 10. Procurement Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /procurements | Create procurement | Agent |
| GET | /procurements | List procurements | JWT |
| GET | /procurements/:id | Get procurement | JWT |
| PUT | /procurements/:id | Update procurement | Manager |
| GET | /procurements/pipeline | Get pipeline | Manager |
| POST | /harvest-estimates | Record estimate | Agent |
| GET | /harvest-estimates | List estimates | JWT |

---

## 11. Lot Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /lots | Create lot | Manager |
| GET | /lots | List lots | JWT |
| GET | /lots/:id | Get lot details | JWT |
| POST | /lots/:id/add-entry | Add procurement to lot | Manager |
| GET | /lots/:id/procurements | Get lot procurements | JWT |

---

## 12. GRN Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /grns/generate | Auto-generate GRN | System |
| GET | /grns | List GRNs | JWT |
| GET | /grns/:id | Get GRN details | JWT |
| GET | /grns/:id/pdf | Download PDF | JWT |
| GET | /grns/:id/qr | Get QR code | JWT |
| POST | /grns/:id/amend | Amend GRN | Manager |
| GET | /grns/:id/history | Get version history | JWT |

---

## 13. Vendor Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /vendors | Create vendor | Admin |
| GET | /vendors | List vendors | JWT |
| GET | /vendors/:id | Get vendor details | JWT |
| PUT | /vendors/:id | Update vendor | Admin |
| DELETE | /vendors/:id | Deactivate vendor | Admin |

---

## 14. Dispatch Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /dispatches | Create dispatch | Manager |
| GET | /dispatches | List dispatches | JWT |
| GET | /dispatches/:id | Get dispatch details | JWT |
| POST | /dispatches/:id/confirm | Confirm delivery | Vendor |
| GET | /dispatches/:id/receive | Get dispatch for receipt | Vendor |

---

## 15. Traceability Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /trace/:lotId | Get trace chain | JWT |
| GET | /trace/qr/:code | Lookup by QR | Public |
| GET | /trace/public/:lotId | Public trace view | Public |
| GET | /trace/farmer/:farmerId | Traces by farmer | JWT |
| POST | /trace/batches | Create batch | Manager |
| GET | /trace/batches/:id | Get batch trace | JWT |
| POST | /trace/verify | Verify QR authenticity | Public |

---

## 16. Analytics Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /analytics/dashboard/agent/:id | Agent dashboard | Agent |
| GET | /analytics/dashboard/cluster/:id | Cluster dashboard | Manager |
| GET | /analytics/dashboard/procurement | Procurement dashboard | Manager |
| GET | /analytics/dashboard/program/:id | Program dashboard | Manager |
| GET | /analytics/kpis | Get KPI data | JWT |
| GET | /analytics/agent-performance | Agent metrics | Manager |
| GET | /analytics/procurement-trends | Trend data | Manager |
| GET | /analytics/crop-coverage | Crop analytics | Manager |

---

## 17. Report Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /reports/farmer-master | Farmer report | Manager |
| GET | /reports/crop-status | Crop report | Manager |
| GET | /reports/procurement | Procurement report | Manager |
| GET | /reports/agent-performance | Agent report | Manager |
| POST | /reports/schedule | Schedule report | Manager |
| GET | /reports/export/:type | Export (Excel/PDF) | Manager |

---

## 18. Sync Service (Offline Support)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /sync/batch | Submit offline batch | Agent |
| GET | /sync/status | Get sync status | Agent |
| GET | /sync/reference-data | Download reference data | Agent |
| POST | /sync/confirm | Confirm sync complete | Agent |

---

## 19. Notification Service

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /notify/sms | Send SMS | System |
| POST | /notify/push | Send push notification | System |
| GET | /notify/preferences | Get user preferences | JWT |
| PUT | /notify/preferences | Update preferences | JWT |
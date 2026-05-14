# AgriTrack Build Instructions

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher) - https://nodejs.org
2. **npm** or **yarn** - Comes with Node.js
3. **Java JDK** (for Android) - https://adoptopenjdk.net
4. **Android Studio** - For Android SDK - https://developer.android.com/studio

### Environment Variables
Create a `.env` file in the backend folder:
```
DATABASE_URL=libsql://agritacker-sarahman.aws-ap-south-1.turso.io
DATABASE_AUTH_TOKEN=YOUR_TURSO_AUTH_TOKEN
JWT_SECRET=your-jwt-secret-min-32-chars
PORT=3000
```

---

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Initialize Database
Run the SQL migration in your Turso database:
```bash
# Copy the contents of database/migrations/001_initial_schema.sql
# and execute in Turso SQL console
```

### 3. Run Backend
```bash
# Development mode
npm run start:dev

# Or production build
npm run build
npm run start:prod
```

The API will run at `http://localhost:3000/api/v1`

---

## Frontend Setup (Mobile App)

### 1. Install Dependencies
```bash
cd frontend/mobile-app
npm install
```

### 2. Configure API URL
Edit `src/services/api.ts` and update the BASE_URL if needed:
```typescript
const BASE_URL = 'http://localhost:3000/api/v1'; // For development
// For production, use your deployed API URL
```

### 3. Run on Android (Emulator)
```bash
npx expo start
# Press 'a' to run on Android emulator
```

### 4. Run on Physical Device
```bash
npx expo start
# Scan QR code with Expo Go app on your phone
```

### 5. Build APK (Standalone)
```bash
npx expo run:android --variant release
# APK will be at android/app/build/outputs/apk/release/
```

---

## Project Structure

```
AgriTrack/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, farmers, etc.)
│   │   ├── db/            # Database service
│   │   ├── middleware/    # Auth guards
│   │   └── main.ts        # Entry point
│   └── package.json
│
├── frontend/
│   └── mobile-app/        # React Native (Expo)
│       ├── src/
│       │   ├── modules/  # Feature screens
│       │   ├── shared/   # Theme, context
│       │   ├── services/# API client
│       │   └── App.tsx  # Entry point
│       └── package.json
│
├── database/
│   └── migrations/        # SQL schema
│
├── docs/                  # Documentation
├── tickets/               # Roadmap
└── api-contracts/         # API specs
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/request-otp | Send OTP |
| POST | /auth/verify-otp | Verify OTP & login |
| GET | /auth/me | Get current user |
| GET | /programs/assigned | Get user's programs |
| GET | /programs/:id/config | Get program config |
| GET | /farmers | List farmers |
| POST | /farmers | Create farmer |
| GET | /farms | List farms |
| POST | /farms | Create farm |
| POST | /crop-enrollments | Enroll crop |
| GET | /survey-instances | Get surveys |
| POST | /survey-responses | Submit survey |
| POST | /procurements | Create procurement |
| POST | /grns/generate | Generate GRN |
| GET | /analytics/dashboard/agent | Agent dashboard |

---

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Android build errors
```bash
# Clean Android build
cd android
./gradlew clean
```

### Database connection errors
- Verify Turso credentials in `.env`
- Check DATABASE_URL format: `libsql://database-name.turso.io`

---

## Next Steps

1. Run the backend and initialize the database
2. Configure the mobile app to point to your API
3. Test the login flow
4. Start adding farmers and testing the full workflow
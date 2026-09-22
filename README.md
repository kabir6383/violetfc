# VIOLET Fitness Center — Web Application

A full-stack web application for **VIOLET Fitness Center**, an exclusive training facility created solely for women. Built with React 19, Express, SQLite (`better-sqlite3`), and Tailwind CSS, this system supports member registration, interactive health metrics estimation, workout program directories, nutrition protocols, and administrative member management with Excel export capabilities.

---

## Purpose & Core Mission

**VIOLET Fitness Center** is designed with a single goal: empowering women through fitness, health, and supportive community in a safe, comfortable, and focused environment.

- 🏋️‍♀️ **Exclusively for Women**: Facilities, workout programs, and schedules are created specifically for female members.
- 👩‍🏫 **Guided Entirely by Women Staff**: Every class, routine, personal training session, and nutrition plan is trained, coached, and guided by an all-female team of certified instructors.
- 🧘‍♀️ **Holistic Wellness**: Blending cardiovascular endurance, strength conditioning, calisthenics, and tailored nutrition to build sustainable physical strength and confidence.

---

## Technical Stack

- **Frontend**: React 19, React Router v7, Lucide Icons, Tailwind CSS v4.
- **Backend**: Express.js server running in ESM context (`tsx`).
- **Database**: SQLite database initialized via `better-sqlite3`.
- **Authentication**: JWT token authorization with `bcryptjs` password hashing.
- **Reporting & Export**: Dynamic `.xlsx` file generation using `xlsx`.

---

## Key Features

1. **Member Portal & Custom Dashboard**:
   - Personalized dashboard with customizable widgets.
   - Interactive Health Metrics & Calorie Estimator (calculates BMR, daily calorie targets by goal, and hydration targets).
   - Weekly group studio session timetable with instant reservation toggle.

2. **Training & Nutrition Directory**:
   - Searchable and categorizable workout programs (Cardio & Aerobic, Strength & HIIT, Resistance Sculpt, Dance, Core/Calisthenics).
   - Interactive workout logger tracking calorie burn estimates.
   - Tailored meal plan breakdown (Fat Loss, Muscle Gain, Vitality, Anti-Inflammatory Recovery).

3. **Administrative Management Console**:
   - View and search full member roster by name, email, or phone number.
   - Filter members by payment verification state (Paid / Unpaid).
   - Toggle payment verifications with immediate persistence.
   - One-click export of member directory to Microsoft Excel (`.xlsx`).
   - Image & Asset Manager allowing dynamic URL updates for facility images.

---

## Project Structure

```
violetfc/
├── server.ts                 # Express backend server & SQLite initialization
├── violet.db                 # SQLite database file (users & image assets)
├── package.json              # App configuration & dependencies
├── vite.config.ts            # Vite & Tailwind configuration
├── src/
│   ├── components/           # Reusable UI modules
│   │   ├── Navbar.tsx        # Top navigation header with responsive drawer
│   │   ├── Footer.tsx        # Footer layout with contact & hours
│   │   ├── FitnessCalculator.tsx # Health & Calorie intake estimator
│   │   └── ClassScheduleSection.tsx # Studio class booking schedule
│   ├── context/              # Global React Context providers
│   │   ├── AuthContext.tsx   # User authentication & token state
│   │   ├── ImageContext.tsx  # Dynamic gallery asset state
│   │   └── ToastContext.tsx  # Toast feedback notifications
│   ├── pages/                # Route views
│   │   ├── Home.tsx          # Member portal & public landing page
│   │   ├── Workouts.tsx      # Workout directory & logger
│   │   ├── Nutrition.tsx     # Meal plan protocols & sample menus
│   │   ├── AdminDashboard.tsx# Roster management & Excel export
│   │   ├── Login.tsx         # Member authentication login
│   │   └── Register.tsx      # Member registration form
│   ├── services/
│   │   └── api.ts            # API client module & fallback logic
│   └── types/
│       └── index.ts          # Central TypeScript interfaces
```

---

## Quickstart & Local Setup

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- npm (v9.x or higher)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:3000`, serving both the Express REST API endpoints and Vite frontend.

### 3. Verify Code Quality
```bash
npm run lint
```

---

## Seed Accounts for Testing

The SQLite database (`violet.db`) automatically seeds a default administrator account on first initialization:

| Account Type | Email / Phone | Password | Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@violet.com` or `9990001111` | `admin123` or `admin@123` | Admin |
| **New Member** | Register via `/register` | Custom | Member |

---

## REST API Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Create new member account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `GET` | `/api/images` | Public | Fetch gallery image records |
| `GET` | `/api/admin/users` | Admin Only | List all registered members |
| `PUT` | `/api/admin/users/:id/payment` | Admin Only | Update payment verification status |
| `PUT` | `/api/admin/images/:id` | Admin Only | Update facility image URL |
| `GET` | `/api/admin/export` | Admin Only | Download member directory as Excel (`.xlsx`) |

---

## License

Internal proprietary software for VIOLET Fitness Center.

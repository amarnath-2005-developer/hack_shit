# DisciplineOS — Backend API

AI-powered discipline tracking backend built with Node.js, Express, MongoDB Atlas, and Google Gemini AI.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + Google OAuth 2.0
- **AI:** Google Gemini 2.0 Flash
- **Validation:** Joi
- **Security:** Helmet, CORS, Rate Limiting, bcrypt
- **Docs:** Swagger / OpenAPI 3.0

## Quick Start

### 1. Clone & Install

```bash
cd "discipline os"
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `MONGODB_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — Any secure random string
- `GEMINI_API_KEY` — Your Google AI Studio API key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — From Google Cloud Console (optional)

### 3. Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:5000`

### 4. (Optional) Seed Demo Data

```bash
npm run seed
```

Creates a demo user (`demo@disciplineos.com` / `demo123456`) with 7 days of logs.

## API Documentation

Interactive Swagger docs available at: **http://localhost:5000/api-docs**

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login with email/password |
| POST | `/logout` | Logout (discard token) |
| GET | `/google` | Google OAuth login |
| GET | `/profile` | Get user profile 🔒 |
| PUT | `/profile` | Update profile 🔒 |

### Daily Logs (`/api/daily-logs`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create daily log (auto-calculates score) 🔒 |
| GET | `/` | Get all logs (paginated) 🔒 |
| GET | `/today` | Get today's log 🔒 |
| GET | `/:id` | Get log by ID 🔒 |
| PUT | `/:id` | Update log (recalculates score) 🔒 |
| DELETE | `/:id` | Delete log 🔒 |

### Habits (`/api/habits`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create habit 🔒 |
| GET | `/` | Get all habits 🔒 |
| GET | `/:id` | Get habit by ID 🔒 |
| PUT | `/:id` | Update habit 🔒 |
| DELETE | `/:id` | Delete habit 🔒 |
| POST | `/:id/complete` | Mark habit complete today 🔒 |
| GET | `/:id/analytics` | Get habit analytics 🔒 |

### Bad Habits (`/api/bad-habits`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Log bad habit occurrence 🔒 |
| GET | `/` | Get all entries (paginated) 🔒 |
| GET | `/trends` | Get bad habit trends 🔒 |
| PUT | `/:id` | Update entry 🔒 |
| DELETE | `/:id` | Delete entry 🔒 |

### AI (`/api/ai`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/planner` | Generate AI daily schedule 🔒 |
| POST | `/coach` | Get AI coaching advice 🔒 |
| POST | `/review` | Get AI daily review 🔒 |
| POST | `/predict` | Get AI future predictions 🔒 |

### Analytics (`/api/analytics`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/weekly` | Weekly discipline scores 🔒 |
| GET | `/monthly` | Monthly report 🔒 |
| GET | `/trends` | Productivity trends 🔒 |
| GET | `/heatmap` | Score heatmap data 🔒 |
| GET | `/habits` | Habit completion stats 🔒 |
| GET | `/score-history` | Score history 🔒 |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Complete dashboard data 🔒 |

🔒 = Requires JWT Bearer token

## Discipline Score Formula

Score out of 100, calculated from daily log data:

| Category | Weight | Scoring |
|----------|--------|---------|
| Sleep | 20% | Optimal 7-9h = 100 |
| Study | 20% | Based on user's studyGoal |
| Workout | 15% | Based on user's workoutGoal |
| Water | 15% | Based on user's waterGoal |
| Tasks | 20% | Completed / planned ratio |
| Screen Time | 10% | Less is better (inverse) |

## Project Structure

```
src/
├── config/
│   ├── db.js              # MongoDB connection
│   ├── passport.js        # Google OAuth strategy
│   └── swagger.js         # Swagger/OpenAPI config
├── controllers/           # HTTP request handlers
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Global error handler
│   └── validate.js        # Joi validation factory
├── models/                # Mongoose schemas (6 collections)
├── routes/                # Route definitions + Swagger docs
├── services/              # Business logic layer
├── utils/
│   ├── apiResponse.js     # Response helpers
│   ├── apiError.js        # Custom error classes
│   └── constants.js       # Enums & config constants
├── seed/
│   └── seed.js            # Optional demo data
├── app.js                 # Express app setup
└── server.js              # Server bootstrap
```

## Architecture

```
Client → Routes → Middleware → Controllers → Services → Models → MongoDB
```

- **Controllers** handle HTTP layer only
- **Services** contain all business logic
- **Models** define data schema and DB interaction
- All data is **100% database-driven** — zero hardcoded responses

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | ❌ | Token expiry (default: `7d`) |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | ❌ | OAuth callback URL |
| `CLIENT_URL` | ❌ | Frontend URL (default: `http://localhost:3000`) |
| `PORT` | ❌ | Server port (default: `5000`) |
| `NODE_ENV` | ❌ | Environment (default: `development`) |

## License

MIT

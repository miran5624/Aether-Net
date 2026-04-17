# AetherNet — Community Emergency Response Platform
<p align="center">
  <img width="250" src="https://drive.google.com/uc?id=1JGMC6qH5w2Hp6yAe0E41GWxj6QBVC8lu" alt="Centered Image" />
</p>
A real-time, community-driven emergency coordination platform that connects people in crisis with nearby helpers using AI guidance, live maps, and secure chat — available on Web and Android.

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android-0f172a?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Express%20%7C%20React%20Native-6366f1?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Claude-10b981?style=for-the-badge)
![Realtime](https://img.shields.io/badge/Realtime-Socket.IO-f59e0b?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e?style=for-the-badge)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Socket Events](#socket-events)
- [Database Schema](#database-schema-supabase)

---

## Overview

**AetherNet** is a full-stack emergency response ecosystem spanning web and mobile. A user in distress can raise an SOS in seconds — registered or completely anonymously — and the platform instantly notifies nearby community members who can physically respond. It works across a **Next.js web dashboard** and a **React Native Android app**, both connected to the same real-time backend.

### What makes AetherNet different?

| Capability | AetherNet | Typical Emergency Apps |
|---|---|---|
| Anonymous SOS (no signup) | ✅ | ❌ |
| AI first-response guidance | ✅ Gemini + Claude | ❌ |
| Skill-based responder routing | ✅ | ❌ |
| Live mutual GPS tracking | ✅ Seeker + Responder | ❌ |
| Guardian pre-alerts | ✅ | ❌ |
| Cross-platform (Web + Android) | ✅ | Rare |
| False-alert abuse prevention | ✅ Auto-suspension | ❌ |
| 24h post-crisis welfare check | ✅ | ❌ |

### Core Platform Flow
```
User in Crisis
    │
    ▼
Raise SOS (typed + contextual details)
    │
    ├─→ Guardian contacts alerted immediately
    │
    ├─→ AI generates first-response checklist (Gemini)
    │
    └─→ Nearby community notified (5km radius, skill-matched first)
              │
              ▼
         Responder Accepts
              │
              ├─→ Live mutual map opens (Seeker ↔ Responder GPS)
              ├─→ Encrypted chat room opens instantly
              └─→ ETA calculated in real-time (Haversine)
                        │
                        ▼
                  SOS Resolved → Rating → Welfare Check (24h)
```

---

## Features

### SOS System
| Feature | Description |
|---|---|
| **Typed SOS** | 6 emergency categories: Medical, Car Problem, Fire, Gas Leak, Threat, General Help |
| **Dynamic Modals** | Context-specific detail collection per SOS type (blood group auto-fill for Medical, car details for Car Problem, etc.) |
| **Anonymous SOS** | No account needed — raises SOS with a temporary session, full chat & map included |
| **Smart Routing** | 5km radius broadcast with skill-based priority routing (e.g. Medical SOS pings users with `Medical` skill first) |
| **Guardian Alerts** | Instantly notifies pre-assigned guardian contacts before broadcasting to the community |
| **Accept / Decline** | Responders see Accept/Decline buttons. Accepting opens the mutual live session |
| **False Alert Flag** | Responders can flag fake SOS. Users with 3+ flags are automatically suspended |

### Live Mutual Response View
| Feature | Description |
|---|---|
| **Real-time Map** | Leaflet-based map (web) / Google Maps (mobile) showing seeker (red) and responder (blue) positions updating live |
| **Distance & ETA** | Haversine formula calculates real-time distance and estimated arrival time |
| **Live Chat** | Socket.IO encrypted chat room opens between both parties immediately on acceptance |
| **Typing Indicators** | Shows live "X is typing..." status in chat |
| **Resolve & Rate** | Seeker marks as resolved → prompts 5-star rating for the responder |
| **Auto-close** | View auto-closes 3 seconds after resolution for both parties |

### AI Crisis Assistant
| Feature | Description |
|---|---|
| **First-Response Guidance** | Gemini AI generates a numbered action checklist for the seeker based on their SOS type |
| **Emergency Call Script** | Auto-generates a formal script to read to emergency services (112, 100) with a one-tap copy button |
| **AI Chat (Dashboard)** | In-app AI assistant accessible for general questions |
| **Claude Fallback** | Anthropic Claude serves as an AI fallback model if Gemini is unavailable |

### Mobile Application (Android)
| Feature | Description |
|---|---|
| **React Native** | Native Android app sharing the same backend and socket infrastructure |
| **Google Maps Integration** | Full GPS tracking with native Maps SDK for precise location and rendering |
| **One-tap SOS** | Streamlined mobile UI for raising an SOS in seconds from a phone |
| **Push Notifications** | Responder alerts delivered natively on Android even when app is backgrounded |
| **Shared Auth** | Same JWT-based authentication as the web platform — one account, both platforms |

###  User Profiles & Skills
| Feature | Description |
|---|---|
| **Skill Registry** | Users declare professional skills (Medical, Car Diagnosis, etc.) used for priority routing |
| **Health Profile** | Blood group + health conditions stored for medical emergencies |
| **Guardian Management** | Add/remove trusted contacts who get instant SOS alerts |
| **Trust Score** | Responders earn trust points for helping; seekers lose points for false alerts |
| **Responder History** | Full log of past SOS responses with timestamps and status |

###  Live Dashboards
| Feature | Description |
|---|---|
| **Today's Activity Stats** | Live-updating counters: Total SOS, Resolved Today, Avg Response Time |
| **Admin Dashboard** | God-eye view with: all active SOS alerts, online user count, analytics by category |
| **Live Map Card** | Shows all active SOS pins and online responders on a real-time map |
| **User Suspension** | Admins can manually suspend users; automatic suspension on repeated false alerts |
| **Welfare Check** | Background job sends a post-resolution check message 24 hours after an incident |

###  Notifications
| Feature | Description |
|---|---|
| **Real-time Alerts** | Priority and standard SOS alerts pushed via WebSocket |
| **Persistent Notifications** | Stored in database, shown in notification drawer with mark-all-as-read |
| **Guardian Notifications** | Separate alert pathway for assigned guardian contacts |

---

## Tech Stack

### Frontend — `frontend/`
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | React framework (App Router, API routes, SSR) |
| **React** | 19.2.4 | UI component framework |
| **TypeScript** | 5.7.3 | Static typing |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Framer Motion** | 11.x | Animations and page transitions |
| **Leaflet + React-Leaflet** | 1.9.4 / 5.x | Interactive GPS maps |
| **Socket.IO Client** | 4.8.3 | Real-time WebSocket communication |
| **Axios** | 1.x | HTTP API client |
| **Lucide React** | 0.564.0 | Icon library |
| **Recharts** | 2.x | Analytics bar/line charts |
| **Radix UI** | Various | Accessible UI primitives |
| **@google/generative-ai** | 0.24.x | Gemini AI integration |

### Backend — `backend/`
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS | Runtime |
| **Express.js** | 5.x | HTTP server and routing |
| **Socket.IO** | 4.8.3 | Real-time bidirectional events |
| **Supabase** | 2.x | PostgreSQL database + Auth |
| **JSON Web Tokens** | 9.x | Access token auth (httpOnly refresh cookies) |
| **bcryptjs** | 3.x | Password hashing |
| **Google Gemini API** | REST | AI first-response guidance + chat |
| **Anthropic Claude API** | SDK 0.78 | AI fallback model |
| **cookie-parser** | 1.4.x | Cookie handling for refresh tokens |
| **dotenv** | 17.x | Environment variable management |

### Mobile — `AetherNetMobile/`
| Technology | Version | Purpose |
|---|---|---|
| **React Native** | Latest LTS | Cross-platform native Android app |
| **Google Maps SDK** | Latest | Native GPS maps and location tracking |
| **Socket.IO Client** | 4.x | Shared real-time event layer with backend |
| **React Navigation** | 6.x | In-app screen navigation |

---

## Project Structure

```
Aether-Net/
├── backend/                    # Express.js API server
│   ├── server.js               # Entry point, Socket.IO init
│   ├── config/
│   │   └── supabase.js         # Supabase client config
│   ├── controllers/
│   │   ├── sosController.js    # SOS CRUD, presence, resolve, global stats
│   │   ├── authController.js   # Register, login, refresh, me
│   │   ├── userController.js   # Profile, location, guardians
│   │   ├── adminController.js  # Admin analytics + user management
│   │   └── welfareController.js# Post-crisis welfare checks
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect middleware (+ anonymous bypass)
│   │   └── auth.js             # Role guards
│   ├── routes/
│   │   ├── sos.js              # /api/sos/* routes
│   │   ├── auth.js             # /api/auth/* routes
│   │   ├── users.js            # /api/users/* routes
│   │   ├── admin.js            # /api/admin/* routes
│   │   └── map.js              # /api/map/* routes
│   ├── sockets/
│   │   ├── index.js            # Socket.IO connection + JWT/anonymous auth
│   │   ├── sosHandler.js       # SOS join/leave room events
│   │   ├── chatHandler.js      # chat:message + chat:typing events
│   │   └── locationHandler.js  # Responder GPS update events
│   ├── services/
│   │   ├── aiService.js        # Gemini API wrapper for guidance generation
│   │   └── keywordEngine.js    # Rule-based chat-assist fallback
│   ├── utils/
│   │   └── routingEngine.js    # 5km radius + skill-based user targeting
│   └── jobs/
│       └── welfareCheck.js     # Scheduled 24h post-crisis check job
│
├── frontend/                   # Next.js web dashboard
│   ├── app/
│   │   ├── dashboard/page.tsx  # Main dashboard + socket orchestration
│   │   ├── anonymous/page.tsx  # Anonymous SOS page w/ full socket flow
│   │   ├── auth/               # Login + signup pages
│   │   └── api/gemini/         # Edge API route for Gemini AI
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── sos-button.tsx              # Floating SOS trigger + modal flow
│   │   │   ├── mutual-response-view.tsx    # Live map + chat for accepted SOS
│   │   │   ├── responder-live-view.tsx     # Legacy seeker waiting view
│   │   │   ├── mutual-map.tsx              # Leaflet map component
│   │   │   ├── sos-feed-card.tsx           # Active SOS feed in dashboard
│   │   │   ├── sos-stats-card.tsx          # Live "Today's Activity" stats
│   │   │   ├── responder-history-card.tsx  # User's response log
│   │   │   ├── settings-card.tsx           # Profile settings
│   │   │   ├── live-map-card.tsx           # Full live map for dashboard
│   │   │   ├── ai-assistant-card.tsx       # In-dashboard AI chat widget
│   │   │   └── admin-dashboard.tsx         # Admin analytics + user management
│   │   └── navbar.tsx                      # Navigation with Anonymous SOS link
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state, login/logout, socket connect
│   └── lib/
│       ├── api.js              # Axios instance with interceptors + token storage
│       └── socket.js           # Socket.IO singleton factory
│
└── AetherNetMobile/            # React Native Android application
    ├── android/
    │   └── app/src/main/
    │       └── AndroidManifest.xml   # Google Maps API key configured here
    ├── src/
    │   ├── screens/            # App screens (Home, SOS, Map, Chat, Profile)
    │   ├── components/         # Shared React Native UI components
    │   ├── navigation/         # React Navigation stack/tab config
    │   ├── services/           # API + Socket.IO client wrappers
    │   └── context/            # Auth context (shared logic with web)
    └── package.json
```

---

## Environment Variables

### Backend — `backend/.env`
```env
PORT=5002
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
ACCESS_TOKEN_SECRET=your-jwt-access-secret
REFRESH_TOKEN_SECRET=your-jwt-refresh-secret
GEMINI_API_KEY=your-google-gemini-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key   # optional Claude fallback
```

### Frontend — `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5002/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5002
GEMINI_API_KEY=your-google-gemini-api-key
```

### Mobile (Android) — `AetherNetMobile/`

The mobile app uses the Google Maps SDK for native GPS rendering. You must provide your API key directly in the Android manifest:

- **File:** `AetherNetMobile/android/app/src/main/AndroidManifest.xml`
- **Tag:** `com.google.android.geo.API_KEY`

```xml
<meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY_HERE" />
```

## Getting Started

### Prerequisites

- Node.js (LTS)
- pnpm (frontend) or npm (backend and mobile)
- **Java Development Kit (JDK) 17** — required for the Android mobile build
- **Android Studio & Android SDK** — required for the mobile emulator or physical device build
- A Supabase project with the required tables

---

### 1. Start the Backend

```bash
cd backend
npm install
npm start
```

The API server runs on `http://localhost:5002`.

---

### 2. Start the Frontend (Web Dashboard)

```bash
cd frontend
pnpm install
pnpm dev
```

The web dashboard runs on `http://localhost:3000`.

---

### 3. Start the Mobile Application (Android)

Before running, ensure you have added your Google Maps API Key to `AndroidManifest.xml` as described in [Environment Variables](#environment-variables).

```bash
cd AetherNetMobile
npm install

# Start the Metro bundler
npx react-native start

# In a new terminal, build and run on Android
npx react-native run-android
```

> **Tip:** Make sure an Android emulator is running in Android Studio, or a physical Android device is connected with USB debugging enabled before running `run-android`.

---

## API Endpoints

### Authentication — `/api/auth`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login, returns JWT + sets cookie |
| POST | `/refresh` | Cookie | Refresh access token |
| GET | `/me` | Protected | Get current user profile |
| POST | `/logout` | Protected | Logout and clear cookie |

### SOS — `/api/sos`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/create` | Protected | Create a new SOS |
| POST | `/anonymous` | Public | Create anonymous SOS (no account) |
| GET | `/active` | Protected | Get nearby active SOS alerts |
| GET | `/me/active` | Protected | Get current user's active SOS |
| GET | `/stats` | Protected | Personal SOS stats |
| GET | `/global-stats` | Protected | Platform-wide live stats |
| GET | `/history` | Protected | User's SOS activity history |
| POST | `/:id/presence` | Protected | Accept/Decline an incoming SOS |
| POST | `/:id/resolve` | Protected | Mark SOS as resolved |
| POST | `/:id/flag` | Protected | Flag SOS as false alert |
| GET | `/:id` | Protected | Get SOS details by ID |

### Users — `/api/users`
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Protected | Get user profile |
| PUT | `/profile` | Protected | Update profile |
| PUT | `/location` | Protected | Update real-time location |
| GET | `/guardians` | Protected | List guardians |
| POST | `/guardians` | Protected | Add guardian |
| DELETE | `/guardians/:id` | Protected | Remove guardian |

### Admin — `/api/admin`
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/analytics` | Admin | Platform analytics |
| GET | `/users` | Admin | All users |
| PUT | `/users/:id/suspend` | Admin | Suspend a user |

---

## Socket Events

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `sos:join` | `{ sosId }` | Join the SOS chat/tracking room |
| `chat:message` | `{ sosId, message }` | Send a chat message |
| `chat:typing` | `{ sosId }` | Broadcast typing indicator |
| `location:update` | `{ sosId, lat, lng }` | Send real-time responder GPS |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `sos:new_alert` | `{ sos, isAnonymous }` | New SOS in 5km radius |
| `sos:priority_alert` | `{ sos, isPriority }` | Priority SOS matching user's skills |
| `sos:guardian_alert` | `{ sos }` | SOS from a user's guardian |
| `sos:created` | `{ sos, seeker }` | Seeker's own SOS was created |
| `response:mutual_open` | `{ sosId, seeker, responder, ... }` | Responder accepted — opens live view |
| `chat:message` | `{ senderId, senderName, message, timestamp }` | Incoming chat message |
| `chat:typing` | `{ senderName }` | Someone is typing |
| `sos:resolved` | `{ responseTimeSeconds }` | SOS was marked resolved |
| `location:responder_moved` | `{ sosId, lat, lng }` | Responder location update |
| `sos:stats_updated` | `{}` | Global stats changed (re-fetch trigger) |
| `account:suspended` | `{ reason }` | User's account was suspended |

---

## Database Schema (Supabase)

### Key Tables
- **`users`** — Profile, skills, location, trust score, is_suspended, guardians
- **`sos`** — Type, status, location, seeker_id, responders[], chat_log, is_anonymous, modal_data
- **`notifications`** — user_id, type, status (read/unread), data (JSON)
- **`ratings`** — sos_id, responder_id, stars, review

---

*Built with ❤️ for community safety.*

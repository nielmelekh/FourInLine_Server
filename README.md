# Four In Line: Real-Time Multiplayer & AI Coach

## Project Purpose
Four In Line is a full-stack web application that allows users to play Connect Four in real-time against each other. Built as an academic full-stack software engineering project, it features secure user authentication, a comprehensive friends network (send, accept, decline requests), match history tracking, and an integrated AI Coach that analyzes finished games to offer personalized advice.

## Required Architecture
The project strictly follows a dual-directory structure:
* `frontend/` - React source code (Pages, Components, API services)
* `backend/` - Node.js + Express backend, including `models/` (Prisma client) and `migrations/` (Prisma schema).

---

## Installation Instructions

**Prerequisites:**
* Node.js (v18+)
* MySQL Server (running locally on port `3306`)
* A Google Gemini API Key

### Install Dependencies
```bash
cd FourInLine_Server
```
Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

# Environment Variables
Before setting up the database, you must configure your environment variables.

Navigate to the backend/ folder and create a file named '.env'. Paste the following template and replace the placeholders with your actual MySQL password and Google Gemini API key:

backend/.env
```plaintext
# Use 127.0.0.1 instead of localhost for Node.js compatibility
DATABASE_URL="mysql://root:<YOUR_MYSQL_PASSWORD>@127.0.0.1:3306/FourInLineDB"

# Required for the post-match AI Coach analysis
GEMINI_API_KEY="<YOUR_GEMINI_API_KEY>"
```


# Database & ORM Setup
This project uses Prisma as its ORM to communicate with the MySQL database.

1. Ensure your local MySQL server is currently running.

2. Navigate to the backend directory in your terminal.

3. Push the Prisma schema to your database (this will automatically create the FourInLineDB database and all required tables: user, match, and Friend):
```bash
npx prisma db push
```

4. Generate the Prisma Client so the Node.js application can interact with the new tables:
```bash
npx prisma generate
```

# Running the Application
You will need two separate terminal windows open to run the client and server simultaneously.

## Start the Backend (Terminal 1):
```Bash
cd backend
npm start
# Server will run on http://localhost:3000
```

## Start the Frontend (Terminal 2):
```Bash
cd frontend
npm start
# Client will run on http://localhost:5173
```



# API Endpoints
The Express backend provides the following RESTful endpoints. All protected routes require a valid user ID passed in the x-user-id header.

## Users (/users)

GET /users - Retrieve all users.

GET /users/:id - Retrieve a specific user profile.

POST /users - Register a new user.

PUT /users/:id - Update user details (theme, dashboard preferences, etc.).

DELETE /users/:id - Delete a user account.

POST /api/auth/login - Authenticate a user and receive a token.

POST /api/auth/logout - Invalidate the current session.

GET /api/users/me - Fetch the currently authenticated user's details.

## Friends Network (/friends)

GET /friends - Fetches 4 arrays: current friends, pending received, pending sent, and available users.

POST /friends - Send a new friend request.

PUT /friends/accept - Accept an incoming request.

DELETE /friends/:id - Decline a request, cancel a sent request, or remove an existing friend.

## Matches (/matches)

GET /matches - Fetch all system matches.

POST /matches - Save a completed match to the database.

GET /matches/user - Fetch match history specific to the authenticated user (calculates match duration).


# WebSocket Feature (Real-Time Gameplay)
Real-time multiplayer functionality is handled exclusively via Socket.io.

Connection: Clients connect via http://localhost:3000 with CORS configured for the React frontend.

Events Emitted by Client: startGame, getOpenGames, joinGame, watchGame, makeMove.

Events Emitted by Server: gameStarted, openGamesUpdated, gameUpdated, gameError, coachAnalysis.

Game State: The server validates all moves (preventing column overflow and out-of-turn moves) and runs a localized algorithm after every drop to check for horizontal, vertical, and diagonal win conditions or draws.


# AI Feature (Post-Match Coach)
When a match concludes, the server compiles the moveHistory array and the final outcome (Winner/Draw) and sends it to the Google Gemini API (using gemini-1.5-flash).

The AI strictly returns a JSON object containing a brief boardAnalysis.

It provides a praise string for the winning player.

It provides a tip string identifying the critical mistake made by the losing player.

This analysis is broadcast back to the specific Socket.io game room and dynamically rendered below the game board.

# Known Limitations
In-Memory Game State: Active multiplayer games are currently stored in a local games object inside gameSocket.js. If the Node.js server restarts or crashes, all currently active matches will be lost.

No "Block" Feature: Declining a friend request completely deletes the row from the database (via deleteMany). Because there is no "Blocked" status table, a user can continuously send new friend requests to someone who previously declined them.

AI Latency: Because the AI Coach requires an external HTTP request to Google's Gemini servers, there is typically a 1.5 to 3-second delay between the final winning move and the AI advice appearing on the frontend UI.
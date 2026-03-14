HD Notes - A Full-Stack Note-Taking Application
HD Notes is a modern, full-stack note-taking application built with a React/Vite frontend and a Node.js/Express backend. It features a secure authentication system using OTP (One-Time Password) and Google Sign-In, allowing users to create, manage, and delete their notes seamlessly.

Features
    Secure Authentication: Users can sign up and log in using either OTP sent to their email or their Google account.

    CRUD Functionality: Create, read, update, and delete notes.

    User-Specific Notes: Notes are tied to the authenticated user, ensuring privacy.

    Responsive Design: A clean and modern user interface that works on various screen sizes.

    State Management: Utilizes Redux Toolkit for predictable and centralized state management.

Tech Stack
    Frontend: React, Vite, Redux Toolkit, TypeScript, Axios

    Backend: Node.js, Express, MongoDB (with Mongoose), JWT, Nodemailer, Google Auth Library

    Styling: CSS Modules

Prerequisites
Before you begin, ensure you have the following installed on your system:

    Node.js (v14.20.1 or higher)

    npm (or yarn)

    MongoDB (or a MongoDB Atlas account)

    A Google Account for setting up Google Sign-In and email services.

Project Setup
Follow these steps to get the project up and running on your local machine.

1. Clone the Repository

git clone https://github.com/skc-87/notes-app.git
cd notes-app

2. Backend Setup
First, navigate to the backend directory and install the necessary dependencies.

cd backend
npm install

Environment Variables

Create a .env file in the backend directory and add the following configuration.


# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Connection
MONGODB_URI="your_mongodb_connection_string"

# JSON Web Token (JWT)
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRE="1d"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Nodemailer (for sending OTP emails)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your_gmail_address@gmail.com"
EMAIL_PASS="your_16_character_google_app_password"

For instructions on generating a Google App Password, please refer to the Google Help Center.

3. Frontend Setup

Next, navigate to the frontend directory and install its dependencies.

cd ../frontend
npm install


Environment Variables

Create a .env.local file in the frontend directory and add the following:

VITE_BACKEND_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"

Important: The VITE_GOOGLE_CLIENT_ID must be the same as the GOOGLE_CLIENT_ID in your backend configuration.

4. Running the Application

You will need two separate terminal windows to run both the backend and frontend servers simultaneously.
In your first terminal (from the backend directory):

# This will start the backend server on http://localhost:5000
npm run dev

In your second terminal (from the frontend directory):

# This will start the frontend development server on http://localhost:5173
npm run dev

You can now access the application by opening your browser and navigating to http://localhost:5173.

---

## Deployment

### Backend → Render

1. Push your repository to GitHub.
2. Go to [https://render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository. Render will auto-detect the `render.yaml` at the repo root.
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
4. Set the following **Environment Variables** in the Render dashboard:
   | Variable | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A strong random secret (min 32 chars) |
   | `CLIENT_URL` | Your Vercel frontend URL (e.g. `https://hd-notes.vercel.app`) |
   | `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
   | `EMAIL_HOST` | `smtp.gmail.com` |
   | `EMAIL_PORT` | `587` |
   | `EMAIL_USER` | Your Gmail address |
   | `EMAIL_PASS` | Your Gmail App Password |
5. Click **Deploy**. Your API will be live at `https://<service-name>.onrender.com`.

> **Note:** Free-tier Render services spin down after inactivity. The first request after a cold start may take ~30 seconds.

---

### Frontend → Vercel

1. Go to [https://vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Vercel will auto-detect Vite. Confirm:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add the following **Environment Variables** in the Vercel dashboard:
   | Variable | Value |
   |---|---|
   | `VITE_BACKEND_API_URL` | Your Render backend URL (e.g. `https://hd-notes-backend.onrender.com`) |
   | `VITE_GOOGLE_CLIENT_ID` | Same Google OAuth client ID as the backend |
6. Click **Deploy**. Your app will be live at `https://<project-name>.vercel.app`.

> **Important:** After both services are deployed, go back to your Render service and update `CLIENT_URL` to your Vercel production URL so CORS works correctly.

> **Google OAuth:** Add both your Vercel URL and `http://localhost:5173` as **Authorized JavaScript Origins** in the [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials.

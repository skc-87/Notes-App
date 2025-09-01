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

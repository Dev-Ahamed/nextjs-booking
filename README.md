Appointment Booking Application
Description

This project is a web-based application for managing user bookings and appointments. It allows users to book time slots, view their appointments, and manage booking statuses.

Features
User Authentication: Secure login and registration with role-based access control.
Appointment Booking: Users can view available time slots and book appointments.
Booking Management: Users can cancel their appointments.
Admin Page: Admins can manage appointments and bookings, including cancellations.

Tools & Technologies

Frontend:
Next.js (React framework)
Tailwind CSS (Utility-first CSS framework)
Shadcn UI (UI components)
React Hook Form (Form handling library)
Zod (TypeScript-first schema validation)

Backend:
Node.js (JavaScript runtime)
Prisma (ORM for database management)
Express.js or custom API routes (optional based on setup)
PostgreSQL (Neon database)

Authentication:
NextAuth.js (Authentication library for Next.js)

Others:
Sonner (Toast notifications)
Lucide-React (Icon library)
Date-fns (Date manipulation)

How to Set Up and Run the Project Locally
Prerequisites
Ensure you have the following installed on your machine:

Node.js (version 16 or higher)

Step 1: Clone the Repository
First, clone the repository to your local machine:

git clone [https://github.com/your-username/project-repository.git](https://github.com/Dev-Ahamed/nextjs-booking.git)

Step 2: Install Dependencies
Navigate to the project directory and install the required dependencies:

cd project-repository
npm install

Step 3: Set Up Environment Variables
Create a .env file in the root directory and add the following environment variables. These may include API keys, database URLs, or any other sensitive data.

DATABASE_URL="your-database-url"
AUTH_SECRET="your-secret-key"

Step 4: Run the Development Server
Once the dependencies are installed and the .env file is configured, you can run the project locally:

npm run dev
This will start the server at http://localhost:3000.

Step 5: Access the Application
Once the server is running, open your browser and navigate to:

http://localhost:3000

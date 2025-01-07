
# Health Tracker System

## Overview
The **Health Tracker System** is a Next.js application designed for doctors to efficiently monitor and manage patient health data. It leverages server-side rendering for performance, Supabase for seamless database management, and Google OAuth for secure authentication. The project aims to streamline healthcare workflows and enhance patient care, hosted on Vercel for scalable deployment.

## Features
- **Patient Management**: Add, update, and manage patient records securely.
- **Health Metrics Tracking**: Log, analyze, and visualize health data trends.
- **Notifications**: Alert doctors about critical health conditions.
- **Secure Authentication**: Google OAuth via NextAuth.
- **Real-Time Updates**: Sync health data with Supabase integration.
- **Responsive Design**: Optimized for web and mobile access.

## Tech Stack
- **Framework**: Next.js (with server-side rendering and server actions).
- **Database**: PostgreSQL, managed through Supabase.
- **Authentication**: NextAuth with Google OAuth.
- **Hosting**: Vercel.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/health-tracker-system.git
   cd health-tracker-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
    DATABASE_MIGRATION_URL=
    DATABASE_URL=
    NEXTAUTH_SECRET=
    GOOGLE_SECRET=
    RESEND_API_KEY=
    UPLOADTHING_TOKEN=
    ENVIRONMENT=local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage
1. Sign in using your Google account.
2. Add a new patient and input their health metrics.
3. Monitor health trends and receive alerts for critical conditions.

## Roadmap
- [ ] Build the core infra
- [ ] Enable exportable health reports for patients.
- [ ] Add role-based access for admin and nurses.
- [ ] Implement offline mode using PWA support.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push the branch.
4. Submit a pull request for review.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
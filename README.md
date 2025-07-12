# Skill Swap Platform

This is a skill-swapping platform where users can connect to exchange skills and knowledge. Learn, teach, and grow together.

## Features

-   **User Profiles**: Create and manage your profile, showcasing skills you offer and skills you want to learn.
-   **Search & Discovery**: Find other users based on skills, location, and availability.
-   **Swap Requests**: Send and manage requests to initiate skill exchange sessions.
-   **Real-time Chat**: Communicate with other users to coordinate swaps.
-   **Reviews & Ratings**: Provide feedback on completed swaps to build trust within the community.

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your-username/skill-swap-platform.git
cd skill-swap-platform
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Set up Supabase

This project uses [Supabase](https://supabase.com/) for its backend (authentication and database).

1.  **Create a new Supabase project**: Go to [Supabase](https://app.supabase.com/) and create a new project.
2.  **Get your API keys**:
    -   Go to `Project Settings` -> `API`.
    -   Copy your `Project URL` and `anon public` key.
3.  **Configure environment variables**: Create a `.env.local` file in the root of your project and add the following:

    \`\`\`
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    \`\`\`

### 4. Run SQL Migrations

Execute the SQL scripts to set up your database schema and seed initial data.

\`\`\`bash
# You can run these scripts directly from the v0 UI if you are using it.
# Otherwise, you can use the Supabase SQL Editor or a database client.

# Run scripts/01-create-tables.sql first
# Then run scripts/02-insert-sample-data.sql
\`\`\`

### 5. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Reusable React components, including `shadcn/ui` components.
-   `lib/`: Utility functions, Supabase client, and database interactions.
-   `scripts/`: SQL scripts for database setup.
-   `public/`: Static assets like images.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
\`\`\`

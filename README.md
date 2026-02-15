# Brown Hat Academy

Cybersecurity learning academy — from foundations to advanced certifications.

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (auth, database, storage)

## Local Development

Requires Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd brown-hat-path

# Install dependencies
npm i

# Start the dev server
npm run dev
```

## Populating the Curriculum

The learning dashboard reads from Supabase. If courses appear empty, run the curriculum seed:

1. Open your project in the [Supabase Dashboard](https://app.supabase.com) → **SQL Editor**.
2. Paste the full contents of **`supabase/seed-full-curriculum.sql`**.
3. Click **Run**.

This inserts all 7 seed courses (BH-BRIDGE through BH-ADV) with modules and lessons. The 4 specialisation courses (BH-GRC-2, BH-SPEC-IAM, BH-SPEC-CLOUD, BH-SPEC-GRC) are added via the migration files in `supabase/migrations/`.

See **`supabase/README-SEED.md`** for details and CLI option.

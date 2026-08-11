# Engineering Portfolio — Preview

Single-page portfolio site (`index.html`), built for review at this path before going live. Nothing in this folder is linked from the live site yet.

## Structure

- `index.html` — Hero, About, Portfolio, Contact sections
- `assets/styles.css` — editorial dark theme (charcoal/slate, sharp borders)
- `assets/main.js` — nav, scroll reveal, blueprint modal, contact form
- `supabase/schema.sql` — database table + security policy for contact submissions

## Previewing locally

No build step. From this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Wiring up the contact form (Supabase)

The form is fully built (validation, loading/success/error states, spam honeypot) but the submit handler needs a real Supabase project to store rows in. Free tier is enough.

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in your project dashboard, paste the contents of `supabase/schema.sql`, and run it. This creates a `contact_submissions` table and a row-level-security policy that lets the public site **insert** rows but never read, update, or delete them.
3. In **Project Settings → API**, copy the **Project URL** and the **anon public** key.
4. Open `assets/main.js` and replace the two placeholders near the top of the "CONTACT FORM" section:

   ```js
   const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```

5. Submit the form once locally and confirm a row appears in **Table Editor → contact_submissions**.

The anon key is safe to ship in client-side JS — it's meant to be public. The RLS policy is what actually protects the data; it restricts that key to insert-only, so nobody can read other people's submissions through it.

## Going live

This is intentionally not linked from the root `index.html` yet. When you're happy with the preview, say the word and it'll be promoted to the live site.

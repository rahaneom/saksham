# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Supabase file uploads

The resource manager uses [Supabase Storage](https://supabase.com/docs/guides/storage) to host PDFs, audio and video files. To make it work:

1. Install the JS client in the frontend:
   ```bash
   cd frontend
   npm install @supabase/supabase-js
   ```
2. Create a bucket named `resources` (or adjust the bucket name in `src/util/supabaseClient.js`).
3. Create a `.env` (or `.env.local`) at the project root with your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=public-anon-key
   ```
4. Restart the dev server (`npm run dev`).

The upload helper (`uploadResourceFile`) will take care of generating a public URL that is stored in the backend. When resources are rendered the app automatically shows an inline preview depending on the file type.

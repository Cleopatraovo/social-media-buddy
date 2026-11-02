# Social-Media Buddy (Testlauf)

Kleine Web-App (React, TypeScript, Vite) mit Anbindung an Supabase.
Sie dient nur dazu, die Kette Handy, Webseite und Datenbank einmal auszuprobieren.

## Einrichtung

1. In Supabase das Projekt öffnen, im **SQL Editor** den Inhalt von `supabase/schema.sql` einfügen und mit **Run** ausführen.
2. In Supabase unter **Project Settings > API** die **Project URL** und den **anon / publishable Key** kopieren.
   Den `service_role` Key niemals verwenden oder weitergeben.
3. In Vercel beim Projekt unter **Settings > Environment Variables** zwei Variablen anlegen:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = anon / publishable Key
4. In Vercel unter **Deployments** das letzte Deployment mit **Redeploy** neu starten.
5. Den Link der Seite auf dem Handy öffnen, Testcode eingeben, speichern.

## Lokal ausprobieren (optional)

```
cp .env.example .env     # Werte eintragen
npm install
npm run dev
```

Die Datei `.env` wird nicht ins Repository hochgeladen.

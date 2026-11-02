import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isConfigured = Boolean(url && key);

// Ohne Zugangsdaten wird ein Platzhalter-Client erzeugt, damit die Seite
// trotzdem startet und eine verständliche Meldung anzeigen kann.
export const supabase = createClient(
  url ?? "https://platzhalter.supabase.co",
  key ?? "platzhalter"
);

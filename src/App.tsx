import { useCallback, useEffect, useState } from "react";
import { isConfigured, supabase } from "./supabase";

type Entry = {
  id: number;
  created_at: string;
  participant_code: string;
  score: number;
  note: string | null;
};

const CODE_KEY = "smb-test-code";

function readStoredCode(): string {
  try {
    return localStorage.getItem(CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export default function App() {
  const [code, setCode] = useState(readStoredCode);
  const [score, setScore] = useState(3);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!isConfigured || !code.trim()) {
      setEntries([]);
      return;
    }
    const { data, error } = await supabase
      .from("test_entries")
      .select("*")
      .eq("participant_code", code.trim())
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("ok");
    setEntries((data ?? []) as Entry[]);
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) {
      setMessage("Bitte zuerst einen Testcode eingeben.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      localStorage.setItem(CODE_KEY, code.trim());
    } catch {
      /* Speicher nicht verfügbar, egal */
    }
    const { error } = await supabase.from("test_entries").insert({
      participant_code: code.trim(),
      score,
      note: note.trim() || null,
    });
    setBusy(false);
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setNote("");
    setMessage("Gespeichert.");
    await load();
  }

  return (
    <main className="page">
      <h1>Social-Media Buddy</h1>
      <p className="sub">Testlauf der Datenbank-Anbindung. Bitte nur erfundene Daten eingeben.</p>

      <p className={`status ${isConfigured ? status : "error"}`}>
        {!isConfigured
          ? "Keine Zugangsdaten gefunden. Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY setzen."
          : status === "ok"
          ? "Verbindung zur Datenbank: in Ordnung"
          : status === "error"
          ? "Verbindung zur Datenbank: Fehler"
          : "Verbindung zur Datenbank: noch nicht geprüft (Testcode eingeben)"}
      </p>

      <form onSubmit={save} className="card">
        <label>
          Testcode
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="z. B. TEST-01"
            autoComplete="off"
          />
        </label>

        <label>
          Wie bewusst war deine Nutzung heute? ({score} von 5)
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />
        </label>

        <label>
          Notiz (optional)
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
        </label>

        <button type="submit" disabled={busy || !isConfigured}>
          {busy ? "Speichert …" : "Speichern"}
        </button>
        {message && <p className="msg">{message}</p>}
      </form>

      <h2>Letzte Einträge</h2>
      {entries.length === 0 ? (
        <p className="sub">Noch keine Einträge für diesen Testcode.</p>
      ) : (
        <ul className="list">
          {entries.map((en) => (
            <li key={en.id}>
              <strong>{en.score} von 5</strong>
              <span>{new Date(en.created_at).toLocaleString("de-DE")}</span>
              {en.note && <em>{en.note}</em>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

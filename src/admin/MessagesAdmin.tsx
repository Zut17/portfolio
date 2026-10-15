import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface MessageRow {
  id: string;
  name: string;
  email: string;
  content: string;
  read: boolean;
  created_at: string;
}

export default function MessagesAdmin() {
  const [rows, setRows] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError("");
    try {
      const { data, error: queryError } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (queryError) {
        setError(queryError.message);
        return;
      }
      setRows((data ?? []) as MessageRow[]);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger les messages.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setRead = async (id: string, read: boolean) => {
    setError("");
    try {
      const { error: updateError } = await supabase
        .from("messages")
        .update({ read })
        .eq("id", id);
      if (updateError) {
        setError(updateError.message);
        return;
      }
      await load();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Impossible de modifier le statut du message.",
      );
    }
  };

  const toggleOpen = (message: MessageRow) => {
    const opening = openId !== message.id;
    setOpenId(opening ? message.id : null);
    if (opening && !message.read) void setRead(message.id, true);
  };

  const remove = async (message: MessageRow) => {
    if (!window.confirm(`Supprimer le message de ${message.name} ?`)) return;
    setError("");
    try {
      const { error: deleteError } = await supabase
        .from("messages")
        .delete()
        .eq("id", message.id);
      if (deleteError) {
        setError(deleteError.message);
        return;
      }
      if (openId === message.id) setOpenId(null);
      await load();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer ce message.",
      );
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Messages</h1>
      <p className="mt-1 text-muted">
        Messages reçus depuis le formulaire de contact.
      </p>

      {error && (
        <p className="mt-6 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm text-accent">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-8 text-muted">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-muted">Aucun message pour l'instant.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {rows.map((message) => (
            <li
              key={message.id}
              className={`rounded-2xl border bg-card ${
                message.read ? "border-border" : "border-primary/60"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleOpen(message)}
                aria-expanded={openId === message.id}
                className="flex w-full items-center gap-4 p-4 text-left"
              >
                {message.read ? (
                  <MailOpen size={18} className="shrink-0 text-muted" />
                ) : (
                  <Mail size={18} className="shrink-0 text-primary" />
                )}
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate ${
                      message.read ? "" : "font-semibold"
                    }`}
                  >
                    {message.name}{" "}
                    <span className="text-muted">· {message.email}</span>
                  </p>
                  <p className="truncate text-sm text-muted">
                    {message.content}
                  </p>
                </div>
                <time
                  dateTime={message.created_at}
                  className="shrink-0 text-xs text-muted"
                >
                  {new Date(message.created_at).toLocaleString("fr-FR")}
                </time>
              </button>

              {openId === message.id && (
                <div className="border-t border-border p-4">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent("Re: votre message")}`}
                      className="text-primary hover:underline"
                    >
                      Répondre par email
                    </a>
                    <button
                      type="button"
                      onClick={() => void setRead(message.id, false)}
                      className="text-muted transition hover:text-primary"
                    >
                      Marquer comme non lu
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(message)}
                      className="flex items-center gap-1 text-muted transition hover:text-accent"
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

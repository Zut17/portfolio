import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useRows<T extends { id: string; sort_order: number }>(
  table: string,
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { data, error: queryError } = await supabase
        .from(table)
        .select("*")
        .order("sort_order");
      if (queryError) {
        setError(queryError.message);
        return;
      }
      setRows((data ?? []) as T[]);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossible de charger les éléments.",
      );
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => {
    void load();
  }, [load]);

  const nextOrder = rows.length
    ? Math.max(...rows.map((row) => row.sort_order)) + 1
    : 0;

  const swap = async (a: T, b: T) => {
    setError("");
    try {
      const [first, second] = await Promise.all([
        supabase.from(table).update({ sort_order: b.sort_order }).eq("id", a.id),
        supabase.from(table).update({ sort_order: a.sort_order }).eq("id", b.id),
      ]);
      const operationError = first.error ?? second.error;
      await load();
      if (operationError) setError(operationError.message);
    } catch (swapError) {
      setError(
        swapError instanceof Error
          ? swapError.message
          : "Impossible de modifier l'ordre.",
      );
    }
  };

  const remove = async (id: string) => {
    setError("");
    try {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq("id", id);
      if (deleteError) {
        setError(deleteError.message);
        return;
      }
      await load();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Impossible de supprimer cet élément.",
      );
    }
  };

  return { rows, loading, error, setError, load, nextOrder, swap, remove };
}

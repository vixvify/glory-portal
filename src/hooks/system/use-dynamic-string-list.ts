import { useCallback, useState } from "react";
import { getInitialStringList } from "@/utils/movie-form";

export type DynamicStringItem = { id: string; value: string };

const createItem = (value: string): DynamicStringItem => ({
  id: Math.random().toString(36).substring(2, 9),
  value,
});

export function useDynamicStringList(initialValues?: string[]) {
  const [items, setItems] = useState<DynamicStringItem[]>(() =>
    getInitialStringList(initialValues).map(createItem),
  );

  const addItem = useCallback(() => {
    setItems((currentItems) => [...currentItems, createItem("")]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  }, []);

  const updateItem = useCallback((id: string, value: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, value } : item,
      ),
    );
  }, []);

  const getValues = useCallback(() => items.map((i) => i.value), [items]);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    getValues,
  };
}

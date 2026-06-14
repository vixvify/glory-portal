import { useCallback, useState } from "react";
import { getInitialStringList } from "@/utils/movie-form";

export function useDynamicStringList(initialValues?: string[]) {
  const [items, setItems] = useState<string[]>(() =>
    getInitialStringList(initialValues),
  );

  const addItem = useCallback(() => {
    setItems((currentItems) => [...currentItems, ""]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index),
    );
  }, []);

  const updateItem = useCallback((index: number, value: string) => {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    );
  }, []);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
  };
}

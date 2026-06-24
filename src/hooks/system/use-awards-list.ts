import { useCallback, useState } from "react";

export type AwardProject = {
  project: string;
  items: string[];
};

export function useAwardsList(initialValues?: string[]) {
  const [projects, setProjects] = useState<AwardProject[]>(() => {
    if (!initialValues || initialValues.length === 0) {
      return [{ project: "", items: [""] }];
    }
    return initialValues.map((val) => {
      try {
        const parsed = JSON.parse(val);
        return {
          project: parsed.project || "",
          items: Array.isArray(parsed.items) && parsed.items.length > 0 ? parsed.items : [""],
        };
      } catch {
        return { project: val, items: [""] };
      }
    });
  });

  const addProject = useCallback(() => {
    setProjects((prev) => [...prev, { project: "", items: [""] }]);
  }, []);

  const removeProject = useCallback((index: number) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateProjectName = useCallback((index: number, name: string) => {
    setProjects((prev) =>
      prev.map((p, i) => (i === index ? { ...p, project: name } : p))
    );
  }, []);

  const addItem = useCallback((projectIndex: number) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === projectIndex ? { ...p, items: [...p.items, ""] } : p
      )
    );
  }, []);

  const removeItem = useCallback((projectIndex: number, itemIndex: number) => {
    setProjects((prev) =>
      prev.map((p, i) =>
        i === projectIndex
          ? { ...p, items: p.items.filter((_, j) => j !== itemIndex) }
          : p
      )
    );
  }, []);

  const updateItemName = useCallback(
    (projectIndex: number, itemIndex: number, value: string) => {
      setProjects((prev) =>
        prev.map((p, i) =>
          i === projectIndex
            ? {
                ...p,
                items: p.items.map((item, j) =>
                  j === itemIndex ? value : item
                ),
              }
            : p
        )
      );
    },
    []
  );

  const getPayload = useCallback(() => {
    return projects
      .filter((p) => p.project.trim() !== "" || p.items.some((item) => item.trim() !== ""))
      .map((p) =>
        JSON.stringify({
          project: p.project,
          items: p.items.filter((item) => item.trim() !== ""),
        })
      );
  }, [projects]);

  return {
    projects,
    addProject,
    removeProject,
    updateProjectName,
    addItem,
    removeItem,
    updateItemName,
    getPayload,
  };
}

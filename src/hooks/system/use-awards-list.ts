import { useCallback, useState } from "react";

export type AwardItem = { id: string; value: string };
export type AwardProject = {
  id: string;
  project: string;
  items: AwardItem[];
};

const createId = () => Math.random().toString(36).substring(2, 9);
const createAwardItem = (value: string): AwardItem => ({ id: createId(), value });
const createProject = (project: string, items: string[]): AwardProject => ({
  id: createId(),
  project,
  items: items.map(createAwardItem),
});

export function useAwardsList(initialValues?: string[]) {
  const [projects, setProjects] = useState<AwardProject[]>(() => {
    if (!initialValues || initialValues.length === 0) {
      return [createProject("", [""])];
    }
    return initialValues.map((val) => {
      try {
        const parsed = JSON.parse(val);
        return createProject(
          parsed.project || "",
          Array.isArray(parsed.items) && parsed.items.length > 0 ? parsed.items : [""]
        );
      } catch {
        return createProject(val, [""]);
      }
    });
  });

  const addProject = useCallback(() => {
    setProjects((prev) => [...prev, createProject("", [""])]);
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const updateProjectName = useCallback((projectId: string, name: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, project: name } : p))
    );
  }, []);

  const addItem = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, items: [...p.items, createAwardItem("")] } : p
      )
    );
  }, []);

  const removeItem = useCallback((projectId: string, itemId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, items: p.items.filter((item) => item.id !== itemId) }
          : p
      )
    );
  }, []);

  const updateItemName = useCallback(
    (projectId: string, itemId: string, value: string) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                items: p.items.map((item) =>
                  item.id === itemId ? { ...item, value } : item
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
      .filter((p) => p.project.trim() !== "" || p.items.some((item) => item.value.trim() !== ""))
      .map((p) =>
        JSON.stringify({
          project: p.project,
          items: p.items.map((i) => i.value).filter((val) => val.trim() !== ""),
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

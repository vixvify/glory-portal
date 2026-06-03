import { parseStringOrArray } from "./parser";

export const toFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    const listFields = ["director", "producer", "writer", "cast", "btsVideo"];
    if (listFields.includes(key)) {
      const arr = parseStringOrArray(value);
      arr.forEach((item) => formData.append(key, item));
      return;
    }

    if (key === "thumbnail") {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (
        value &&
        typeof value === "object" &&
        "length" in value &&
        typeof value !== "string"
      ) {
        const list = value as unknown as FileList;
        if (list.length > 0) {
          formData.append(key, list[0] as File);
        }
      } else if (typeof value === "string") {
        formData.append(key, value);
      }
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (value instanceof FileList) {
      for (let i = 0; i < value.length; i++) {
        const file = value.item(i);
        if (file) formData.append(key, file);
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          formData.append(key, item instanceof File ? item : String(item));
        }
      });
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};

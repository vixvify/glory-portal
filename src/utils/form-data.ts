export const toFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value === null) {
      formData.append(key, "null");
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
          if (item instanceof File) {
            formData.append(key, item);
          } else if (typeof item === "object") {
            formData.append(key, JSON.stringify(item));
          } else {
            formData.append(key, String(item));
          }
        }
      });
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};

import { useCallback, useEffect, useState } from "react";
import { Movie } from "@/core/domain/movie";

function getExistingThumbnail(editingMovie: Movie | null): string | null {
  return editingMovie && typeof editingMovie.thumbnail === "string"
    ? editingMovie.thumbnail
    : null;
}

export function useMovieCoverPreview(editingMovie: Movie | null) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() =>
    getExistingThumbnail(editingMovie),
  );

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetPreview = useCallback(() => {
    setSelectedFileName(null);
    setPreviewUrl(getExistingThumbnail(editingMovie));
  }, [editingMovie]);

  const setFilePreview = useCallback(
    (file: File | null) => {
      setSelectedFileName(file?.name ?? null);

      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
        return;
      }

      setPreviewUrl(getExistingThumbnail(editingMovie));
    },
    [editingMovie],
  );

  return {
    selectedFileName,
    previewUrl,
    resetPreview,
    setFilePreview,
  };
}

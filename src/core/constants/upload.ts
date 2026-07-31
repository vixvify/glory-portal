export const UPLOAD_LIMITS = {
  AVATAR: {
    SIZE_MB: 5,
    SIZE_BYTES: 5 * 1024 * 1024,
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
  COVER: {
    SIZE_MB: 10,
    SIZE_BYTES: 10 * 1024 * 1024,
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
} as const;

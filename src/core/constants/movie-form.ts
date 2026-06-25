import { ContentWarning, AffiliationType } from "../domain/movie";

export const COLOR_OPTIONS = [
  { value: "color", label: "ภาพสี" },
  { value: "black_and_white", label: "ขาวดำ" },
  { value: "color_and_bw", label: "ภาพสีและขาวดำ" },
];

export const ASPECT_RATIO_OPTIONS = [
  { value: "landscape", label: "แนวนอน" },
  { value: "portrait", label: "แนวตั้ง" },
];

export const CONTENT_WARNING_OPTIONS = [
  { value: ContentWarning.VIOLENCE, label: "ความรุนแรง" },
  { value: ContentWarning.GORE, label: "เลือด/บาดแผล" },
  { value: ContentWarning.PROFANITY, label: "คำหยาบ" },
  { value: ContentWarning.SEXUAL_CONTENT, label: "เนื้อหาทางเพศ" },
  { value: ContentWarning.NUDITY, label: "เปลือยกาย" },
  { value: ContentWarning.SMOKING, label: "สูบบุหรี่" },
  { value: ContentWarning.ALCOHOL, label: "ดื่มแอลกอฮอล์" },
  { value: ContentWarning.DRUGS, label: "สารเสพติด" },
  { value: ContentWarning.MENTAL_HEALTH, label: "สุขภาพจิต/การฆ่าตัวตาย" },
  { value: ContentWarning.FLASHING_LIGHTS, label: "แสงกระพริบ" },
  { value: "OTHER", label: "อื่น ๆ (ระบุ)" },
];

export const DROPDOWN_PLACEHOLDERS = {
  LANGUAGE: { value: "", label: "เลือกภาษาของภาพยนตร์..." },
  UNIVERSITY: { value: "", label: "ไม่ระบุ / เลือกสถาบันการศึกษา..." },
  SCHOOL: { value: "", label: "ไม่ระบุ / เลือกโรงเรียน..." },
};

export interface CrewRoleDefinition {
  id: string;
  code: string;
  label: string;
}

export interface CrewCategory {
  id: string;
  label: string;
  roles: CrewRoleDefinition[];
}

export const AGE_RATING_OPTIONS = ["G", "PG", "PG-13", "NC-17", "R"];

export const LANGUAGE_OPTIONS = ["ไทย", "อังกฤษ", "เกาหลี", "ญี่ปุ่น", "จีน"];

export const AFFILIATION_TABS = [
  { type: "university" as AffiliationType, label: "มหาวิทยาลัย" },
  { type: "school" as AffiliationType, label: "โรงเรียน" },
  { type: "studio" as AffiliationType, label: "สตูดิโอ/อิสระ" },
] as const;

export const LANGUAGE_SELECT_OPTIONS = LANGUAGE_OPTIONS.map((l) => ({ value: l, label: l }));
export const AGE_RATING_SELECT_OPTIONS = AGE_RATING_OPTIONS.map((r) => ({ value: r, label: r }));

export const CREW_CATEGORY_CONFIG = [
  { id: "production_management", label: "ฝ่ายบริหาร" },
  { id: "directing", label: "ฝ่ายกำกับ" },
  { id: "screenplay", label: "ฝ่ายบท" },
  { id: "camera", label: "ฝ่ายถ่ายภาพ" },
  { id: "lighting", label: "ฝ่ายแสง" },
  { id: "grip", label: "ฝ่ายขนย้าย/ติดตั้งอุปกรณ์" },
  { id: "sound", label: "ฝ่ายเสียง" },
  { id: "art", label: "ฝ่ายศิลป์" },
  { id: "costume", label: "ฝ่ายเครื่องแต่งกาย" },
  { id: "makeup", label: "ฝ่ายแต่งหน้า/ทำผม" },
  { id: "cast", label: "ฝ่ายแสดง" },
  { id: "location", label: "ฝ่ายสถานที่ถ่ายทำ" },
  { id: "support", label: "ฝ่ายจัดการผลิต/สนับสนุน" },
  { id: "vfx", label: "ฝ่ายเอฟเฟกต์พิเศษในกองถ่าย" },
  { id: "post_production", label: "ฝ่ายหลังการผลิต" },
];

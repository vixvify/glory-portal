import { ContentWarning } from "../domain/movie";

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

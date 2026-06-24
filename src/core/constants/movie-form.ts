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
  { value: "violence", label: "ความรุนแรง" },
  { value: "gore", label: "เลือด/บาดแผล" },
  { value: "profanity", label: "คำหยาบ" },
  { value: "sexualContent", label: "เนื้อหาทางเพศ" },
  { value: "nudity", label: "เปลือยกาย" },
  { value: "smoking", label: "สูบบุหรี่" },
  { value: "alcohol", label: "ดื่มแอลกอฮอล์" },
  { value: "drugs", label: "สารเสพติด" },
  { value: "mentalHealth", label: "สุขภาพจิต/การฆ่าตัวตาย" },
  { value: "flashingLights", label: "แสงกระพริบ" },
  { value: "other", label: "อื่น ๆ (ระบุ)" },
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

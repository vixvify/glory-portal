import { AffiliationType } from "../domain/movie";

export const ASPECT_RATIO_OPTIONS = [
  { value: "landscape", label: "แนวนอน" },
  { value: "portrait", label: "แนวตั้ง" },
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

export const AFFILIATION_TABS = [
  { type: "university" as AffiliationType, label: "มหาวิทยาลัย" },
  { type: "school" as AffiliationType, label: "โรงเรียน" },
  { type: "studio" as AffiliationType, label: "สังกัด" },
] as const;

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
  { id: "locations", label: "ฝ่ายสถานที่ถ่ายทำ" },
  { id: "production_support", label: "ฝ่ายจัดการผลิต/สนับสนุน" },
  { id: "vfx", label: "ฝ่ายเอฟเฟกต์พิเศษในกองถ่าย" },
  { id: "post_production", label: "ฝ่ายหลังการผลิต" },
];

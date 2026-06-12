export const COLOR_OPTIONS = [
  { value: "color", label: "ภาพสี" },
  { value: "black_and_white", label: "ขาวดำ" },
  { value: "color_and_black_and_white", label: "ภาพสีและขาวดำ" },
];

export const ASPECT_RATIO_OPTIONS = [
  { value: "landscape", label: "แนวนอน" },
  { value: "portrait", label: "แนวตั้ง" },
];

export const CONTENT_WARNING_OPTIONS = [
  { value: "profanity", label: "มีคำหยาบคาย" },
  { value: "drugs", label: "มียาเสพติด/สิ่งมึนเมา" },
];

export const DROPDOWN_PLACEHOLDERS = {
  LANGUAGE: { value: "", label: "เลือกภาษาของภาพยนตร์..." },
  UNIVERSITY: { value: "", label: "ไม่ระบุ / เลือกสถาบันการศึกษา..." },
  SCHOOL: { value: "", label: "ไม่ระบุ / เลือกโรงเรียน..." },
};

export const CREW_TAB_OPTIONS = [
  { id: "director", label: "ผู้กำกับ" },
  { id: "producer", label: "ผู้อำนวยการสร้าง" },
  { id: "writer", label: "ผู้เขียนบท" },
  { id: "cast", label: "นักแสดงนำ" },
  { id: "dop", label: "ผู้กำกับภาพ" },
  { id: "editor", label: "ผู้ลำดับภาพ" },
] as const;

export const CREW_MAPPING = [
  { id: "director", label: "ผู้กำกับ" },
  { id: "producer", label: "ผู้อำนวยการสร้าง" },
  { id: "writer", label: "ผู้เขียนบท" },
  { id: "cast", label: "นักแสดง" },
  { id: "dop", label: "ผู้กำกับภาพ" },
  { id: "editor", label: "ผู้ลำดับภาพ" },
] as const;

export type CrewTabId = (typeof CREW_TAB_OPTIONS)[number]["id"];

export const AGE_RATING_OPTIONS = ["G", "PG", "PG-13", "NC-17", "R"];

export const LANGUAGE_OPTIONS = ["ไทย", "อังกฤษ", "เกาหลี", "ญี่ปุ่น", "จีน"];

export const CREW_TAB_CONFIG = [
  {
    id: "director" as CrewTabId,
    label: "ผู้กำกับ",
    placeholder: "พิมพ์ชื่อ หรือเลือกผู้กำกับจากคลังรายชื่อ...",
    addLabel: "เพิ่มรายชื่อผู้กำกับ",
  },
  {
    id: "producer" as CrewTabId,
    label: "ผู้อำนวยการสร้าง",
    placeholder: "พิมพ์ชื่อ หรือเลือกผู้อำนวยการสร้าง...",
    addLabel: "เพิ่มรายชื่อผู้อำนวยการสร้าง",
  },
  {
    id: "writer" as CrewTabId,
    label: "ผู้เขียนบท",
    placeholder: "พิมพ์ชื่อ หรือเลือกผู้เขียนบท...",
    addLabel: "เพิ่มรายชื่อผู้เขียนบท",
  },
  {
    id: "cast" as CrewTabId,
    label: "นักแสดงนำ",
    placeholder: "พิมพ์ชื่อ หรือเลือกนักแสดง...",
    addLabel: "เพิ่มรายชื่อนักแสดง",
  },
  {
    id: "dop" as CrewTabId,
    label: "ผู้กำกับภาพ",
    placeholder: "พิมพ์ชื่อ หรือเลือกผู้กำกับภาพ...",
    addLabel: "เพิ่มรายชื่อผู้กำกับภาพ",
  },
  {
    id: "editor" as CrewTabId,
    label: "ผู้ลำดับภาพ",
    placeholder: "พิมพ์ชื่อ หรือเลือกผู้ลำดับภาพ...",
    addLabel: "เพิ่มรายชื่อผู้ลำดับภาพ",
  },
];

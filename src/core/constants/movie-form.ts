export const COLOR_OPTIONS = [
  { value: "color", label: "ภาพสี" },
  { value: "black_and_white", label: "ขาวดำ" },
  { value: "color_and_black_and_white", label: "ภาพสีและขาวดำ" },
];

export const ASPECT_RATIO_OPTIONS = [
  { value: "แนวนอน", label: "แนวนอน" },
  { value: "แนวตั้ง", label: "แนวตั้ง" },
];

export const CONTENT_WARNING_OPTIONS = [
  { value: "profanity", label: "มีคำหยาบคาย" },
  { value: "drugs", label: "มียาเสพติด/สิ่งมึนเมา" },
];

export const DROPDOWN_PLACEHOLDERS = {
  LANGUAGE: { value: "", label: "เลือกภาษาของภาพยนตร์..." },
  TARGET_GROUP: { value: "", label: "เลือกกลุ่มเป้าหมาย..." },
  UNIVERSITY: { value: "", label: "ไม่ระบุ / เลือกสถาบันการศึกษา..." },
};

export const CREW_TAB_OPTIONS = [
  { id: "director", label: "ผู้กำกับ" },
  { id: "producer", label: "ผู้อำนวยการสร้าง" },
  { id: "writer", label: "ผู้เขียนบท" },
  { id: "cast", label: "นักแสดงนำ" },
  { id: "dop", label: "ผู้กำกับภาพ" },
  { id: "editor", label: "ผู้ลำดับภาพ" },
] as const;

export type CrewTabId = (typeof CREW_TAB_OPTIONS)[number]["id"];

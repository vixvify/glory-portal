import { ContentWarning } from "@/core/domain/movie";

export const MOVIE_MESSAGES = {
  LOADING: {
    DELETE_MOVIE: "กำลังลบภาพยนตร์...",
    SAVE_MOVIE: "กำลังบันทึกภาพยนตร์...",
    SUB_DELETE_MOVIE: "กรุณารอสักครู่ ระบบกำลังลบภาพยนตร์ออกจากระบบคลัง",
    SUB_SAVE_MOVIE: "กรุณารอสักครู่ ระบบกำลังอัปโหลดข้อมูลและจัดเก็บภาพปก",
  },
  TOAST: {
    EDIT_MOVIE_SUCCESS: "แก้ไขข้อมูลภาพยนตร์เรียบร้อยแล้ว",
    ADD_MOVIE_SUCCESS: "เพิ่มภาพยนตร์เข้าสู่ระบบเรียบร้อยแล้ว",
    DELETE_MOVIE_SUCCESS: "ลบภาพยนตร์ออกจากระบบเรียบร้อยแล้ว",
    ADD_RATING_SUCCESS: "เพิ่มคะแนนแล้ว",
    EDIT_RATING_SUCCESS: "แก้ไขคะแนนแล้ว",
    DELETE_RATING_SUCCESS: "ลบคะแนนแล้ว",
  },
  ERRORS: {
    SAVE_MOVIE: "เกิดข้อผิดพลาดในการบันทึกภาพยนตร์",
    LOAD_MOVIE: "เกิดข้อผิดพลาดในการโหลดภาพยนตร์",
  },
  CONFIRM: {
    DELETE_MOVIE_TITLE: "ยืนยันการลบข้อมูล",
    DELETE_MOVIE_MSG:
      "การดำเนินการนี้ไม่สามารถย้อนกลับได้ ภาพยนตร์เรื่องที่เลือกจะถูกลบออกจากฐานข้อมูลระบบและคลังฉายภาพยนตร์ทันที",
    DELETE_MOVIE_BTN: "ยืนยัน",
    EDIT_MOVIE_TITLE: "ยืนยันการแก้ไข",
    ADD_MOVIE_TITLE: "ยืนยันการเพิ่ม",
    EDIT_MOVIE_MSG: (title: string) =>
      `คุณแน่ใจหรือไม่ว่าต้องการบันทึกการแก้ไขของภาพยนตร์เรื่อง "${title}"?`,
    ADD_MOVIE_MSG: (title: string) =>
      `คุณแน่ใจหรือไม่ว่าต้องการเพิ่มภาพยนตร์เรื่อง "${title}" เข้าสู่ระบบพร้อมเผยแพร่?`,
  },
  COMMON: {
    MOVIES_COUNT: (count: number) => `ภาพยนตร์ (${count})`,
  },
} as const;

const WARNING_MAP: Record<string, string> = {
  [ContentWarning.PROFANITY]: "คำหยาบคาย",
  [ContentWarning.VIOLENCE]: "ความรุนแรง",
  [ContentWarning.DRUGS]: "ยาเสพติด",
  [ContentWarning.GORE]: "เลือดสาด",
  [ContentWarning.SEXUAL_CONTENT]: "เนื้อหาทางเพศ",
  [ContentWarning.NUDITY]: "ภาพโป๊เปลือย",
  [ContentWarning.SMOKING]: "การสูบบุหรี่",
  [ContentWarning.ALCOHOL]: "การดื่มสุรา",
  [ContentWarning.MENTAL_HEALTH]: "ปัญหาสุขภาพจิต",
  [ContentWarning.FLASHING_LIGHTS]: "แสงกะพริบ",
};

export const mapContentWarnings = (warnings?: string[] | null): string | null => {
  if (!warnings || warnings.length === 0) return null;
  return warnings.map(w => WARNING_MAP[w] || w).join(" • ");
};

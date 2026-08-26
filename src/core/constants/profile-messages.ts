export const PROFILE_MESSAGES = {
  TOAST: {
    UPDATE_PROFILE_SUCCESS: "อัปเดตโปรไฟล์เรียบร้อยแล้ว",
    INVALID_IMAGE_TYPE: "รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP, GIF) เท่านั้น",
    COVER_SIZE_LIMIT: "ขนาดรูปภาพหน้าปกต้องไม่เกิน 10MB",
    AVATAR_SIZE_LIMIT: "ขนาดรูปภาพต้องไม่เกิน 5MB",
    UPLOADING_COVER: "กำลังบีบอัดและอัปโหลดภาพปก...",
    UPLOADING_AVATAR: "กำลังบีบอัดและอัปโหลดรูปภาพ...",
    UPLOAD_COVER_SUCCESS: "อัปเดตภาพปกเรียบร้อยแล้ว",
    UPLOAD_AVATAR_SUCCESS: "อัปเดตรูปโปรไฟล์เรียบร้อยแล้ว",
    COPY_LINK_SUCCESS: "คัดลอกลิงก์โปรไฟล์แล้ว นำไปแชร์ต่อได้เลย!",
    COPY_LINK_FAILED: "ไม่สามารถคัดลอกลิงก์ได้",
  },
  ERRORS: {
    UPDATE_PROFILE: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
  },
  CROP: {
    TITLE: "ตัดแต่งรูปภาพประจำตัว",
    SUBTITLE:
      "ลากเพื่อขยับรูปภาพ และปรับขนาดการซูมเพื่อให้จัดวางใบหน้าลงในวงกลมได้อย่างสวยงาม",
    ZOOM: "ระดับการซูม",
    CANCEL: "ยกเลิก",
    CONFIRM: "เสร็จสิ้น",
  },
  CONFIRM: {
    SAVE_PROFILE_TITLE: "ยืนยันการบันทึกข้อมูล",
    SAVE_PROFILE_MSG: "คุณต้องการบันทึกการเปลี่ยนแปลงของข้อมูลโปรไฟล์ใช่หรือไม่?",
    SAVE_PROFILE_BTN: "บันทึกข้อมูล",
    UPDATE_AVATAR_TITLE: "ยืนยันการเปลี่ยนรูปโปรไฟล์",
    UPDATE_AVATAR_MSG: "คุณต้องการเปลี่ยนรูปโปรไฟล์ใหม่ใช่หรือไม่?",
    UPDATE_AVATAR_BTN: "เปลี่ยนรูปภาพ",
    UPDATE_COVER_TITLE: "ยืนยันการเปลี่ยนรูปภาพปก",
    UPDATE_COVER_MSG: "คุณต้องการเปลี่ยนรูปภาพปกใหม่ใช่หรือไม่?",
    UPDATE_COVER_BTN: "เปลี่ยนรูปภาพ",
  },
  LOADING: {
    SAVING: "กำลังบันทึก...",
  },
  COMMON: {
    NO_AWARDS: "ไม่มีประวัติรางวัลเกียรติยศ",
    NO_BIO: "ไม่มีข้อมูลประวัติผู้ใช้งาน",
    NO_POSITIONS: "ไม่ได้ระบุตำแหน่งประจำตัว",
    NO_SOCIALS: "ไม่ได้ระบุลิงก์โซเชียลมีเดีย",
  },
} as const;

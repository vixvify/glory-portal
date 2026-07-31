export const AUTH_MESSAGES = {
  TOAST: {
    REGISTER_SUCCESS: "ลงทะเบียนสำเร็จแล้ว! กรุณาเข้าสู่ระบบเพื่อเข้าใช้งาน.",
    LOGIN_SUCCESS: "เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับกลับ.",
    LOGOUT_SUCCESS: "ออกจากระบบสำเร็จ",
    VERIFY_CODE_SENT: "ส่งรหัสยืนยันไปยังอีเมลของคุณแล้ว",
    RESET_PASSWORD_SUCCESS: "รีเซ็ตรหัสผ่านสำเร็จแล้ว",
    LOGIN_REQUIRED: "กรุณาเข้าสู่ระบบก่อนใช้งาน",
    LOGIN_REQUIRED_VOTE: "กรุณาเข้าสู่ระบบก่อนโหวตคะแนน",
  },
  ERRORS: {
    REGISTER_FAILED: "ลงทะเบียนไม่สำเร็จ",
    LOGIN_FAILED: "เข้าสู่ระบบไม่สำเร็จ",
    SEND_EMAIL_FAILED: "เกิดข้อผิดพลาดในการส่งอีเมล",
    RESET_PASSWORD_FAILED: "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน",
    INVALID_VERIFY_CODE: "รหัสยืนยันไม่ถูกต้อง (กรุณาใช้รหัส 123456)",
  },
} as const;

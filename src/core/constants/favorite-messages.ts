export const FAVORITE_MESSAGES = {
  TOAST: {
    ADD_FAVORITE_SUCCESS: "เพิ่มลงในรายการโปรดแล้ว",
    REMOVE_FAVORITE_SUCCESS: "นำออกจากรายการโปรดแล้ว",
    ADD_MY_LIST_SUCCESS: "เพิ่มลงในรายการของฉันแล้ว",
    REMOVE_MY_LIST_SUCCESS: "นำออกจากรายการของฉันแล้ว",
  },
  ERRORS: {
    FAVORITE_UPDATE: "เกิดข้อผิดพลาดในการปรับปรุงรายการโปรด",
    FAVORITE_LIST_UPDATE: "เกิดข้อผิดพลาดในการปรับปรุงรายการ",
  },
  COMMON: {
    LOGIN_REQUIRED: "เข้าสู่ระบบเพื่อดูรายการของฉัน",
    NO_FAVORITES: "ยังไม่มีรายการของฉัน",
  },
} as const;

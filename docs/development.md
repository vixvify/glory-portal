# การติดตั้ง พัฒนา และตรวจสอบงาน

## สิ่งที่ต้องมี

- Node.js ที่รองรับ Next.js 16
- npm
- Backend API ที่เข้าถึงได้

## ตั้งค่า environment

สร้างหรือแก้ไฟล์ `.env` ที่ root ของโปรเจกต์:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

ถ้าไม่กำหนดตัวแปรนี้ frontend จะใช้ค่า default เดียวกันโดยอัตโนมัติ ตรวจสอบให้ backend เปิดอยู่และ CORS/cookie อนุญาต origin ของ frontend

## ติดตั้งและรัน

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000`

## คำสั่งสำคัญ

```bash
npm run dev       # รัน development server
npm run lint      # ตรวจสอบ ESLint
npm run typecheck # สร้าง Next typegen และตรวจ TypeScript
npm run build     # build สำหรับ production
npm run start     # รัน build ที่สร้างแล้ว
```

ลำดับที่ควรรันก่อนส่งงาน:

```bash
npm run lint
npm run typecheck
npm run build
```

## Checklist ทดสอบด้วยมือ

- เปิดหน้าแรกและตรวจ loading/empty/error state
- สมัครสมาชิก ล็อกอิน logout และ refresh หน้าเพื่อยืนยัน session
- ค้นหา/กรองหนัง และเปิดรายละเอียดหนัง
- เพิ่ม/ลบรายการโปรด และเพิ่ม/แก้ไข/ลบ rating
- เปิดหน้าโปรไฟล์และทดสอบแก้ข้อมูล/อัปโหลดรูป
- ทดสอบเส้นทางที่ต้องล็อกอินและเส้นทาง admin ด้วยสิทธิ์ที่เหมาะสม
- ตรวจว่ารูปจาก domain ที่ใช้จริงอยู่ใน `next.config.ts` แล้ว
- เปิด browser console และ network tab ตรวจ error, status code และ cookie

## แนวทางแก้ปัญหาเบื้องต้น

### เรียก API ไม่ได้

ตรวจ `NEXT_PUBLIC_API_URL`, สถานะ backend, CORS และ cookie ก่อน จากนั้นดู Network tab ว่า request ถูกส่งไป URL ใด

### ข้อมูลเก่าไม่อัปเดต

ตรวจ query key และการ invalidate หลัง mutation ใน hook ที่เกี่ยวข้อง ไม่ควรแก้ด้วยการเก็บข้อมูล backend ซ้ำใน Zustand

### รูปภาพแสดงไม่ได้

ตรวจ hostname ใน `next.config.ts` และรูปแบบ URL ที่ backend ส่งกลับ หากเพิ่ม remote host ต้องเพิ่มใน `images.remotePatterns`

### หน้าไม่แสดงหลังเปิดเว็บ

ตรวจ `useCheckAuth()` และค่า `isCheckingAuth` ใน store ก่อน เพราะ provider จะแสดง loading จนกว่าจะจบขั้นตอนตรวจ session

## ข้อควรระวัง

- ใช้ TypeScript แบบ strict และหลีกเลี่ยง `any`
- อย่าใส่ business logic หนักใน JSX ของ page/component
- endpoint ที่รับไฟล์ต้องส่ง `FormData` และกำหนด `multipart/form-data` ตาม repository เดิม
- ก่อนแก้ไฟล์ที่มีการเปลี่ยนแปลงของผู้พัฒนาคนอื่น ให้ตรวจ `git status` และ diff ก่อนเสมอ

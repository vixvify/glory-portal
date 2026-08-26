# เอกสารสำหรับผู้พัฒนา Thai Flix

เอกสารชุดนี้เป็นคู่มือส่งต่องานสำหรับผู้พัฒนาที่เข้ามาดูแลโปรเจกต์ต่อ โดยอ้างอิงจากโค้ดใน repository ณ วันที่ 10 สิงหาคม 2026

## อ่านเอกสารตามลำดับ

1. [สถาปัตยกรรมและโครงสร้างโปรเจกต์](./architecture.md)
2. [การติดตั้ง พัฒนา และตรวจสอบงาน](./development.md)
3. [เส้นทางหน้าเว็บและ API](./api-reference.md)

## โปรเจกต์นี้คืออะไร

Thai Flix เป็นเว็บแอปสำหรับค้นหา ดู และจัดการข้อมูลภาพยนตร์ รวมถึงข้อมูลทีมงาน/นักแสดง การให้คะแนน รายการโปรด โปรไฟล์ผู้ใช้ และส่วนจัดการสำหรับแอดมิน

## เทคโนโลยีหลัก

- Next.js 16 และ React 19 โดยใช้ App Router
- TypeScript และ ESLint
- Axios สำหรับเรียก backend API
- TanStack React Query สำหรับ server state และ cache
- Zustand สำหรับ state ฝั่ง client ที่ใช้ร่วมกัน เช่น ผู้ใช้ปัจจุบัน toast และคำค้นหา
- Zod และ React Hook Form สำหรับ validation/form
- MUI, Emotion และ Tailwind CSS สำหรับ UI

## จุดที่ควรรู้ก่อนเริ่มแก้ไข

- Frontend เรียก backend ผ่าน `NEXT_PUBLIC_API_URL` หากไม่กำหนดจะใช้ `http://localhost:8000/api`
- Axios ตั้ง `withCredentials: true` ดังนั้นการล็อกอินพึ่งพา cookie/session ของ backend
- การเรียก API ควรผ่าน service/repository ที่มีอยู่ ไม่ควรเรียก Axios ใน component โดยตรง
- ข้อมูล domain, contract และ validation อยู่ใน `src/core`; implementation ของการเรียก API อยู่ใน `src/infra`
- ห้าม commit ค่า secret จากไฟล์ `.env`

## สถานะเอกสาร

หากแก้ architecture, route, environment variable หรือสคริปต์ใน `package.json` ควรปรับเอกสารชุดนี้พร้อมกัน

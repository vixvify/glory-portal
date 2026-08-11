# สถาปัตยกรรมและโครงสร้างโปรเจกต์

## ภาพรวมการไหลของข้อมูล

```text
หน้าใน src/app
  -> components / hooks
  -> service ใน src/core/service
  -> port ใน src/core/ports
  -> repository implementation ใน src/infra/repositories
  -> httpClient ใน src/lib/http.ts
  -> Backend API
```

`src/infra/container.ts` เป็นจุดประกอบ dependency โดยสร้าง repository แล้วส่งเข้า service แต่ละตัว จากนั้น export service ที่หน้าและ hooks นำไปใช้

## โครงสร้างไดเรกทอรี

```text
src/
├── app/                 # route ของ Next.js และ layout/provider ระดับแอป
├── components/          # UI ที่แบ่งตามหน้าที่/ฟีเจอร์
├── core/
│   ├── constants/       # ข้อความ ค่าคงที่ และตัวเลือกที่ใช้ร่วมกัน
│   ├── domain/          # type/model ของธุรกิจ
│   ├── ports/           # interface ของ repository
│   ├── schema/          # schema สำหรับ validation
│   └── service/         # business/use-case layer
├── hooks/
│   ├── db/              # hooks ที่ผูกกับ query และข้อมูลจาก backend
│   └── system/          # hooks ทั่วไปของ UI/ระบบ
├── infra/
│   ├── interface/       # response contract จาก backend
│   ├── repositories/    # implementation การเรียก API
│   └── container.ts     # dependency wiring
├── lib/                 # utility ระดับ library เช่น http client
├── store/               # Zustand store
└── utils/               # ฟังก์ชันช่วยเหลือเฉพาะงาน
```

## กติกาเลือกตำแหน่งโค้ด

- เพิ่ม type ของข้อมูลธุรกิจใน `src/core/domain`
- เพิ่ม contract การเข้าถึงข้อมูลใน `src/core/ports`
- เพิ่ม use case หรือ business rule ใน `src/core/service`
- เพิ่มการเรียก endpoint จริงใน `src/infra/repositories`
- เพิ่ม query/mutation hook ใน `src/hooks/db`
- เพิ่ม component ที่นำกลับมาใช้ซ้ำใน `src/components`
- เก็บ state ที่ต้องใช้ข้าม component ใน `src/store`; อย่าใช้ Zustand แทน server cache

## Data fetching และ authentication

`src/app/providers.tsx` สร้าง `QueryClient` โดยกำหนด `staleTime` 60 วินาที และปิด `refetchOnWindowFocus` จากนั้น `AuthInitializer` เรียก `useCheckAuth()` ก่อนแสดงหน้าเว็บ หากยังตรวจ session ไม่เสร็จจะแสดง `src/app/loading.tsx`

สถานะผู้ใช้ปัจจุบันอยู่ใน `useAppStore` ส่วนข้อมูลจาก backend ควรอยู่ใน React Query และ mutation ควร invalidate query ที่เกี่ยวข้องตาม hook นั้น ๆ

## รูปแบบ response และ error

`src/lib/http.ts` แปลง response มาตรฐานให้เหลือ `ApiResponse<T>` และแปลง error จาก backend เป็น `Error` ที่มีข้อความอ่านได้ ก่อนส่งต่อให้ service/hook จัดการ loading, error และ empty state ใน UI

## การเพิ่มฟีเจอร์ใหม่แบบแนะนำ

1. กำหนด domain type และ schema
2. เพิ่ม repository interface ใน `core/ports`
3. เพิ่ม repository implementation ใน `infra/repositories`
4. เพิ่ม service และลงทะเบียนใน `infra/container.ts`
5. เพิ่ม query/mutation hook
6. สร้างหรือปรับ component และ route
7. เพิ่ม loading/error/empty state และตรวจสอบ accessibility
8. อัปเดตเอกสารใน `docs`

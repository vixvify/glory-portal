# เส้นทางหน้าเว็บและ API

รายการนี้สรุปจาก repository ที่ frontend เรียกใช้จริง โดย base URL มาจาก `NEXT_PUBLIC_API_URL`

## หน้าเว็บหลัก

| Path | หน้าที่ |
|---|---|
| `/` | หน้าเริ่มต้น |
| `/home` | หน้า home |
| `/auth/login` | เข้าสู่ระบบ |
| `/auth/register` | สมัครสมาชิก |
| `/auth/forgot-password` | ลืมรหัสผ่าน |
| `/movies/[id]` | รายละเอียดหนัง |
| `/movies/[id]/edit` | แก้ไขหนัง |
| `/movies/favorites` | หนังที่ชอบ |
| `/movies/trending` | หนังยอดนิยม/กำลังเป็นกระแส |
| `/movies/category/[category]` | หนังตามหมวดหมู่ |
| `/movies/university/[university]` | หนังตามมหาวิทยาลัย |
| `/movies/school` และ `/movies/school/[school]` | หนังตามคณะ/สาขาโรงเรียน |
| `/create/movie` | สร้างหนัง |
| `/crew/[id]` | รายละเอียดทีมงาน |
| `/crew/[id]/edit` | แก้ไขทีมงาน |
| `/profile` | โปรไฟล์ผู้ใช้ |
| `/watch/[id]` | หน้าดูหนัง |
| `/admin` | หน้า admin |
| `/admin/movies` | จัดการหนังสำหรับ admin |
| `/admin/crew` | จัดการทีมงานสำหรับ admin |

## Authentication และโปรไฟล์

| Method | Endpoint | การใช้งาน |
|---|---|---|
| POST | `/auth/register` | สมัครสมาชิกแบบ multipart |
| POST | `/auth/login` | เข้าสู่ระบบ |
| POST | `/auth/logout` | ออกจากระบบ |
| GET | `/auth/me` | ตรวจผู้ใช้ปัจจุบัน |
| PATCH | `/auth/profile` | แก้โปรไฟล์แบบ multipart |

## หนัง

| Method | Endpoint | การใช้งาน |
|---|---|---|
| GET | `/movie` | รายการหนังและ filter params |
| GET | `/movie/{id}` | รายละเอียดหนัง |
| GET | `/movie/my-movies` | หนังของผู้ใช้ |
| GET | `/movie/my-contributions` | หนังที่ผู้ใช้มีส่วนร่วม |
| GET | `/movie/category/{category}` | หนังตามหมวดหมู่ |
| GET | `/movie/university/{university}` | หนังตามมหาวิทยาลัย |
| GET | `/movie/movies-with-award` | หนังที่มีรางวัล |
| GET | `/movie/movies-with-bts` | หนังที่มีเบื้องหลัง |
| POST | `/movie` | สร้างหนังแบบ multipart |
| PUT | `/movie/{id}` | แก้ไขหนังแบบ multipart |
| DELETE | `/movie/{id}` | ลบหนัง |

## ทีมงาน รายการโปรด และ rating

| Method | Endpoint | การใช้งาน |
|---|---|---|
| GET | `/crew-members` | ค้นหารายการทีมงาน |
| GET | `/crew-members/my-crew` | ทีมงานของผู้ใช้ |
| GET | `/crew-members/{id}` | รายละเอียดทีมงาน |
| POST | `/crew-members` | สร้างทีมงาน |
| PUT | `/crew-members/{id}` | แก้ไขทีมงาน |
| DELETE | `/crew-members/{id}` | ลบทีมงาน |
| GET | `/movie/favorites` | ดึงรายการโปรด |
| POST | `/movie/favorites` | เพิ่มรายการโปรด โดยส่ง `movieId` |
| DELETE | `/movie/favorites/{movieId}` | ลบรายการโปรด |
| GET | `/movie/ratings` | ดึง rating ของหนังและผู้ใช้ |
| GET | `/movie/ratings/check` | ตรวจว่ามี rating แล้วหรือไม่ |
| POST/PUT | `/movie/ratings` | เพิ่มหรือแก้ไข rating |
| DELETE | `/movie/ratings` | ลบ rating โดยส่งข้อมูลใน body |
| POST | `/watch-sessions` | บันทึก session การรับชม |

## Master data

| Method | Endpoint | การใช้งาน |
|---|---|---|
| GET | `/masterdata/categories` | หมวดหมู่หนัง |
| GET | `/masterdata/universities` | รายชื่อมหาวิทยาลัย |
| GET | `/masterdata/crew-roles` | บทบาททีมงาน |
| GET | `/masterdata/active-university` | มหาวิทยาลัยที่ active สูงสุด |

รายละเอียดชนิดข้อมูลและ payload ให้ยึด type ใน `src/core/domain` และ method ใน `src/infra/repositories` เป็นหลัก เพราะเอกสารนี้ตั้งใจเป็นแผนที่ภาพรวม ไม่ใช่ OpenAPI contract

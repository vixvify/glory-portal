"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/watch")) {
    return null;
  }

  return (
    <footer className="relative z-30 bg-zinc-950/40 border-t border-white/5 pt-16 pb-8 px-6 md:px-16 text-zinc-400 select-none overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[200px] bg-brand/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand/3 rounded-full blur-[100px] pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 relative z-10">
        <div className="lg:col-span-2 space-y-6">
          <Link
            href="/"
            className="text-3xl font-black tracking-tighter text-brand inline-block hover:scale-[1.02] transition-transform duration-300"
            style={{
              textShadow: `0 0 10px rgba(var(--theme-primary-rgb),0.35)`,
            }}
          >
            GLORY
          </Link>
          <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed max-w-sm">
            แพลตฟอร์มสตรีมมิ่งภาพยนตร์สั้นระดับพรีเมียม
            สนับสนุนการสร้างสรรค์และเผยแพร่ผลงานภาพยนตร์สั้นจากคนรุ่นใหม่
            มหาวิทยาลัย และสถาบันการศึกษาทั่วประเทศ
          </p>

          <div className="flex items-center gap-4 pt-2">
            {[
              {
                name: "Facebook",
                href: "https://facebook.com",
                svg: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3h-4V6.5c0-.8.7-1.5 1.5-1.5H17V2h-3c-2.8 0-5 2.2-5 5v1z" />
                  </svg>
                ),
              },
              {
                name: "YouTube",
                href: "https://youtube.com",
                svg: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                ),
              },
              {
                name: "Instagram",
                href: "https://instagram.com",
                svg: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                ),
              },
              {
                name: "Twitter",
                href: "https://twitter.com",
                svg: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-brand hover:border-brand/40 hover:bg-brand/5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
                title={social.name}
              >
                {social.svg}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
            สำรวจ
          </h4>
          <ul className="space-y-2.5 text-xs md:text-sm font-light">
            {[
              { label: "หน้าแรก", href: "/" },
              { label: "รายการของฉัน", href: "/movies/favorites" },
              { label: "ประวัติผลงานสถาบัน", href: "/admin" },
              { label: "เพิ่มภาพยนตร์สั้น", href: "/create/movie" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-brand transition-colors duration-250 cursor-pointer"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
            หมวดหมู่ยอดนิยม
          </h4>
          <ul className="space-y-2.5 text-xs md:text-sm font-light">
            {[
              { label: "ภาพยนตร์ดราม่า", href: "/movies/category/drama" },
              { label: "ตลก / คอมเมดี้", href: "/movies/category/comedy" },
              {
                label: "สยองขวัญ / ระทึกขวัญ",
                href: "/movies/category/horror",
              },
              { label: "ไซไฟ / แฟนตาซี", href: "/movies/category/sci-fi" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="hover:text-brand transition-colors duration-250 cursor-pointer"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">
            ติดตามข่าวสาร
          </h4>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            รับข้อมูลอัปเดตเกี่ยวกับภาพยนตร์สั้นเทศกาลใหม่และการประกวดรางวัล
          </p>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-1.5 gap-2 focus-within:border-brand/40 focus-within:bg-zinc-900/60 transition-all duration-300">
            <EmailIcon className="text-sm text-zinc-500" />
            <input
              type="email"
              placeholder="อีเมลของคุณ..."
              className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full"
            />
            <button className="text-[10px] uppercase font-bold text-brand hover:text-brand-hover tracking-wider cursor-pointer">
              ส่ง
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] md:text-xs relative z-10">
        <p className="font-light">
          &copy; {new Date().getFullYear()} GLORY. All rights reserved.
        </p>
        <div className="flex items-center gap-6 font-light">
          <Link href="/privacy" className="hover:text-white transition-colors">
            นโยบายความเป็นส่วนตัว
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            ข้อตกลงการใช้งาน
          </Link>
          <span className="text-zinc-600">|</span>
          <span className="text-brand/60">
            สนับสนุนและยกระดับวงการภาพยนตร์สั้นไทย
          </span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-store";
import {
  useCategoriesQuery,
  useUniversitiesQuery,
} from "@/hooks/db/use-master-data";
import { useLogoutMutation } from "@/hooks/db/use-auth";
import { useFavoritesQuery } from "@/hooks/db/use-favorites";
import { useSearchPlaceholder } from "@/hooks/system/use-search-placeholder";
import { MOCK_SCHOOLS } from "@/core/constants/mock-schools";

export default function Navbar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, currentUser } = useAppStore();
  const currentPlaceholder = useSearchPlaceholder(30000);

  const { data: categories = [] } = useCategoriesQuery();
  const { data: universities = [] } = useUniversitiesQuery();
  const { data: favorites = [] } = useFavoritesQuery(!!currentUser);
  const logoutMutation = useLogoutMutation();

  const [activeTab, setActiveTab] = useState<
    "category" | "university" | "school" | "favorites"
  >("category");

  const onSignOut = () => {
    logoutMutation.mutate();
  };

  const onSignInClick = () => {
    router.push("/auth/login");
  };

  const handleNavClick = (category: string | null) => {
    if (category === null) {
      router.push("/");
    } else {
      router.push(`/movies/category/${category}`);
    }
    setShowMoviesMenu(false);
    setSearchQuery("");
  };

  const handleUniversityClick = (uniName: string) => {
    router.push(`/movies/university/${encodeURIComponent(uniName)}`);
    setShowMoviesMenu(false);
    setSearchQuery("");
  };

  const handleSchoolClick = (schoolSearchKey: string | null) => {
    if (schoolSearchKey === null) {
      router.push("/movies/school");
    } else {
      router.push(`/movies/school/${encodeURIComponent(schoolSearchKey)}`);
    }
    setShowMoviesMenu(false);
    setSearchQuery("");
  };

  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMoviesMenu, setShowMoviesMenu] = useState(false);

  const moviesMenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        moviesMenuRef.current &&
        !moviesMenuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setShowMoviesMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.startsWith("/watch") || pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 transition-all duration-500 ease-out bg-zinc-950/50 backdrop-blur-md border-b border-white/5 shadow-2xl shadow-black/35 ${isScrolled ? "py-2.5" : "py-5"
        }`}
      style={{ fontFamily: "var(--font-sans), Arial, Helvetica, sans-serif" }}
    >
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-95 flex items-center flex-shrink-0"
        >
          <Image
            src="/logo.png"
            alt="GLORY"
            width={64}
            height={64}
            className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-sm"
            priority
          />
        </Link>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 whitespace-nowrap border ${pathname === "/" && !showMoviesMenu
              ? "bg-white/15 text-white border-white/20 font-semibold shadow-md"
              : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5"
              }`}
          >
            หน้าแรก
          </Link>

          <button
            onClick={() => {
              router.push("/movies/trending");
              setShowMoviesMenu(false);
              setSearchQuery("");
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 whitespace-nowrap border ${pathname === "/movies/trending"
              ? "bg-white/15 text-white border-white/20 font-semibold shadow-md"
              : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5"
              }`}
          >
            ใหม่และมาแรง
          </button>

          <button
            ref={buttonRef}
            onClick={() => setShowMoviesMenu(!showMoviesMenu)}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 whitespace-nowrap border ${showMoviesMenu ||
              pathname.startsWith("/movies/category") ||
              pathname.startsWith("/movies/university") ||
              pathname.startsWith("/movies/school")
              ? "bg-white/15 text-white border-white/20 font-semibold shadow-md"
              : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/5"
              }`}
          >
            หมวดหมู่
            <KeyboardArrowDownIcon
              className={`text-sm transition-transform duration-300 ${showMoviesMenu ? "rotate-180 text-brand" : "text-zinc-400"
                }`}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-5 flex-shrink-0">
        <div
          className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isSearchExpanded
            ? "w-40 md:w-64 glass-input border-white/10 scale-100 opacity-100"
            : "w-8 bg-transparent border-transparent"
            }`}
        >
          <button
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            className="text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <SearchIcon className="text-xl" />
          </button>
          {isSearchExpanded && (
            <>
              <input
                type="text"
                placeholder={currentPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  if (pathname !== "/") {
                    router.push("/");
                  }
                  setSearchQuery(e.target.value);
                }}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-zinc-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <CloseIcon className="text-sm" />
                </button>
              )}
            </>
          )}
        </div>

        {currentUser ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-black font-bold text-sm shadow-sm border border-brand/40">
                {currentUser.photoUrl ? (
                  <Image
                    src={currentUser.photoUrl}
                    alt={currentUser.name || currentUser.email || "U"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  (currentUser.name || currentUser.email || "U")
                    .charAt(0)
                    .toUpperCase()
                )}
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-4.5 w-48 bg-background border border-theme-border rounded-md p-2.5 shadow-2xl shadow-black/90 animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                  <p className="text-xs text-white font-semibold truncate">
                    {currentUser.name || currentUser.email}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {currentUser.email}
                  </p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full block text-left px-3 py-2 text-xs text-zinc-300 hover:text-brand hover:bg-brand/10 rounded-md cursor-pointer transition-colors mb-1"
                >
                  โปรไฟล์ของฉัน
                </Link>
                <Link
                  href="/create/movie"
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full block text-left px-3 py-2 text-xs text-zinc-300 hover:text-brand hover:bg-brand/10 rounded-md cursor-pointer transition-colors mb-1"
                >
                  เพิ่มภาพยนตร์
                </Link>
                <button
                  onClick={() => {
                    onSignOut();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md cursor-pointer transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        ) : (
          <Button onClick={onSignInClick} size="sm">
            เข้าสู่ระบบ
          </Button>
        )}
      </div>

      {showMoviesMenu && (
        <div
          ref={moviesMenuRef}
          className="absolute left-6 md:left-[170px] top-full mt-1.5 w-80 bg-background border border-theme-border rounded-md p-4 shadow-2xl shadow-black/90 animate-fade-in z-50"
        >
          <div className="flex border-b border-white/5 mb-3 pb-2 gap-1">
            <button
              onClick={() => setActiveTab("category")}
              className={`flex-1 text-center px-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${activeTab === "category"
                ? "bg-brand/15 text-brand border border-brand/25"
                : "text-zinc-400 hover:text-white border border-transparent"
                }`}
            >
              หมวดหมู่
            </button>
            <button
              onClick={() => setActiveTab("university")}
              className={`flex-1 text-center px-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${activeTab === "university"
                ? "bg-brand/15 text-brand border border-brand/25"
                : "text-zinc-400 hover:text-white border border-transparent"
                }`}
            >
              มหาวิทยาลัย
            </button>
            <button
              onClick={() => setActiveTab("school")}
              className={`flex-1 text-center px-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${activeTab === "school"
                ? "bg-brand/15 text-brand border border-brand/25"
                : "text-zinc-400 hover:text-white border border-transparent"
                }`}
            >
              โรงเรียน
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 text-center px-1 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${activeTab === "favorites"
                ? "bg-brand/15 text-brand border border-brand/25"
                : "text-zinc-400 hover:text-white border border-transparent"
                }`}
            >
              รายการของฉัน
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto pr-1 no-scrollbar space-y-1">
            {activeTab === "category" ? (
              <>
                <button
                  onClick={() => handleNavClick(null)}
                  className="w-full text-left px-3 py-2 text-xs rounded-md cursor-pointer transition-colors text-zinc-300 hover:bg-brand/10 hover:text-brand"
                >
                  หนังทั้งหมด
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleNavClick(cat.name)}
                    className="w-full text-left px-3 py-2 text-xs rounded-md cursor-pointer transition-colors text-zinc-300 hover:bg-brand/10 hover:text-brand"
                  >
                    {cat.labelTh || cat.name}
                  </button>
                ))}
              </>
            ) : activeTab === "university" ? (
              <>
                {universities.length === 0 ? (
                  <p className="text-center text-zinc-500 py-3 text-xs font-light">
                    ไม่มีข้อมูลมหาวิทยาลัย
                  </p>
                ) : (
                  universities.map((uni) => (
                    <button
                      key={uni.id}
                      onClick={() => handleUniversityClick(uni.name)}
                      className="w-full text-left px-3 py-2 text-xs rounded-md cursor-pointer transition-colors text-zinc-300 hover:bg-brand/10 hover:text-brand"
                    >
                      {uni.name}
                    </button>
                  ))
                )}
              </>
            ) : activeTab === "school" ? (
              <>
                <button
                  onClick={() => handleSchoolClick(null)}
                  className="w-full text-left px-3 py-2 text-xs rounded-md cursor-pointer transition-colors text-zinc-300 hover:bg-brand/10 hover:text-brand"
                >
                  โรงเรียนทั้งหมด
                </button>
                {MOCK_SCHOOLS.length === 0 ? (
                  <p className="text-center text-zinc-500 py-3 text-xs font-light">
                    ไม่มีข้อมูลโรงเรียน
                  </p>
                ) : (
                  MOCK_SCHOOLS.map((school) => (
                    <button
                      key={school.searchKey}
                      onClick={() => handleSchoolClick(school.searchKey)}
                      className="w-full text-left px-3 py-2 text-xs rounded-md cursor-pointer transition-colors text-zinc-300 hover:bg-brand/10 hover:text-brand"
                    >
                      {school.label}
                    </button>
                  ))
                )}
              </>
            ) : (
              <>
                {!currentUser ? (
                  <div className="text-center text-zinc-500 py-4 text-xs font-light">
                    <p className="mb-2">กรุณาเข้าสู่ระบบเพื่อดูรายการของคุณ</p>
                    <Button
                      onClick={onSignInClick}
                      size="sm"
                      className="h-7 text-[10px] px-3"
                    >
                      เข้าสู่ระบบ
                    </Button>
                  </div>
                ) : favorites.length === 0 ? (
                  <p className="text-center text-zinc-550 py-4 text-xs font-light">
                    ไม่มีรายการของฉันในขณะนี้
                  </p>
                ) : (
                  <>
                    <Link
                      href="/movies/favorites"
                      onClick={() => setShowMoviesMenu(false)}
                      className="w-full block text-center py-2 mb-1.5 text-xs text-brand font-semibold hover:underline bg-brand/5 rounded-md"
                    >
                      ดูรายการทั้งหมด ({favorites.length})
                    </Link>
                    {favorites.map((fav) => (
                      <Link
                        key={fav.id}
                        href={`/movies/${fav.id}`}
                        onClick={() => setShowMoviesMenu(false)}
                        className="w-full block text-left px-3 py-2 text-xs rounded-md cursor-pointer transition-colors text-zinc-300 hover:bg-brand/10 hover:text-brand truncate"
                      >
                        {fav.title}
                      </Link>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

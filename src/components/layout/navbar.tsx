"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@/components/ui/button";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";
import { useAppStore } from "@/store/use-store";
import { useCategoriesQuery, useUniversitiesQuery } from "@/hooks/db/use-master-data";
import { useLogoutMutation } from "@/hooks/db/use-auth";
import { useSearchPlaceholder } from "@/hooks/system/use-search-placeholder";

export default function Navbar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, currentUser } = useAppStore();
  const currentPlaceholder = useSearchPlaceholder(30000);

  const { data: categories = [] } = useCategoriesQuery();
  const { data: universities = [] } = useUniversitiesQuery();
  const logoutMutation = useLogoutMutation();

  const [activeTab, setActiveTab] = useState<"category" | "university">("category");

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

  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMoviesMenu, setShowMoviesMenu] = useState(false);

  const moviesMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (moviesMenuRef.current && !moviesMenuRef.current.contains(target)) {
        setShowMoviesMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname.startsWith("/watch")) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-16 py-4 transition-all duration-500 ease-out ${
        isScrolled
          ? "glass-nav shadow-2xl shadow-black/35 py-3.5 border-b border-[#e5b842]/10"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ fontFamily: "var(--font-sans), Arial, Helvetica, sans-serif" }}
    >
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-2xl md:text-3xl font-bold tracking-[0.25em] font-serif text-luxury-gold cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-95"
        >
          GLORY
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          <Link
            href="/"
            className={`cursor-pointer text-xs uppercase tracking-wider font-semibold text-zinc-300 hover:text-brand nav-link-premium ${
              pathname === "/" ? "active text-brand" : ""
            }`}
          >
            หน้าแรก
          </Link>

          <div className="relative" ref={moviesMenuRef}>
            <button
              onClick={() => setShowMoviesMenu(!showMoviesMenu)}
              className={`flex items-center gap-1.5 cursor-pointer text-xs uppercase tracking-wider font-semibold hover:text-brand focus:outline-none nav-link-premium ${
                pathname.startsWith("/movies/category") ||
                pathname.startsWith("/movies/university")
                  ? "active text-brand"
                  : "text-zinc-300"
              }`}
            >
              ภาพยนตร์
              <div
                className={`w-0 h-0 border-l-3 border-r-3 border-t-3 border-t-zinc-400 border-l-transparent border-r-transparent transition-transform duration-300 ${
                  showMoviesMenu ? "rotate-180 border-t-brand" : ""
                }`}
              />
            </button>

            {showMoviesMenu && (
              <div className="absolute left-0 mt-4.5 w-64 bg-[#121110] border border-[#e5b842]/30 rounded-md p-4 shadow-2xl shadow-black/90 animate-fade-in z-50">
                <div className="flex border-b border-white/5 mb-3 pb-2 gap-2">
                  <button
                    onClick={() => setActiveTab("category")}
                    className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeTab === "category"
                        ? "bg-brand/15 text-brand border border-brand/25"
                        : "text-zinc-450 hover:text-white border border-transparent"
                    }`}
                  >
                    หมวดหมู่
                  </button>
                  <button
                    onClick={() => setActiveTab("university")}
                    className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      activeTab === "university"
                        ? "bg-brand/15 text-brand border border-brand/25"
                        : "text-zinc-450 hover:text-white border border-transparent"
                    }`}
                  >
                    มหาวิทยาลัย
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
                          {CATEGORY_TITLE_MAPPING[cat.name] || cat.name}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {universities.length === 0 ? (
                        <p className="text-center text-zinc-550 py-3 text-xs font-light">
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
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/movies/favorites"
            className={`cursor-pointer text-xs uppercase tracking-wider font-semibold text-zinc-300 hover:text-brand nav-link-premium ${
              pathname === "/movies/favorites" ? "active text-brand" : ""
            }`}
          >
            รายการของฉัน
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div
          className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isSearchExpanded
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
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-black font-bold text-sm shadow-md shadow-brand/20 border border-brand/40">
                {(currentUser.name || currentUser.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-zinc-400 border-l-transparent border-r-transparent group-hover:border-t-white transition-colors" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-4.5 w-48 bg-[#121110] border border-[#e5b842]/30 rounded-md p-2.5 shadow-2xl shadow-black/90 animate-fade-in z-50">
                <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                  <p className="text-xs text-white font-semibold truncate">
                    {currentUser.name || currentUser.email}
                  </p>
                  <p className="text-[10px] text-zinc-455 truncate mt-0.5">
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
    </nav>
  );
}

import React from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Movie } from "@/core/domain/movie";
import { CATEGORY_TITLE_MAPPING } from "@/core/constants/categories";

import { Button } from "@/components/ui/button";

interface MovieTableProps {
  movies: Movie[];
  onEdit?: (movie: Movie) => void;
  onDelete?: (id: string) => void;
}

export const MovieTable: React.FC<MovieTableProps> = ({
  movies,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800/40 text-xs font-bold text-zinc-400 uppercase bg-zinc-950/20">
            <th className="py-4 px-6">ภาพยนตร์</th>
            <th className="py-4 px-6">หมวดหมู่</th>
            <th className="py-4 px-6">ปีที่ฉาย / เรตติ้ง</th>
            <th className="py-4 px-6">ความยาว</th>
            <th className="py-4 px-6">สถิติการเข้าชม</th>
            <th className="py-4 px-6 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/30 text-sm">
          {movies.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-16 text-center text-zinc-500 font-light"
              >
                ไม่พบภาพยนตร์ที่ตรงตามตัวกรอง
              </td>
            </tr>
          ) : (
            movies.map((movie) => (
              <tr
                key={movie.id}
                className="group/row hover:bg-zinc-900/10 transition-colors"
              >
                <td className="py-4 px-6 flex items-center gap-4">
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-zinc-800/50 shadow-md flex-shrink-0">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover/row:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-white group-hover/row:text-brand transition-colors">
                      {movie.title}
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-[240px] truncate font-light">
                      {movie.description}
                    </p>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand/10 text-brand border border-brand/20">
                    {movie.category ? (CATEGORY_TITLE_MAPPING[movie.category.name] || movie.category.name) : ""}
                  </span>
                </td>

                <td className="py-4 px-6 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
                    <CalendarTodayIcon className="text-[10px] text-zinc-500" />
                    {movie.year}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1 py-0.5 text-[9px] font-bold border border-zinc-700 text-zinc-400 rounded leading-none">
                      {movie.ageRating?.name}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      {movie.matchRate}% ตรงกัน
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-zinc-300 font-medium">
                  <div className="flex items-center gap-1">
                    <AccessTimeIcon className="text-xs text-zinc-500" />
                    {movie.duration}
                  </div>
                </td>

                <td className="py-4 px-6 space-y-1">
                  <div className="text-xs text-zinc-300 flex items-center gap-1">
                    <VisibilityIcon className="text-xs text-zinc-500" />
                    {(movie.views || 0).toLocaleString()} ครั้ง
                  </div>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <StarIcon className="text-[10px] text-zinc-500" />
                    {movie.ratings?.length || 0} รีวิว
                  </div>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(movie)}
                        className="p-2 hover:bg-brand/20 text-zinc-400 hover:text-brand border-zinc-800 hover:border-brand/30 h-auto rounded-lg"
                      >
                        <EditIcon className="text-sm" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onDelete(movie.id)}
                        className="p-2 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border-zinc-800 hover:border-red-500/30 h-auto rounded-lg"
                      >
                        <DeleteIcon className="text-sm" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

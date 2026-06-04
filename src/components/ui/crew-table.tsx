import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { CrewMember, Movie } from "@/core/domain/movie";
import { LOCALIZATION } from "@/core/constants/localization";

import { Button } from "./button";

interface CrewTableProps {
  crew: CrewMember[];
  movies: Movie[];
  onEdit: (member: CrewMember) => void;
  onDelete: (id: string) => void;
}

export const CrewTable: React.FC<CrewTableProps> = ({
  crew,
  movies,
  onEdit,
  onDelete,
}) => {
  console.log(crew);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800/40 text-xs font-bold text-zinc-400 uppercase bg-zinc-950/20">
            <th className="py-4 px-6">ชื่อ-นามสกุล</th>
            <th className="py-4 px-6">สถานะผลงาน</th>
            <th className="py-4 px-6">วันที่บันทึก</th>
            <th className="py-4 px-6 text-right">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/30 text-sm">
          {crew.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="py-16 text-center text-zinc-500 font-light"
              >
                ไม่พบรายชื่อทีมงานที่ระบุ
              </td>
            </tr>
          ) : (
            crew.map((member) => {
              const movieCount = movies.filter((m) =>
                m.crew?.some((c) => c.crewMember?.id === member.id),
              ).length;

              return (
                <tr
                  key={member.id}
                  className="group/row hover:bg-zinc-900/10 transition-colors"
                >
                  <td className="py-4 px-6 flex items-center gap-4">
                    {member?.user?.photoUrl ? (
                      <img
                        src={member.user.photoUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-800 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand flex-shrink-0">
                        <PersonIcon className="text-lg" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white group-hover/row:text-brand transition-colors flex items-center gap-1.5">
                        {member.name}
                        {member.userId && (
                          <span
                            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                            title="ผู้ใช้ในระบบ (Linked Account)"
                          />
                        )}
                      </h4>
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        {member.email && (
                          <p className="text-[10px] text-zinc-400 font-medium">
                            {member.email}
                          </p>
                        )}
                        <p className="text-[9px] text-zinc-500 font-mono">
                          ID: {member.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        movieCount > 0
                          ? "bg-brand/10 text-brand border border-brand/20"
                          : "bg-zinc-800/60 text-zinc-400 border border-zinc-800"
                      }`}
                    >
                      {LOCALIZATION.COMMON.CONTRIBUTION(movieCount)}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-zinc-400 font-light">
                    {new Date(member.createdAt).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(member)}
                        className="p-2 hover:bg-brand/20 text-zinc-400 hover:text-brand border-zinc-800 hover:border-brand/30 h-auto rounded-lg"
                      >
                        <EditIcon className="text-sm" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onDelete(member.id)}
                        className="p-2 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border-zinc-800 hover:border-red-500/30 h-auto rounded-lg"
                      >
                        <DeleteIcon className="text-sm" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

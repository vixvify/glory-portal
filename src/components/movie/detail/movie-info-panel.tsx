import { Movie } from "@/core/domain/movie";

interface Props {
  movie: Movie;
}

interface InfoRowProps {
  label: string;
  value: string;
  withBorder?: boolean;
}

function InfoRow({ label, value, withBorder = false }: InfoRowProps) {
  return (
    <div
      className={`flex justify-between items-start gap-4 ${
        withBorder ? "pt-3 border-t border-zinc-900/40" : ""
      }`}
    >
      <span className="text-zinc-550 font-light whitespace-nowrap">
        {label}
      </span>
      <span className="text-zinc-200 font-medium text-right max-w-40">
        {value}
      </span>
    </div>
  );
}

export default function MovieInfoPanel({ movie }: Props) {
  const rows = [
    movie.university && {
      label: "มหาวิทยาลัย / สถาบัน",
      value: movie.university,
    },
    movie.school && { label: "โรงเรียน", value: movie.school },
    movie.studio && { label: "ค่าย / สังกัด", value: movie.studio },
    movie.language && { label: "ภาษา", value: movie.language },
    movie.aspectRatio && {
      label: "อัตราส่วนภาพ",
      value:
        movie.aspectRatio === "landscape"
          ? "แนวนอน"
          : movie.aspectRatio === "portrait"
            ? "แนวตั้ง"
            : movie.aspectRatio,
    },
    movie.colorType && {
      label: "โทนสี",
      value:
        movie.colorType === "color"
          ? "ภาพสี"
          : movie.colorType === "black_and_white"
            ? "ขาวดำ"
            : movie.colorType === "color_and_bw"
              ? "ภาพสีและขาวดำ"
              : movie.colorType,
    },
    movie.awards &&
      movie.awards.length > 0 && {
        label: "รางวัลที่ได้รับ",
        value: movie.awards.filter(Boolean).join(", "),
      },
  ].filter(Boolean) as { label: string; value: string }[];

  if (rows.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl glass-panel space-y-4 shadow-xl text-xs">
      <h5 className="text-xs font-bold text-white uppercase tracking-widest text-left border-b border-zinc-800/60 pb-3 flex items-center justify-between">
        <span>ข้อมูลภาพยนตร์</span>
        <span className="w-1.5 h-1.5 bg-brand rounded-full" />
      </h5>
      <div className="space-y-3.5">
        {rows.map((row, idx) => (
          <InfoRow
            key={row.label}
            label={row.label}
            value={row.value}
            withBorder={idx > 0}
          />
        ))}
      </div>
    </div>
  );
}

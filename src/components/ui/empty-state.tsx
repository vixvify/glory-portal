import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function EmptyState({
  title = "ยังไม่มีรายการ",
  description = "ขณะนี้ยังไม่มีข้อมูลในส่วนนี้ ลองกลับมาดูใหม่อีกครั้งภายหลัง",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-950/30 px-6 py-8 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-brand">
        <InboxOutlinedIcon aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-zinc-200">{title}</p>
        <p className="max-w-md text-sm font-light leading-relaxed text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
}

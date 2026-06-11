import { getYouTubeId } from "@/utils/youtube";

interface Props {
  btsVideos: string[];
}

export default function MovieBtsSection({ btsVideos }: Props) {
  const validVideos = btsVideos.filter(Boolean);

  if (validVideos.length === 0) return null;

  return (
    <div className="space-y-5 pt-6 border-t border-zinc-800/60">
      <h4 className="text-base font-bold text-white tracking-wide uppercase">
        วิดีโอเบื้องหลังการถ่ายทำ
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {validVideos.map((videoUrl, idx) => {
          const ytid = getYouTubeId(videoUrl);
          if (!ytid) return null;

          return (
            <div key={idx} className="space-y-2.5">
              <p className="font-bold text-sm text-zinc-350">
                วิดีโอเบื้องหลัง #{idx + 1}
              </p>
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/50 aspect-[16/9] w-full shadow-lg shadow-black/50 transition-all hover:border-brand/30">
                <iframe
                  src={`https://www.youtube.com/embed/${ytid}`}
                  title={`วิดีโอเบื้องหลัง #${idx + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { CrewForm } from "../../crew-form";
import { useCrewMemberQueryById } from "@/hooks/use-crew-members";

export default function EditCrewPage() {
  const params = useParams<{ id: string }>();
  const { data: crew, isLoading } = useCrewMemberQueryById(params.id);

  if (isLoading) {
    return <Loading />;
  }

  if (!crew) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 font-light">
          ไม่พบข้อมูลทีมงานหรือนักแสดงที่ต้องการแก้ไข
        </p>
      </div>
    );
  }

  return <CrewForm editingCrew={crew} />;
}

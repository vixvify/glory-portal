import React from "react";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { MovieFormInputs } from "@/core/domain/movie";
import { Input } from "@/components/ui/input";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";

export interface AwardProjectSectionProps {
  control: Control<MovieFormInputs>;
  pIndex: number;
  removeProject: () => void;
  register: UseFormRegister<MovieFormInputs>;
}

export function AwardProjectSection({ control, pIndex, removeProject, register }: AwardProjectSectionProps) {
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: `awards.${pIndex}.awardList`,
  });

  return (
    <div className="bg-white/5 backdrop-blur-md border border-[#757575] shadow-lg rounded-xl p-5 relative">
      {pIndex > 0 && (
        <button
          type="button"
          onClick={removeProject}
          className="absolute top-4 right-4 text-zinc-500 hover:text-red-500"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-100 block mb-2">ชื่อโครงการ</label>
          <Input
            type="text"
            {...register(`awards.${pIndex}.projectName` as const)}
            className="!bg-white/5 backdrop-blur-md border !border-white/20 text-white placeholder:text-zinc-400 shadow-inner"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-zinc-100 block mb-2">ชื่อรายการ</label>
          <div className="space-y-2">
            {itemFields.map((item, iIndex) => (
              <div key={item.id} className="relative group">
                <Input
                  type="text"
                  {...register(`awards.${pIndex}.awardList.${iIndex}.value` as const)}
                  className="!bg-white/5 backdrop-blur-md border !border-white/20 text-white placeholder:text-zinc-400 pr-10 shadow-inner"
                />
                {iIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => removeItem(iIndex)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all"
                  >
                    <DeleteOutlineIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => appendItem({ value: "" })}
          className="py-2 px-4 bg-[#333333] hover:bg-zinc-700 text-sm font-medium rounded-md text-white text-center transition-colors w-fit"
        >
          + เพิ่มรายการ
        </button>
      </div>
    </div>
  );
}

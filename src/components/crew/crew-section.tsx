import { Button } from "../ui/button";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import { CreatableSearchSelect } from "../ui/search-select";
import { Input } from "../ui/input";
import { CrewOption } from "@/core/domain/crew";

interface CrewSectionProps {
  label: string;
  fields: Array<{
    index: number;
    id: string;
    crewMemberId?: string | null;
    name?: string | null;
    email?: string | null;
  }>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (
    index: number,
    val: { id: string | null; name: string; email: string },
  ) => void;
  placeholder: string;
  addButtonLabel: string;
  crewOptions: CrewOption[];
}

export const CrewSection: React.FC<CrewSectionProps> = ({
  label,
  fields,
  onAdd,
  onRemove,
  onUpdate,
  placeholder,
  addButtonLabel,
  crewOptions,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-zinc-300">{label}</label>
      <div className="space-y-4">
        {fields.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 items-center p-3 bg-zinc-900/10 border border-zinc-900 rounded-2xl"
          >
            <div className="flex-1 space-y-2">
              <CreatableSearchSelect
                value={{
                  id: item.crewMemberId || "",
                  name: item.name || "",
                  email: item.email || "",
                }}
                options={crewOptions}
                placeholder={placeholder}
                onChange={(val) => {
                  onUpdate(item.index, {
                    id: val.id,
                    name: val.name,
                    email: val.email || "",
                  });
                }}
                className="w-full"
              />
              <Input
                type="email"
                placeholder="กรอกอีเมล"
                value={item.email || ""}
                readOnly={!!item.crewMemberId}
                onChange={(e) => {
                  onUpdate(item.index, {
                    id: item.crewMemberId || null,
                    name: item.name || "",
                    email: e.target.value,
                  });
                }}
                className="read-only:opacity-60 read-only:cursor-not-allowed"
                icon={<EmailIcon className="text-sm" />}
              />
            </div>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => onRemove(item.index)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-all flex-shrink-0 h-auto self-center"
              >
                <CloseIcon className="text-sm" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={onAdd}
          className="py-2 px-4 text-xs flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
        >
          <AddIcon className="text-sm" /> {addButtonLabel}
        </Button>
      </div>
    </div>
  );
};

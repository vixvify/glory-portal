import { Button } from "../ui/button";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import { CreatableSearchSelect } from "../ui/search-select";
import { Input } from "../ui/input";
import { CrewStateItem, CrewOption } from "@/core/domain/crew";

interface CrewSectionProps {
  label: string;
  list: CrewStateItem[];
  setList: (list: CrewStateItem[]) => void;
  placeholder: string;
  addButtonLabel: string;
  crewOptions: CrewOption[];
}

export const CrewSection: React.FC<CrewSectionProps> = ({
  label,
  list,
  setList,
  placeholder,
  addButtonLabel,
  crewOptions,
}) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-zinc-300">{label}</label>
      <div className="space-y-4">
        {list.map((item, idx) => (
          <div
            key={`${item.id || "new"}-${idx}`}
            className="flex gap-3 items-center p-3 bg-zinc-900/10 border border-zinc-900 rounded-2xl"
          >
            <div className="flex-1 space-y-2">
              <CreatableSearchSelect
                value={{ id: item.id, name: item.name, email: item.email }}
                options={crewOptions}
                placeholder={placeholder}
                onChange={(val) => {
                  const newList = [...list];
                  newList[idx] = {
                    id: val.id,
                    name: val.name,
                    email: val.email || "",
                  };
                  setList(newList);
                }}
                className="w-full"
              />
              <Input
                type="email"
                placeholder="กรอกอีเมล"
                value={item.email}
                readOnly={!!item.id}
                onChange={(e) => {
                  const newList = [...list];
                  newList[idx] = { ...newList[idx], email: e.target.value };
                  setList(newList);
                }}
                className="read-only:opacity-60 read-only:cursor-not-allowed"
                icon={<EmailIcon className="text-sm" />}
              />
            </div>
            {list.length > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setList(list.filter((_, i) => i !== idx))}
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
          onClick={() => setList([...list, { id: "", name: "", email: "" }])}
          className="py-2 px-4 text-xs flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 font-semibold rounded-xl"
        >
          <AddIcon className="text-sm" /> {addButtonLabel}
        </Button>
      </div>
    </div>
  );
};

import { Button } from "../ui/button";
import CloseIcon from "@mui/icons-material/Close";
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
    <div className="border border-theme-border rounded-[16px] py-5 px-6 bg-card-secondary space-y-4 overflow-visible">
      <h3 className="text-white font-semibold text-[15px] tracking-wide">{label}</h3>
      {fields.map((item, index) => (
        <div key={`crew-${item.index}`} className="group space-y-3 pt-4 mt-4 first:pt-0 first:mt-0">
          <div className="relative">
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
              className="w-full [&_svg]:text-brand [&_svg]:!text-[22px] [&_input]:!bg-background [&_input]:!rounded-[12px] [&_input]:border [&_input]:!border-white/10 [&_input]:!h-[52px] [&_input]:!pl-[48px] [&_input]:!pr-4 [&_input]:!text-[14px] [&_input]:!text-white [&_input]:placeholder:text-zinc-500"
            />
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onRemove(item.index)}
                aria-label={`Remove crew member ${index + 1}`}
                title="ลบตำแหน่งนี้"
                className="absolute -right-3 -top-3 !w-[40px] !h-[40px] flex items-center justify-center p-0 bg-transparent text-zinc-500 hover:!bg-red-500 hover:!text-white rounded-full transition-all duration-200 ease-out opacity-0 pointer-events-none scale-95 group-hover:opacity-60 group-hover:pointer-events-auto group-hover:scale-100 hover:!opacity-100 hover:!scale-105 focus-visible:opacity-100 focus-visible:pointer-events-auto focus-visible:scale-100 z-10 flex-shrink-0"
              >
                <CloseIcon className="!text-[26px]" />
              </Button>
            )}
          </div>
          <Input
            type="email"
            placeholder="example@gmail.com"
            value={item.email || ""}
            readOnly={!!item.crewMemberId}
            onChange={(e) => {
              onUpdate(item.index, {
                id: item.crewMemberId || null,
                name: item.name || "",
                email: e.target.value,
              });
            }}
            className="read-only:opacity-60 read-only:cursor-not-allowed !bg-background !rounded-[12px] border !border-white/10 text-white placeholder:text-zinc-500 !h-[52px] !pl-[48px] !pr-4 !text-[14px]"
            icon={<EmailIcon className="text-brand text-[22px]" />}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="py-2 px-4 bg-card-secondary hover:bg-card-hover border border-theme-border text-sm font-medium rounded-md text-white text-center transition-colors w-fit cursor-pointer"
      >
        + {addButtonLabel}
      </button>
    </div>
  );
};
import { Button } from "@/components/ui/button";

interface PredictiveCTABarProps {
  ctas: string[];
  onSelect: (cta: string) => void;
  visible?: boolean;
}

const PredictiveCTABar = ({ ctas, onSelect, visible = true }: PredictiveCTABarProps) => {
  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {ctas.map((cta, index) => (
        <Button
          key={cta}
          variant="outline"
          onClick={() => onSelect(cta)}
          className="bg-white text-base font-normal rounded-xl animate-cta-fade-in opacity-0 [animation-fill-mode:forwards] hover:bg-purple-50 py-2 px-3 h-auto border-[#5920C5] text-[#5920C5] hover:text-[#5920C5] hover:border-[#5920C5]"
          style={{ animationDelay: `${index * 50}ms`, borderColor: "#5920C5" }}
        >
          {cta}
        </Button>
      ))}
    </div>
  );
};

export default PredictiveCTABar;

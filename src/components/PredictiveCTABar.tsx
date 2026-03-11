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
          size="sm"
          onClick={() => onSelect(cta)}
          className="bg-white text-purple-600 text-base shadow-[inset_0_0_0_1.5px_hsl(var(--purple-400))] hover:bg-purple-50 hover:shadow-[inset_0_0_0_1.5px_hsl(var(--purple-500))] hover:text-purple-700 rounded-xl animate-cta-fade-in opacity-0 [animation-fill-mode:forwards]"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {cta}
        </Button>
      ))}
    </div>
  );
};

export default PredictiveCTABar;

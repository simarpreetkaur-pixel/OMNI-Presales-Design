import { type LucideIcon } from "lucide-react";

export interface QuickAction {
  label: string;
  icon: LucideIcon;
}

interface QuickActionsDrawerProps {
  actions: QuickAction[];
  filterText: string;
  onSelect: (label: string) => void;
  visible: boolean;
}

const QuickActionsDrawer = ({
  actions,
  filterText,
  onSelect,
  visible,
}: QuickActionsDrawerProps) => {
  if (!visible) return null;

  const filtered = filterText.trim()
    ? actions.filter((a) =>
        a.label.toLowerCase().includes(filterText.toLowerCase())
      )
    : actions;

  if (filtered.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <div className="bg-card border border-border rounded-xl shadow-lg p-4">
        <p className="font-bold text-foreground text-sm mb-1">Quick Actions</p>
        <div className="space-y-0.5">
          {filtered.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(action.label);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted cursor-pointer transition-colors text-left"
              >
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsDrawer;

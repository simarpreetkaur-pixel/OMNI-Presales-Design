import { LayoutGrid } from "lucide-react";

interface OzontelPanelProps {
  customer: "rajesh" | "rajesh2" | "pooja";
  onEndCall: () => void;
}

const customerData = {
  rajesh: { name: "Rajesh Kumar", phone: "+91 98200 25524", initials: "RK" },
  rajesh2: { name: "Rajesh Kumar", phone: "+91 98200 25524", initials: "RK" },
  pooja: { name: "Pooja Arora", phone: "+91 99100 48231", initials: "PA" },
};

const OzontelPanel = ({ customer, onEndCall }: OzontelPanelProps) => {
  const data = customerData[customer];

  return (
    <div
      className="fixed bottom-24 left-6 z-50 w-[280px] bg-white rounded-2xl shadow-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-foreground">Ozontel</span>
        <LayoutGrid className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Customer info card */}
      <div className="mx-4 my-4 rounded-xl border border-border p-5 flex flex-col items-center gap-3">
        {/* Avatar */}
        <div
          className="h-16 w-16 rounded-full flex items-center justify-center text-white text-lg font-semibold"
          style={{ backgroundColor: "#E07A72" }}
        >
          {data.initials}
        </div>

        {/* Name + phone */}
        <div className="text-center">
          <p className="text-base font-bold text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{data.phone}</p>
        </div>

        {/* Spacer */}
        <div className="h-8" />

        {/* End Call button */}
        <button
          onClick={onEndCall}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C0504D" }}
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default OzontelPanel;

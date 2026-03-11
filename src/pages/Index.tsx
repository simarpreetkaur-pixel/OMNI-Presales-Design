import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Phone, PhoneOutgoing, PhoneIncoming } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import bgGradient from "@/assets/bg-gradient.png";
import ackoFabIcon from "@/assets/acko-fab-icon.png";
import OutgoingCallModal from "@/components/OutgoingCallModal";
import IncomingCallModal from "@/components/IncomingCallModal";
import OutgoingCallModal2 from "@/components/OutgoingCallModal2";
import OutgoingCallModal3 from "@/components/OutgoingCallModal3";
import IncomingCallModal2 from "@/components/IncomingCallModal2";

const Index = () => {
  const location = useLocation();
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [showOutgoingCall, setShowOutgoingCall] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [showOutgoingCall2, setShowOutgoingCall2] = useState(false);
  const [showOutgoingCall3, setShowOutgoingCall3] = useState(false);
  const [showIncomingCall2, setShowIncomingCall2] = useState(false);
  const [showCallbackConfirm, setShowCallbackConfirm] = useState(false);

  useEffect(() => {
    const state = location.state as { openOutgoingCall?: boolean; confirmCallback?: boolean } | null;
    if (state?.openOutgoingCall) {
      setShowOutgoingCall2(true);
      window.history.replaceState({}, "");
    }
    if (state?.confirmCallback) {
      setShowCallbackConfirm(true);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0 py-3">
        <div className="flex items-center gap-3">
          <img
            src="https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20primary%20Light%20BG.svg"
            alt="ACKO"
            className="h-8"
          />
          <div className="h-5 w-px bg-border" />
          <span className="text-foreground tracking-tight text-lg font-medium">
            OMNI Pre-sales
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setShowOutgoingCall(true)}
            title="Outgoing call"
          >
            <PhoneOutgoing className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setShowIncomingCall(true)}
            title="Incoming call"
          >
            <PhoneIncoming className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="flex-1 relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgGradient})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center max-w-2xl px-6">
          <div className="mb-4" style={{ fontSize: "76.8px" }}>
            👋
          </div>
          <h1 className="font-semibold text-foreground tracking-tight text-[2.5rem] leading-tight whitespace-nowrap">
            Hello, Welcome to <span className="text-primary">OMNI Pre-sales</span>
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            An AI-powered, context-driven CRM that equips agents with real-time insights
            and guided actions to drive smarter, faster conversions.
          </p>
        </div>

        {/* ACKO FAB - Bottom Left */}
        <Button variant="ghost" size="icon" className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-0">
          <img src={ackoFabIcon} alt="ACKO Assistant" className="h-full w-full rounded-2xl" />
        </Button>

        {/* Simulate Call FAB - Bottom Right */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
          {showCallOptions && (
            <>
              <Button
                variant="outline"
                className="rounded-2xl shadow-lg px-5 py-3 h-auto gap-3 min-w-[220px]"
                onClick={() => {
                  setShowOutgoingCall2(true);
                  setShowCallOptions(false);
                }}
              >
                <PhoneOutgoing className="h-5 w-5 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">Rajesh Kumar</p>
                  <p className="text-xs text-muted-foreground font-normal">Outgoing call</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl shadow-lg px-5 py-3 h-auto gap-3 min-w-[220px]"
                onClick={() => {
                  setShowOutgoingCall3(true);
                  setShowCallOptions(false);
                }}
              >
                <PhoneOutgoing className="h-5 w-5 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">Rajesh Kumar 2</p>
                  <p className="text-xs text-muted-foreground font-normal">Outgoing call</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl shadow-lg px-5 py-3 h-auto gap-3 min-w-[220px]"
                onClick={() => {
                  setShowIncomingCall2(true);
                  setShowCallOptions(false);
                }}
              >
                <PhoneIncoming className="h-5 w-5 shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">Pooja Arora</p>
                  <p className="text-xs text-muted-foreground font-normal">Incoming call</p>
                </div>
              </Button>
            </>
          )}
          <Button
            size="default"
            className="rounded-full shadow-lg px-5 gap-2"
            onClick={() => setShowCallOptions((prev) => !prev)}
          >
            <Phone className="h-4 w-4" />
            Simulate live call
          </Button>
        </div>
      </main>

      <OutgoingCallModal open={showOutgoingCall} onOpenChange={setShowOutgoingCall} />
      <IncomingCallModal open={showIncomingCall} onOpenChange={setShowIncomingCall} />
      <OutgoingCallModal2 open={showOutgoingCall2} onOpenChange={setShowOutgoingCall2} />
      <OutgoingCallModal3 open={showOutgoingCall3} onOpenChange={setShowOutgoingCall3} />
      <IncomingCallModal2 open={showIncomingCall2} onOpenChange={setShowIncomingCall2} />

      <Dialog open={showCallbackConfirm} onOpenChange={setShowCallbackConfirm}>
        <DialogContent className="sm:max-w-[360px] p-6 gap-5 rounded-[20px] border-border shadow-xl">
          <DialogTitle className="text-base font-semibold text-foreground">
            Are you sure you want to call back?
          </DialogTitle>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setShowCallbackConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-xl"
              onClick={() => {
                setShowCallbackConfirm(false);
                setShowOutgoingCall2(true);
              }}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

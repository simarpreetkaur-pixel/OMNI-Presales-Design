import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Phone, PhoneOutgoing, PhoneIncoming } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import bgGradient from "@/assets/bg-gradient.png";
import ackoFabIcon from "@/assets/acko-fab-icon.png";
import callbackIllustration from "@/assets/callback-illustration.png";
import OutgoingCallModal2 from "@/components/OutgoingCallModal2";
import OutgoingCallModal3 from "@/components/OutgoingCallModal3";
import IncomingCallModal2 from "@/components/IncomingCallModal2";
import AppHeader from "@/components/AppHeader";

const Index = () => {
  const location = useLocation();
  const [showCallOptions, setShowCallOptions] = useState(false);
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
      <AppHeader />

      {/* Main Content Area */}
      <main
        className="flex-1 relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${bgGradient})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="mb-6 text-[4.5rem] leading-none" aria-hidden>
            👋
          </div>
          <h1 className="text-[32px] font-semibold leading-[1.2] tracking-tight text-onyx-800 sm:text-[40px]">
            Hello, Welcome to{" "}
            <span className="text-primary">OMNI Pre-sales</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base font-normal leading-relaxed text-onyx-500">
            An AI-powered, context-driven CRM that equips agents with real-time insights and
            guided actions to drive smarter, faster conversions.
          </p>
        </div>

        {/* ACKO FAB - Bottom Left */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-2xl p-0 shadow-lg transition-shadow hover:shadow-xl"
        >
          <img src={ackoFabIcon} alt="ACKO Assistant" className="h-full w-full rounded-2xl" />
        </Button>

        {/* Simulate Call FAB - Bottom Right */}
        <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3">
          {showCallOptions && (
            <>
              <Button
                variant="outline"
                className="min-w-[220px] gap-3 rounded-2xl border-onyx-300 bg-card px-5 py-3 h-auto shadow-lg hover:border-purple-600/40 hover:bg-card"
                onClick={() => {
                  setShowOutgoingCall2(true);
                  setShowCallOptions(false);
                }}
              >
                <PhoneOutgoing className="h-5 w-5 shrink-0 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight text-onyx-800">Rajesh Kumar</p>
                  <p className="text-xs font-normal text-onyx-500">Outgoing call</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="min-w-[220px] gap-3 rounded-2xl border-onyx-300 bg-card px-5 py-3 h-auto shadow-lg hover:border-purple-600/40 hover:bg-card"
                onClick={() => {
                  setShowOutgoingCall3(true);
                  setShowCallOptions(false);
                }}
              >
                <PhoneOutgoing className="h-5 w-5 shrink-0 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight text-onyx-800">Rajesh Kumar 2</p>
                  <p className="text-xs font-normal text-onyx-500">Outgoing call</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="min-w-[220px] gap-3 rounded-2xl border-onyx-300 bg-card px-5 py-3 h-auto shadow-lg hover:border-purple-600/40 hover:bg-card"
                onClick={() => {
                  setShowIncomingCall2(true);
                  setShowCallOptions(false);
                }}
              >
                <PhoneIncoming className="h-5 w-5 shrink-0 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight text-onyx-800">Pooja Arora</p>
                  <p className="text-xs font-normal text-onyx-500">Incoming call</p>
                </div>
              </Button>
            </>
          )}
          <Button
            size="default"
            className="gap-2 rounded-full px-6 shadow-lg"
            onClick={() => setShowCallOptions((prev) => !prev)}
          >
            <Phone className="h-4 w-4" />
            Simulate live call
          </Button>
        </div>
      </main>

      <OutgoingCallModal2 open={showOutgoingCall2} onOpenChange={setShowOutgoingCall2} />
      <OutgoingCallModal3 open={showOutgoingCall3} onOpenChange={setShowOutgoingCall3} />
      <IncomingCallModal2 open={showIncomingCall2} onOpenChange={setShowIncomingCall2} />

      <Dialog open={showCallbackConfirm} onOpenChange={setShowCallbackConfirm}>
        <DialogContent className="gap-0 rounded-[24px] border-onyx-300 p-8 text-center shadow-xl sm:max-w-[380px]">
          <DialogTitle className="sr-only">Call back confirmation</DialogTitle>
          <img src={callbackIllustration} alt="" className="mx-auto mb-6 h-24 w-24" />
          <p className="mb-2 text-xl font-semibold leading-snug text-onyx-800">
            Are you sure you want to call back?
          </p>
          <p className="mb-8 text-sm leading-relaxed text-onyx-500">
            Use this only if the previous call ended unexpectedly.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-primary text-primary hover:text-primary hover:border-primary"
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

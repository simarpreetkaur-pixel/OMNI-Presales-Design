import { PhoneOff, TimerReset } from "lucide-react";

type PostCallActionRibbonProps = {
  secondsRemaining: number;
  onCallBack: () => void;
  onReadyForNextCall: () => void;
};

const PostCallActionRibbon = ({
  secondsRemaining,
  onCallBack,
  onReadyForNextCall,
}: PostCallActionRibbonProps) => {
  const progress = Math.max(0, Math.min(100, (secondsRemaining / 30) * 100));

  return (
    <section
      className="flex h-12 shrink-0 items-center justify-between bg-[#d83d37] px-10 py-1 text-white"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex size-9 items-center justify-center rounded-full border-[3px] border-white/35">
          <span
            className="absolute inset-[-3px] rounded-full"
            style={{
              background: `conic-gradient(#ffffff ${progress * 3.6}deg, transparent 0deg)`,
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
            }}
          />
          <PhoneOff className="relative size-4" strokeWidth={2} />
        </div>
        <p className="text-sm font-medium">
          Call disconnected. Available for the next call automatically in {secondsRemaining} seconds.
        </p>
      </div>
      <div className="flex items-center gap-7 text-sm font-medium">
        <button
          type="button"
          className="underline decoration-dotted underline-offset-4 hover:text-white/85"
          onClick={onCallBack}
        >
          Call back
        </button>
        <button
          type="button"
          className="flex items-center gap-2 underline decoration-dotted underline-offset-4 hover:text-white/85"
          onClick={onReadyForNextCall}
        >
          <TimerReset className="size-4" />
          Ready for next call
        </button>
      </div>
    </section>
  );
};

export default PostCallActionRibbon;

import { type ReactNode } from "react";

const ACKO_LOGO =
  "https://pub-c050457d48794d5bb9ffc2b4649de2c1.r2.dev/ACKO%20logo%20primary%20Light%20BG.svg";

type AppHeaderProps = {
  right?: ReactNode;
};

/** Matches the main OMNI Sales top nav: 60px, ACKO logo, OMNI Sales. */
const AppHeader = ({ right }: AppHeaderProps) => {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-onyx-300 bg-card px-10 shadow-[0px_2px_5px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-3.5">
        <img src={ACKO_LOGO} alt="ACKO" className="h-9 w-auto" />
        <div className="h-[26px] w-px shrink-0 bg-onyx-300" aria-hidden />
        <span className="text-[28px] font-normal leading-[1.2] tracking-tight text-[#2c2067]">
          OMNI Sales
        </span>
      </div>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </header>
  );
};

export default AppHeader;

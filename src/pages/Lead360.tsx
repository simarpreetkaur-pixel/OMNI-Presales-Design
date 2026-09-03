import AppHeader from "@/components/AppHeader";

const Lead360 = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <div className="flex flex-1 items-center justify-center">
        <div className="space-y-3 text-center">
          <h1 className="text-2xl font-bold text-foreground">Lead 360</h1>
          <p className="text-muted-foreground">Rajesh Kumar · Honda Amaze 2025</p>
          <p className="text-sm text-muted-foreground">
            Full lead intelligence view coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lead360;

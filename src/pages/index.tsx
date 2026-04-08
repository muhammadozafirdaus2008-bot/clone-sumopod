import ScrollIndicator from "@/components/ui/ScrollIndicator";

const Index = () => {
  return (
    <div className="relative min-h-screen">

      {/* Konten biar bisa discroll */}
      <div className="h-[200vh] flex items-center justify-center">
        <h1 className="text-3xl font-bold">Landing Page</h1>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

    </div>
  );
};

export default Index;
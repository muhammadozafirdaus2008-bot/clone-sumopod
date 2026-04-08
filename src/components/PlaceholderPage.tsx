import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const PlaceholderPage = ({ title, subtitle, icon }: PlaceholderPageProps) => (
  <div>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-foreground">Coming Soon</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          This feature is under development. Stay tuned for updates.
        </p>
      </CardContent>
    </Card>
  </div>
);

export default PlaceholderPage;

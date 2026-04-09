import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  credits: number;
}

const availableServices: ServicePackage[] = [
  {
    id: "container-basic",
    name: "Basic Container",
    description: "Fast Linux container with 1 vCPU, 1 GB RAM, and 10 GB SSD storage.",
    credits: 20,
  },
  {
    id: "container-pro",
    name: "Pro Container",
    description: "Enhanced container with 2 vCPU, 2 GB RAM, and 25 GB SSD storage.",
    credits: 40,
  },
  {
    id: "container-premium",
    name: "Premium Container",
    description: "High-performance container with 4 vCPU, 4 GB RAM, and 50 GB SSD.",
    credits: 70,
  },
  {
    id: "storage-add-on",
    name: "Storage Add-on",
    description: "Add 100 GB of extra storage to your existing container.",
    credits: 15,
  },
];

const Services = () => {
  const { user, credits, spendCredits } = useAuth();
  const { toast } = useToast();
  const [ownedServices, setOwnedServices] = useState<ServicePackage[]>([]);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`owned_services_${user.id}`);
    if (stored) {
      setOwnedServices(JSON.parse(stored));
    }
  }, [user]);

  const saveOwnedServices = (items: ServicePackage[]) => {
    if (!user) return;
    localStorage.setItem(`owned_services_${user.id}`, JSON.stringify(items));
  };

  const handlePurchase = (service: ServicePackage) => {
    if (ownedServices.some((item) => item.id === service.id)) {
      toast({ title: "Already owned", description: `${service.name} is already in your dashboard.`, variant: "default" });
      return;
    }

    if (!spendCredits(service.credits)) {
      toast({ title: "Insufficient credits", description: "Add more balance before purchasing this service.", variant: "destructive" });
      return;
    }

    const nextOwned = [...ownedServices, service];
    setOwnedServices(nextOwned);
    saveOwnedServices(nextOwned);
    toast({ title: "Service purchased", description: `${service.name} has been added to your dashboard.`, duration: 4000 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">Browse available containers and purchase the best fit for your project.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{credits} credits</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {availableServices.map((service) => {
          const owned = ownedServices.some((item) => item.id === service.id);
          return (
            <Card key={service.id} className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{service.credits} credits</span>
                </div>
                <Button onClick={() => handlePurchase(service)} disabled={owned} className="w-full">
                  {owned ? (
                    <span className="flex items-center justify-center gap-2"><CheckCircle className="h-4 w-4" /> Owned</span>
                  ) : (
                    "Buy Service"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {ownedServices.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Your purchased services</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {ownedServices.map((service) => (
              <Card key={service.id} className="border border-border bg-secondary/50">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">{service.credits} credits</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;

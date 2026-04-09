import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, Plus } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ServicePackage {
  id: string;
  name: string;
  type: string;
  status: string;
  plan: string;
  autoRenewal: string;
  expiry: string;
  credits: number;
}

const availableServices: ServicePackage[] = [
  {
    id: "container-basic",
    name: "Basic Container",
    type: "Compute",
    status: "Active",
    plan: "Starter",
    autoRenewal: "On",
    expiry: "Apr 24, 2026",
    credits: 20,
  },
  {
    id: "container-pro",
    name: "Pro Container",
    type: "Compute",
    status: "Pending",
    plan: "Business",
    autoRenewal: "Off",
    expiry: "May 12, 2026",
    credits: 40,
  },
  {
    id: "storage-add-on",
    name: "Storage Add-on",
    type: "Storage",
    status: "Active",
    plan: "Add-on",
    autoRenewal: "On",
    expiry: "Jul 01, 2026",
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

  const nextService = useMemo(
    () => availableServices.find((service) => !ownedServices.some((item) => item.id === service.id)),
    [ownedServices],
  );

  const handleRefresh = () => {
    if (!user) return;
    const stored = localStorage.getItem(`owned_services_${user.id}`);
    setOwnedServices(stored ? JSON.parse(stored) : []);
    toast({ title: "Refreshed", description: "Your services list has been updated." });
  };

  const handleAddService = () => {
    if (!nextService) {
      toast({ title: "No services available", description: "You’ve already added all available services." });
      return;
    }

    if (!spendCredits(nextService.credits)) {
      toast({ title: "Insufficient credits", description: "Top up your balance before adding a new service.", variant: "destructive" });
      return;
    }

    const nextOwned = [...ownedServices, nextService];
    setOwnedServices(nextOwned);
    saveOwnedServices(nextOwned);
    toast({ title: "Service added", description: `${nextService.name} is now active in your dashboard.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Services</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Manage your managed services and keep your environment updated from one central dashboard.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="lg" onClick={handleRefresh} className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
          <Button size="lg" onClick={handleAddService} className="gap-2">
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Auto Renewal</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ownedServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm text-muted-foreground">
                    No services found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                ownedServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.type}</TableCell>
                    <TableCell>{service.status}</TableCell>
                    <TableCell>{service.plan}</TableCell>
                    <TableCell>{service.autoRenewal}</TableCell>
                    <TableCell>{service.expiry}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Manage</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;

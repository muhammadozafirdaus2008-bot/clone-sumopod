import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Service {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive" | "pending";
  plan: string;
  autoRenewal: boolean;
  expiry: string;
}

const Services = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const { credits, spendCredits } = useAuth();
  const navigate = useNavigate();

  const handleAddService = () => {
    const newService: Service = {
      id: crypto.randomUUID(),
      name: `service-${Date.now().toString(36)}`,
      type: "Web Server",
      status: "active",
      plan: "Basic",
      autoRenewal: true,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    };

    if (spendCredits(10)) {
      setServices((prev) => [...prev, newService]);
      toast({ title: "Service added", description: `${newService.name} has been created. 10 credits deducted.` });
    } else {
      toast({ title: "Insufficient credits", description: "You need at least 10 credits.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground">Manage your managed services</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-1.5 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => navigate("/services/add")}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>PLAN</TableHead>
                <TableHead>AUTO RENEWAL</TableHead>
                <TableHead>EXPIRY</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No services found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                services.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.type}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        s.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell>{s.plan}</TableCell>
                    <TableCell>{s.autoRenewal ? "Yes" : "No"}</TableCell>
                    <TableCell>{s.expiry}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setServices((prev) => prev.filter((x) => x.id !== s.id));
                        toast({ title: "Service removed" });
                      }}>
                        Remove
                      </Button>
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

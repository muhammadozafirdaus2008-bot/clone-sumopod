import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Cloud, Search } from "lucide-react";
import { toast } from "sonner";

interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  price: string;
  cost: number;
}

const serviceTemplates: ServiceTemplate[] = [
  { id: "activepieces", name: "Activepieces", description: "Automation Alternative to Zapier, easier than n8n", price: "Starts from Rp 60.000/month", cost: 60 },
  { id: "go-whatsapp", name: "Go WhatsApp by Aldinokemal", description: "Simple, Light, Easy WhatsApp Unofficial API", price: "Starts from Rp 15.000/month", cost: 15 },
  { id: "n8n", name: "n8n", description: "Automation using n8n", price: "Starts from Rp 15.000/month", cost: 15 },
  { id: "n8n-ffmpeg", name: "n8n (ffmpeg included)", description: "n8n with ffmpeg installed", price: "Starts from Rp 15.000/month", cost: 15 },
  { id: "waha-gows", name: "WAHA Plus Cloud - GOWS", description: "WhatsApp API Unofficial with WAHA Plus GOWS Engine", price: "Starts from Rp 15.000/month", cost: 15 },
  { id: "waha-noweb", name: "WAHA Plus Cloud - NOWEB", description: "WhatsApp API Unofficial with WAHA Plus NOWEB Engine", price: "Starts from Rp 15.000/month", cost: 15 },
  { id: "evolution-api", name: "Evolution API", description: "Multi-device WhatsApp API with webhook support", price: "Starts from Rp 20.000/month", cost: 20 },
  { id: "typebot", name: "Typebot", description: "Open-source chatbot builder alternative to Landbot", price: "Starts from Rp 25.000/month", cost: 25 },
  { id: "chatwoot", name: "Chatwoot", description: "Open-source customer engagement platform", price: "Starts from Rp 30.000/month", cost: 30 },
];

const AddService = () => {
  const navigate = useNavigate();
  const { spendCredits } = useAuth();
  const [search, setSearch] = useState("");

  const filtered = serviceTemplates.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeploy = (template: ServiceTemplate) => {
    if (spendCredits(template.cost)) {
      toast.success(`${template.name} deployed! ${template.cost} credits deducted.`);
      navigate("/services");
    } else {
      toast.error("Insufficient credits to deploy this service.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/services")}
          className="mb-2 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-foreground">Add Service</h1>
        <p className="text-sm text-muted-foreground">
          Choose a service template to add to your account
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search service categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <Card key={template.id} className="flex flex-col justify-between">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{template.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
              </div>
              <p className="text-sm text-muted-foreground">{template.price}</p>
              <Button className="mt-auto w-full gap-2" onClick={() => handleDeploy(template)}>
                <Cloud className="h-4 w-4" />
                Deploy
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          No services found matching "{search}"
        </div>
      )}
    </div>
  );
};

export default AddService;
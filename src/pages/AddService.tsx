import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Cloud, Search, X } from "lucide-react";
import { toast } from "sonner";

interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  price: string;
  cost: number;
}

const serviceTemplates: ServiceTemplate[] = [
  { id: "activepieces", name: "Activepieces", description: "Automation Alternative to Zapier, easier than n8n", price: "Starts from Rp 60.000/month", cost: 60000 },
  { id: "go-whatsapp", name: "Go WhatsApp by Aldinokemal", description: "Simple, Light, Easy WhatsApp Unofficial API", price: "Starts from Rp 15.000/month", cost: 15000 },
  { id: "n8n", name: "n8n", description: "Automation using n8n", price: "Starts from Rp 15.000/month", cost: 15000 },
  { id: "n8n-ffmpeg", name: "n8n (ffmpeg included)", description: "n8n with ffmpeg installed", price: "Starts from Rp 15.000/month", cost: 15000 },
  { id: "waha-gows", name: "WAHA Plus Cloud - GOWS", description: "WhatsApp API Unofficial with WAHA Plus GOWS Engine", price: "Starts from Rp 15.000/month", cost: 15000 },
  { id: "waha-noweb", name: "WAHA Plus Cloud - NOWEB", description: "WhatsApp API Unofficial with WAHA Plus NOWEB Engine", price: "Starts from Rp 15.000/month", cost: 15000 },
  { id: "evolution-api", name: "Evolution API", description: "Multi-device WhatsApp API with webhook support", price: "Starts from Rp 20.000/month", cost: 20000 },
  { id: "typebot", name: "Typebot", description: "Open-source chatbot builder alternative to Landbot", price: "Starts from Rp 25.000/month", cost: 25000 },
  { id: "chatwoot", name: "Chatwoot", description: "Open-source customer engagement platform", price: "Starts from Rp 30.000/month", cost: 30000 },
];

const AddService = () => {
  const navigate = useNavigate();
  const { user, refreshCredits } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [deploying, setDeploying] = useState(false);

  const filtered = serviceTemplates.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeploy = async () => {
  if (!selectedTemplate || !user) return;

  setDeploying(true);

  try {
    const { data, error } = await supabase.rpc("deploy_service", {
      p_user_id: user.id,
      p_service_name: serviceName,
      p_package: selectedTemplate.id,
      p_cost: selectedTemplate.cost,
    });

    if (error) throw error;

    toast.success("Deploy sedang diproses...");
    navigate("/services");

  } catch (err) {
    toast.error(err.message);
  } finally {
    setDeploying(false);
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
              <Button
                className="mt-auto w-full gap-2"
                onClick={() => {
                  setSelectedTemplate(template);
                  setServiceName("");
                }}
              >
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

      {/* Dialog */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            
            {/* Dialog Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Deploy {selectedTemplate.name}</h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Input Nama Service */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-foreground">
                Nama Service
              </label>
              <Input
                placeholder="contoh: n8n-toko-saya"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDeploy()}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Gunakan huruf kecil, angka, dan tanda hubung saja
              </p>
            </div>

            {/* Info Harga */}
            <div className="mb-5 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Biaya: <span className="font-semibold text-foreground">{selectedTemplate.price}</span>
            </div>

            {/* Tombol */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedTemplate(null)}
                disabled={deploying}
              >
                Batal
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleDeploy}
                disabled={deploying}
              >
                <Cloud className="h-4 w-4" />
                {deploying ? "Deploying..." : "Deploy Sekarang"}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AddService;
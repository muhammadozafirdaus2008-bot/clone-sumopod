import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Cloud, Search } from "lucide-react";
import { toast } from "sonner";
import { deployN8nService, DEPLOY_SERVICE_WEBHOOK } from "@/lib/n8n-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";  

interface ServiceTemplate {
  id: string;
  name: string;
  description: string;
  price: string;
  cost: number;
  template: string;
}

const serviceTemplates: ServiceTemplate[] = [
  {
    id: "n8n-basic",
    name: "n8n",
    description: "Automation using n8n",
    price: "Starts from Rp 15.000/month",
    cost: 15000,
    template: "n8n-basic",
  },
  {
    id: "n8n-plus",
    name: "n8n Plus",
    description: "n8n with more resources",
    price: "Starts from Rp 30.000/month",
    cost: 30000,
    template: "n8n-plus",
  },
];

const AddService = () => {
  const navigate = useNavigate();
  const { user, session, credits } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null);
  const [serviceName, setServiceName] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const filtered = serviceTemplates.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectTemplate = (template: ServiceTemplate) => {
    setSelectedTemplate(template);
    setServiceName("");
    setAgreedToTerms(false);
  };

  const handleProceedToDeploy = () => {
    if (!serviceName.trim()) {
      toast.error("Masukkan nama service dulu!");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Pilih template dulu!");
      return;
    }

    // Check credits
    if (credits < selectedTemplate.cost) {
      toast.error(
        `Kredit tidak cukup! Anda butuh Rp ${selectedTemplate.cost}, tapi hanya punya Rp ${credits}`
      );
      return;
    }

    // Show agreement modal
    setShowAgreement(true);
  };

  const handleDeploy = async () => {
    if (!selectedTemplate || !user || !session?.access_token) {
      toast.error("Data tidak lengkap");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Anda harus setuju dengan Terms of Service");
      return;
    }

    setDeploying(true);

    try {
      const response = await deployN8nService(
        serviceName.trim(),
        selectedTemplate.template,
        selectedTemplate.cost,
        session.access_token
      );

      if (response.success) {
        toast.success("🚀 Deploy berhasil! Service sedang di-setup...");
        
        // Reset form
        setSelectedTemplate(null);
        setServiceName("");
        setShowAgreement(false);
        setAgreedToTerms(false);

        // Redirect ke instances dalam 2 detik
        setTimeout(() => {
          navigate("/instances");
        }, 2000);
      } else {
        toast.error(response.message || "Deploy gagal");
      }
    } catch (err: any) {
      console.error("Deploy error:", err);
      toast.error(err.message || "Tidak bisa connect ke server");
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
        <h1 className="text-2xl font-bold text-foreground">Deploy Service</h1>
        <p className="text-sm text-muted-foreground">
          Choose a service template to add to your account
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Service Templates */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <Card key={template.id}>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
              <p className="text-sm font-medium text-foreground">{template.price}</p>

              <Button
                onClick={() => handleSelectTemplate(template)}
                className="w-full"
              >
                Deploy
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Name Modal */}
      {selectedTemplate && !showAgreement && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="mb-4 font-semibold text-lg">
              Deploy {selectedTemplate.name}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Service Name</label>
                <Input
                  placeholder="my-automation"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Huruf kecil, angka, dan tanda hubung saja
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <p className="text-sm font-medium text-blue-900">Summary</p>
                <div className="mt-2 space-y-1 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-semibold">{selectedTemplate.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Harga:</span>
                    <span className="font-semibold">Rp {selectedTemplate.cost.toLocaleString("id-ID")}/bulan</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate(null);
                    setServiceName("");
                  }}
                  disabled={deploying}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleProceedToDeploy}
                  disabled={deploying || !serviceName.trim()}
                  className="flex-1"
                >
                  Lanjut
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Agreement Modal */}
      {showAgreement && selectedTemplate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md max-h-96 overflow-y-auto">
            <h2 className="mb-4 font-bold text-lg flex items-center gap-2">
              ⚠️ Deployment Agreement
            </h2>

            <div className="space-y-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-900">
                <p className="font-semibold mb-2">Pembayaran akan diproses</p>
                <p>
                  Anda akan dikenakan <strong>Rp {selectedTemplate.cost.toLocaleString("id-ID")}</strong> dari akun Anda.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 bg-amber-50 p-4 text-sm">
                <p className="font-semibold text-amber-900 mb-2">Terms of Service</p>
                <p className="text-amber-800">
                  By deploying this service, you agree that you will not use this service for any illegal
                  activities. If illegal activities are detected, your service will be terminated automatically
                  without prior notice.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded">
                <Checkbox
                  id="agree"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="agree" className="text-sm cursor-pointer">
                  I agree with the Terms of Service and understand that credits will be deducted
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAgreement(false);
                  setAgreedToTerms(false);
                }}
                disabled={deploying}
              >
                Batal
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={deploying || !agreedToTerms}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {deploying ? "Deploying..." : "I Agree, Deploy"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddService;
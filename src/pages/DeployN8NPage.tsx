import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { deployN8nService } from "@/lib/n8n-client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft, Cloud, Loader2, AlertTriangle, Cpu, MemoryStick, CheckCircle2,
} from "lucide-react";

export default function DeployServicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, user, credits } = useAuth();
  const { toast } = useToast();

  const service = location.state?.service;

  const [serviceName, setServiceName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(service?.templates?.[0] ?? null);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Service tidak ditemukan.</p>
        <Button onClick={() => navigate("/services/add")}>Kembali</Button>
      </div>
    );
  }

  const hasEnoughCredits = credits >= (selectedTemplate?.cost ?? 0);

  // Validasi sebelum buka modal agreement
  const handleDeployClick = () => {
    if (!serviceName.trim()) {
      toast({ title: "Error", description: "Nama service wajib diisi", variant: "destructive" });
      return;
    }
    if (serviceName.trim().length < 3 || serviceName.trim().length > 32) {
      toast({ title: "Error", description: "Nama service harus 3-32 karakter", variant: "destructive" });
      return;
    }
    if (!/^[a-z0-9-]+$/.test(serviceName.trim())) {
      toast({ title: "Error", description: "Hanya huruf kecil, angka, dan tanda hubung", variant: "destructive" });
      return;
    }
    if (!hasEnoughCredits) {
      toast({ title: "Kredit tidak cukup", description: "Top up dulu sebelum deploy", variant: "destructive" });
      return;
    }
    if (!session?.token) {
      toast({ title: "Error", description: "Session expired, login ulang", variant: "destructive" });
      return;
    }
    // Buka agreement modal
    setAgreementOpen(true);
  };

  // Dipanggil setelah user setuju di modal
  const handleConfirmDeploy = async () => {
    setAgreementOpen(false);
    setLoading(true);

    try {
      await deployN8nService(
        serviceName.trim(),
        selectedTemplate.id,
        selectedTemplate.cost,
        session!.token
      );

      toast({ title: "Deploy Berhasil! 🚀", description: "Service sedang di-deploy. Tunggu 10–30 detik..." });
      setTimeout(() => navigate("/services"), 1500);
    } catch (err: any) {
      console.error("Deploy error:", err);
      toast({ title: "Deploy Gagal", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/services/add")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Deploy {service.name}</h1>
          <p className="text-sm text-muted-foreground">Configure and deploy your service in seconds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — config */}
        <div className="lg:col-span-2 space-y-5">

          {/* Kredit tidak cukup */}
          {!hasEnoughCredits && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-5 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 text-sm">Kredit Tidak Cukup</p>
                  <p className="text-xs text-red-700 mt-0.5">
                    Butuh Rp {(selectedTemplate?.cost ?? 0).toLocaleString("id-ID")}, punya Rp {credits.toLocaleString("id-ID")}
                  </p>
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate("/billing")}>
                    Top Up Sekarang
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service name */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Service Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="svc-name">Service Name</Label>
              <Input
                id="svc-name"
                placeholder="Enter your service name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Lowercase, numbers, and hyphens only (3–32 chars)</p>
            </CardContent>
          </Card>

          {/* Template picker */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Choose Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {service.templates.map((t: any) => {
                const isSelected = selectedTemplate?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t)}
                    disabled={loading}
                    className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-border hover:border-blue-200 bg-card"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-blue-100" : "bg-muted"}`}>
                      <Cloud className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Cpu className="h-3 w-3" /> {t.cpu}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MemoryStick className="h-3 w-3" /> {t.ram}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground mt-2">
                        Rp {t.cost.toLocaleString("id-ID")}/month
                      </p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right — summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Deployment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Service Type</p>
                  <p className="font-semibold text-foreground">{service.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Template</p>
                  <p className="font-semibold text-foreground">{selectedTemplate?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Billing Cycle</p>
                  <p className="font-semibold text-foreground">Monthly</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-foreground">Cost</p>
                  <p className="text-base font-bold text-blue-600">
                    Rp {(selectedTemplate?.cost ?? 0).toLocaleString("id-ID")}/month
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">Your Credits</p>
                  <p className={`text-xs font-semibold ${hasEnoughCredits ? "text-green-600" : "text-red-500"}`}>
                    Rp {credits.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleDeployClick}
                disabled={loading || !selectedTemplate}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Deploying...</>
                ) : (
                  <><Cloud className="h-4 w-4" /> Deploy Service</>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/services/add")}
                disabled={loading}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deployment Agreement Modal */}
      <Dialog open={agreementOpen} onOpenChange={setAgreementOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <DialogTitle>Deployment Agreement</DialogTitle>
                <DialogDescription>Please read and agree to continue</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
            <p className="text-sm font-semibold text-amber-800">Terms of Service</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              By deploying this service, you agree that you will not use this service for any illegal
              activities. If illegal activities are detected, your service will be terminated automatically
              without prior notice.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setAgreementOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1 gap-2" onClick={handleConfirmDeploy}>
              <CheckCircle2 className="h-4 w-4" />
              I Agree, Deploy {selectedTemplate?.name}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
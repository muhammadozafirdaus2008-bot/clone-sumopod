import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { deployN8nService } from "@/lib/n8n-client";
import { ArrowLeft, Cloud, Loader2, AlertTriangle } from "lucide-react";

const TEMPLATES = [
  { id: "n8n-basic", name: "n8n Basic", cost: 15000 },
  { id: "n8n-plus", name: "n8n Plus", cost: 30000 },
];

export default function DeployN8NPage() {
  const { session, credits } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [serviceName, setServiceName] = useState("");
  const [template, setTemplate] = useState("n8n-basic");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [instances, setInstances] = useState([]);
  useEffect(() => {
  fetch("http://43.134.70.47:4000/instances")
    .then((res) => res.json())
    .then((data) => setInstances(data))
    .catch((err) => console.error(err));
}, []);

  const selectedTemplate = TEMPLATES.find((t) => t.id === template)!;
  const hasEnoughCredits = credits >= selectedTemplate.cost;

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName.trim()) {
      toast({
        title: "Error",
        description: "Service name is required",
        variant: "destructive",
      });
      return;
    }

    if (!session?.access_token) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Error",
        description: "You must agree to the Terms of Service",
        variant: "destructive",
      });
      return;
    }

    if (!hasEnoughCredits) {
      toast({
        title: "Insufficient Credits",
        description: `You need Rp ${selectedTemplate.cost.toLocaleString("id-ID")}, but only have Rp ${credits.toLocaleString("id-ID")}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await deployN8nService(
  serviceName.trim(),
  selectedTemplate.id,
  selectedTemplate.cost,
  session.access_token
);

      toast({
        title: "Deploy Berhasil! 🚀",
        description: `Service sedang di-deploy. Tunggu 10-30 detik...`,
      });

      setTimeout(() => {
        navigate("/instances");
      }, 2000);
    } catch (err: any) {
      console.error("Deploy error:", err);
      toast({
        title: "Deploy Gagal",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/instances")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Deploy n8n Service</h1>
          <p className="text-muted-foreground">Create a new automation instance</p>
        </div>
      </div>

      {/* Credit Check Alert */}
      {!hasEnoughCredits && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Kredit Tidak Cukup</p>
              <p className="text-sm text-red-800">
                Anda butuh Rp {selectedTemplate.cost.toLocaleString("id-ID")}, tapi hanya punya Rp {credits.toLocaleString("id-ID")}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/billing")}
                className="mt-2"
              >
                Top Up Sekarang
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="mt-6 space-y-4">
  <h2 className="text-xl font-bold">My Instances</h2>

  {instances.length === 0 ? (
    <p className="text-muted-foreground">No instances found</p>
  ) : (
    instances.map((inst: any, i) => (
      <div key={i} className="border p-4 rounded-lg">
        <p className="font-bold">{inst.service_name}</p>
        <p>Port: {inst.port}</p>
        <p>Status: {inst.status}</p>

        <a
          href={inst.url}
          target="_blank"
          className="text-blue-500 underline"
        >
          Open n8n
        </a>
      </div>
    ))
  )}
</div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDeploy} className="space-y-6">
            {/* Service Name */}
            <div className="space-y-2">
              <Label htmlFor="service-name">Nama Service</Label>
              <Input
                id="service-name"
                placeholder="my-automation"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Huruf kecil, angka, dan tanda hubung (3-32 karakter)
              </p>
            </div>

            {/* Template Selection */}
            <div className="space-y-3">
              <Label>Pilih Template</Label>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent"
                  >
                    <input
                      type="radio"
                      name="template"
                      value={t.id}
                      checked={template === t.id}
                      onChange={(e) => setTemplate(e.target.value)}
                      disabled={loading}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{t.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rp {t.cost.toLocaleString("id-ID")}/bulan
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border rounded-lg p-4 bg-blue-50 space-y-2">
              <p className="font-semibold text-blue-900">📋 Ringkasan</p>
              <div className="space-y-1 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Service:</span>
                  <span className="font-semibold">{serviceName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Template:</span>
                  <span className="font-semibold">{selectedTemplate.name}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-blue-200">
                  <span>Harga:</span>
                  <span className="font-bold">Rp {selectedTemplate.cost.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kredit Anda:</span>
                  <span className={`font-semibold ${hasEnoughCredits ? "text-green-600" : "text-red-600"}`}>
                    Rp {credits.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="border-l-4 border-amber-500 bg-amber-50 p-4">
              <p className="font-semibold text-amber-900 mb-3">⚠️ Terms of Service</p>
              <p className="text-sm text-amber-800 mb-3">
                By deploying this service, you agree that you will not use this service for any illegal
                activities. If illegal activities are detected, your service will be terminated automatically
                without prior notice.
              </p>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  disabled={loading}
                />
                <span className="text-sm">I agree with Terms of Service</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/instances")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !hasEnoughCredits || !agreedToTerms}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-2 w-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Cloud className="mr-2 h-4 w-4" />
                    Deploy Service
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
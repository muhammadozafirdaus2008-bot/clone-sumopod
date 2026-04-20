import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Instance {
  id: string;
  user_id: string;
  service_name: string;
  template: string;
  status: string;
  plan: string;
  cost: number;
  access_url: string;
  expiry_date: string;
  created_at: string;
}

export default function InstanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [instance, setInstance] = useState<Instance | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!session?.user?.id || !id) return;
    fetchInstance();
  }, [id, session?.user?.id]);

  const fetchInstance = async () => {
    try {
      const { data, error } = await supabase
        .from("instances")
        .select("*")
        .eq("id", id)
        .eq("user_id", session?.user?.id)
        .single();

      if (error) throw error;
      setInstance(data as Instance);
    } catch (err) {
      console.error("Error fetching instance:", err);
      toast.error("Service not found");
      navigate("/instances");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!instance) return <div className="text-center py-12">Service not found</div>;

  const isActive = instance.status === "active";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/instances")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{instance.service_name}</h1>
            <Badge
              variant={isActive ? "default" : "secondary"}
              className={isActive ? "bg-green-600" : "bg-yellow-600"}
            >
              {isActive ? "✓" : "⏱"} {instance.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {instance.template} • {instance.plan} • Rp{" "}
            {instance.cost.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Access Card */}
      {isActive && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Service Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center text-lg">
                  ⚙️
                </div>
                <div>
                  <p className="font-medium">n8n Admin Console</p>
                  <p className="text-sm text-muted-foreground">
                    Edit workflows dan manage settings
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded font-mono text-sm break-all">
                <span className="flex-1">{instance.access_url}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyUrl(instance.access_url)}
                >
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={() => window.open(instance.access_url, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Buka Admin Console
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nama Service</p>
              <p className="font-semibold">{instance.service_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Template</p>
              <p className="font-semibold">{instance.template}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold capitalize">{instance.status}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-semibold">{instance.plan}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Harga</p>
              <p className="font-semibold">Rp {instance.cost.toLocaleString("id-ID")}/bulan</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
              <p className="font-semibold">
                {instance.expiry_date
                  ? new Date(instance.expiry_date).toLocaleDateString("id-ID")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dibuat</p>
              <p className="font-semibold">
                {new Date(instance.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
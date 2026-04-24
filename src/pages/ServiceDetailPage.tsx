import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, Link2, Activity, FileText, TrendingUp,
  Globe, FolderOpen, Settings, RotateCcw, Terminal, KeyRound,
  Copy, ExternalLink, Check, Eye, EyeOff,
} from "lucide-react";

interface Service {
  id: string;
  service_name: string;
  package: string | null;
  status: string;
  url: string | null;
  username: string | null;
  password: string | null;
  created_at: string;
}

const TABS = [
  { id: "access",        label: "Access",           icon: Link2 },
  { id: "monitor",       label: "Monitor",          icon: Activity },
  { id: "logs",          label: "Logs",             icon: FileText },
  { id: "upgrade",       label: "Upgrade & Renew",  icon: TrendingUp },
  { id: "custom-domain", label: "Custom Domain",    icon: Globe },
  { id: "file-manager",  label: "File Manager",     icon: FolderOpen },
  { id: "configuration", label: "Configuration",    icon: Settings },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded hover:bg-gray-100 transition-colors text-muted-foreground hover:text-foreground">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function PlaceholderTab({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("access");
  const [service, setService] = useState<Service | null>(location.state?.service ?? null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(!service);

  // Fetch jika tidak ada state (direct URL access)
  useEffect(() => {
    if (service || !id || !user) return;
    supabase
      .from("instances")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setService(data as Service);
        setLoading(false);
      });
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Service tidak ditemukan.</p>
        <Button onClick={() => navigate("/services")}>Kembali</Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "active" || s === "running") return "bg-green-100 text-green-700 border border-green-200";
    if (s === "deploying") return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  const renderTab = () => {
    switch (activeTab) {
      case "access":
        return (
          <div className="space-y-5 py-2">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">Access</h3>
              <p className="text-sm text-muted-foreground">Connect to your service using these endpoints</p>
            </div>

            {/* Admin Console URL */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Admin Console</p>
                    <p className="text-xs text-muted-foreground">Administrative interface for managing your service settings and data.</p>
                  </div>
                  <CopyButton text={service.url ?? ""} />
                </div>

                <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-3">
                  <span className="flex-1 text-sm text-foreground font-mono truncate">
                    {service.url ?? "URL belum tersedia"}
                  </span>
                  {service.url && (
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="gap-1.5">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Credentials */}
            {(service.username || service.password) && (
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                      <KeyRound className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Credentials</p>
                      <p className="text-xs text-muted-foreground">Login credentials for your service.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Username */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Username</p>
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2.5">
                        <span className="flex-1 text-sm font-mono text-foreground">{service.username}</span>
                        <CopyButton text={service.username ?? ""} />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">Password</p>
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2.5">
                        <span className="flex-1 text-sm font-mono text-foreground">
                          {showPassword ? service.password : "••••••••••••"}
                        </span>
                        <button
                          onClick={() => setShowPassword((v) => !v)}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <CopyButton text={service.password ?? ""} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "monitor":
        return <PlaceholderTab title="Monitor" description="Real-time metrics and performance monitoring for your service." icon={Activity} />;
      case "logs":
        return <PlaceholderTab title="Logs" description="View live and historical logs from your service container." icon={FileText} />;
      case "upgrade":
        return <PlaceholderTab title="Upgrade & Renew" description="Upgrade your plan or renew your service subscription." icon={TrendingUp} />;
      case "custom-domain":
        return <PlaceholderTab title="Custom Domain" description="Connect a custom domain to your service." icon={Globe} />;
      case "file-manager":
        return <PlaceholderTab title="File Manager" description="Browse and manage files in your service container." icon={FolderOpen} />;
      case "configuration":
        return <PlaceholderTab title="Configuration" description="Manage environment variables and service configuration." icon={Settings} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/services")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold text-foreground capitalize">{service.service_name}</h1>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(service.status)}`}>
                    {service.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {service.package ?? "n8n Basic"} · monthly · Rp 15.000
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Terminal className="h-4 w-4" />
                Web Console
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <KeyRound className="h-4 w-4" />
                Reset Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs + Content */}
      <Card>
        {/* Tab bar */}
        <div className="border-b border-border px-2 pt-1">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <CardContent className="p-6">
          {renderTab()}
        </CardContent>
      </Card>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Service {
  id: string;
  user_id: string;
  service_name: string;
  package: string | null;
  status: string;
  url: string | null;
  username: string | null;
  password: string | null;
  created_at: string;
}

// Hitung expiry: created_at + 30 hari
function getExpiry(createdAt: string) {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + 30);
  const now = new Date();
  const daysLeft = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const dateStr = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  return { dateStr, daysLeft };
}

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState<Record<string, boolean>>({});

  const fetchServices = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("instances")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setServices(data as Service[]);
      // default auto renewal true untuk semua
      const renewalMap: Record<string, boolean> = {};
      data.forEach((s: Service) => { renewalMap[s.id] = true; });
      setAutoRenewal(renewalMap);
    }
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, [user]);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "active" || s === "running")
      return "bg-green-100 text-green-700 border border-green-200";
    if (s === "deploying")
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    if (s === "stopped" || s === "error")
      return "bg-red-100 text-red-700 border border-red-200";
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground">Manage your managed services</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchServices} disabled={loading}>
            <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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
                <TableHead className="w-40">NAME</TableHead>
                <TableHead className="w-32">TYPE</TableHead>
                <TableHead className="w-28">STATUS</TableHead>
                <TableHead className="w-44">PLAN</TableHead>
                <TableHead className="w-36 text-center">AUTO RENEWAL</TableHead>
                <TableHead className="w-44">EXPIRY</TableHead>
                <TableHead className="w-28 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No services yet. Click "Add Service" to get started!
                  </TableCell>
                </TableRow>
              ) : (
                services.map((s) => {
                  const { dateStr, daysLeft } = getExpiry(s.created_at);
                  const isRenewing = autoRenewal[s.id] ?? true;
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-semibold text-foreground">
                        {s.service_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {s.package ?? "n8n Basic"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(s.status)}`}>
                          {s.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-foreground">Monthly</p>
                        <p className="text-xs text-muted-foreground">Rp 15.000</p>
                      </TableCell>
                      <TableCell className="text-center">
                        {/* Toggle switch */}
                        <button
                          onClick={() => setAutoRenewal((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isRenewing ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            isRenewing ? "translate-x-6" : "translate-x-1"
                          }`} />
                        </button>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground">{dateStr}</p>
                        <p className={`text-xs font-medium ${daysLeft <= 7 ? "text-red-500" : "text-muted-foreground"}`}>
                          ({daysLeft} days left)
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/services/${s.id}`, { state: { service: s } })}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Services;
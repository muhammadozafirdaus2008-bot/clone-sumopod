import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cloud, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── Daftar semua template service ────────────────────────────────────────────
const ALL_TEMPLATES = [
  {
    id: "activepieces",
    name: "Activepieces",
    description: "Automation Alternative to Zapier, easier than n8n",
    startFrom: 60000,
    type: "activepieces",
    templates: [
      { id: "activepieces-basic", name: "Activepieces Basic", cost: 60000, cpu: "0.5 CPU", ram: "512 MB RAM", desc: "Basic plan for Activepieces" },
    ],
  },
  {
    id: "gowhatsapp",
    name: "Go WhatsApp by Aldinokemal",
    description: "Simple, Light, Easy WhatsApp Unofficial API",
    startFrom: 15000,
    type: "gowhatsapp",
    templates: [
      { id: "gowhatsapp-basic", name: "GoWhatsApp Basic", cost: 15000, cpu: "0.5 CPU", ram: "512 MB RAM", desc: "Basic WhatsApp API instance" },
    ],
  },
  {
    id: "n8n",
    name: "n8n",
    description: "Automation using n8n",
    startFrom: 15000,
    type: "n8n",
    templates: [
      { id: "n8n-basic", name: "n8n Basic", cost: 15000, cpu: "0.5 CPU", ram: "512 MB RAM", desc: "Only for Small and Simple Tasks, NOT FOR CHATBOT OR AI AGENT" },
      { id: "n8n-plus",  name: "n8n Plus",  cost: 30000, cpu: "1 CPU",   ram: "1.0 GB RAM", desc: "Minimal Requirement for Building Chatbot and AI Agent" },
      { id: "n8n-ffmpeg", name: "n8n (ffmpeg included)", cost: 30000, cpu: "1 CPU", ram: "1.0 GB RAM", desc: "n8n with ffmpeg installed" },
    ],
  },
  {
    id: "waha-gows",
    name: "WAHA Plus Cloud - GOWS",
    description: "WhatsApp API Unofficial with WAHA Plus GOWS Engine",
    startFrom: 15000,
    type: "waha",
    templates: [
      { id: "waha-gows-basic", name: "WAHA GOWS Basic", cost: 15000, cpu: "0.5 CPU", ram: "512 MB RAM", desc: "WAHA Plus using GOWS engine" },
    ],
  },
  {
    id: "waha-noweb",
    name: "WAHA Plus Cloud - NOWEB",
    description: "WhatsApp API Unofficial with WAHA Plus NOWEB Engine",
    startFrom: 15000,
    type: "waha",
    templates: [
      { id: "waha-noweb-basic", name: "WAHA NOWEB Basic", cost: 15000, cpu: "0.5 CPU", ram: "512 MB RAM", desc: "WAHA Plus using NOWEB engine" },
    ],
  },
  {
    id: "flowise",
    name: "Flowise",
    description: "Open source UI visual tool to build LLM flows",
    startFrom: 30000,
    type: "flowise",
    templates: [
      { id: "flowise-basic", name: "Flowise Basic", cost: 30000, cpu: "1 CPU", ram: "1.0 GB RAM", desc: "Build LLM apps visually" },
    ],
  },
];

export default function AddService() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = ALL_TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeploy = (service: typeof ALL_TEMPLATES[0]) => {
    navigate("/services/deploy", { state: { service } });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/services")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Service</h1>
          <p className="text-sm text-muted-foreground">Choose a service template to add to your account</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search service categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="border border-border rounded-xl p-5 bg-card hover:border-blue-200 hover:shadow-md transition-all flex flex-col gap-4"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Cloud className="h-6 w-6 text-blue-500" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-base mb-1">{service.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            <p className="text-sm text-muted-foreground">
              Starts from Rp {service.startFrom.toLocaleString("id-ID")}/month
            </p>

            {/* Deploy button */}
            <Button
              className="w-full gap-2"
              onClick={() => handleDeploy(service)}
            >
              <Cloud className="h-4 w-4" />
              Deploy
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
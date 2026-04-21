import { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "../hooks/useTheme";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User, MapPin, Mail, Palette, Moon, Sun,
  Save, ChevronRight,
} from "lucide-react";

// ── Sidebar menu items ────────────────────────────────────────────────────────
const MENU = [
  { id: "profile",    label: "Profile Information", icon: User },
  { id: "customer",  label: "Customer Information", icon: MapPin },
  { id: "appearance",label: "Appearance",           icon: Palette },
  { id: "email",     label: "Email Preferences",    icon: Mail },
];

// ── Country codes ─────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: "+62", label: "+62 (Indonesia)" },
  { code: "+1",  label: "+1 (US/Canada)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+81", label: "+81 (Japan)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+60", label: "+60 (Malaysia)" },
];

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isDark, setDark } = useTheme();
  const [active, setActive] = useState("profile");
  const [saving, setSaving] = useState(false);

  // ── Profile form ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: user?.email ?? "",
    company: "",
    website: "",
  });

  // ── Customer form ─────────────────────────────────────────────────────────
  const [customer, setCustomer] = useState({
    name: "",
    company: "",
    address: "",
    city: "",
    province: "",
    country: "Indonesia",
    postalCode: "",
    phoneCode: "+62",
    phone: "",
    mobileCode: "+62",
    mobile: "",
  });

  // ── Email prefs ───────────────────────────────────────────────────────────
  const [marketingEmails, setMarketingEmails] = useState(true);

  // Load existing profile from supabase user_metadata
  useEffect(() => {
    if (!user) return;
    const m = user.user_metadata ?? {};
    setProfile({
      firstName: m.first_name ?? m.full_name?.split(" ")[0] ?? "",
      lastName:  m.last_name  ?? m.full_name?.split(" ").slice(1).join(" ") ?? "",
      email:     user.email ?? "",
      company:   m.company ?? "",
      website:   m.website ?? "",
    });
    setCustomer((prev) => ({
      ...prev,
      name:    m.full_name ?? "",
      company: m.company ?? "",
    }));
  }, [user]);

  // ── Save handlers ─────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: profile.firstName,
        last_name:  profile.lastName,
        full_name:  `${profile.firstName} ${profile.lastName}`.trim(),
        company:    profile.company,
        website:    profile.website,
      },
    });
    setSaving(false);
    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile tersimpan ✓" });
    }
  };

  const saveCustomer = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        billing_name:     customer.name,
        billing_company:  customer.company,
        billing_address:  customer.address,
        billing_city:     customer.city,
        billing_province: customer.province,
        billing_country:  customer.country,
        billing_postal:   customer.postalCode,
        billing_phone:    `${customer.phoneCode}${customer.phone}`,
        billing_mobile:   `${customer.mobileCode}${customer.mobile}`,
      },
    });
    setSaving(false);
    if (error) {
      toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Customer info tersimpan ✓" });
    }
  };

  // ── Render sections ───────────────────────────────────────────────────────
  const renderContent = () => {
    switch (active) {

      // ── Profile ────────────────────────────────────────────────────────────
      case "profile":
        return (
          <Section
            icon={<User className="h-4 w-4 text-blue-500" />}
            title="Profile Information"
            description="Your personal details and account information"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name">
                <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
              </Field>
              <Field label="Last Name">
                <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
              </Field>
            </div>
            <Field label="Email">
              <Input value={profile.email} disabled className="opacity-60 cursor-not-allowed" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company">
                <Input value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
              </Field>
              <Field label="Website">
                <Input value={profile.website} placeholder="https://example.com" onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveProfile} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </Section>
        );

      // ── Customer ────────────────────────────────────────────────────────────
      case "customer":
        return (
          <Section
            icon={<MapPin className="h-4 w-4 text-blue-500" />}
            title="Customer Information"
            description="Billing details used for invoices and receipts"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name">
                <Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
              </Field>
              <Field label="Company">
                <Input value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} />
              </Field>
            </div>
            <Field label="Address">
              <Input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City">
                <Input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
              </Field>
              <Field label="Province">
                <Input value={customer.province} onChange={(e) => setCustomer({ ...customer, province: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Country">
                <Input value={customer.country} onChange={(e) => setCustomer({ ...customer, country: e.target.value })} />
              </Field>
              <Field label="Postal Code">
                <Input value={customer.postalCode} onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone Number">
                <div className="flex gap-2">
                  <select
                    className="h-10 rounded-md border border-input bg-background px-2 text-sm text-foreground"
                    value={customer.phoneCode}
                    onChange={(e) => setCustomer({ ...customer, phoneCode: e.target.value })}
                  >
                    {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <Input value={customer.phone} placeholder="8xxx" onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                </div>
              </Field>
              <Field label="Mobile Number">
                <div className="flex gap-2">
                  <select
                    className="h-10 rounded-md border border-input bg-background px-2 text-sm text-foreground"
                    value={customer.mobileCode}
                    onChange={(e) => setCustomer({ ...customer, mobileCode: e.target.value })}
                  >
                    {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <Input value={customer.mobile} placeholder="8910xxxxxxxx" onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })} />
                </div>
              </Field>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveCustomer} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </Section>
        );

      // ── Appearance ──────────────────────────────────────────────────────────
      case "appearance":
        return (
          <Section
            icon={<Palette className="h-4 w-4 text-blue-500" />}
            title="Appearance"
            description="Customize how SumoPod looks for you"
          >
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">Theme</p>
              <div className="grid grid-cols-2 gap-4">
                {/* Light mode card */}
                <button
                  onClick={() => setDark(false)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                    !isDark
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-border bg-background hover:border-blue-200"
                  }`}
                >
                  {!isDark && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
                  )}
                  <div className="w-full h-20 rounded-lg bg-white border border-gray-200 flex flex-col gap-1.5 p-2 shadow-sm">
                    <div className="h-2 w-16 rounded bg-gray-200" />
                    <div className="h-1.5 w-12 rounded bg-gray-100" />
                    <div className="mt-auto h-6 w-full rounded bg-blue-100" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">Light Mode</span>
                  </div>
                </button>

                {/* Dark / Night mode card */}
                <button
                  onClick={() => setDark(true)}
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                    isDark
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : "border-border bg-background hover:border-blue-200"
                  }`}
                >
                  {isDark && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
                  )}
                  <div className="w-full h-20 rounded-lg bg-gray-900 border border-gray-700 flex flex-col gap-1.5 p-2 shadow-sm">
                    <div className="h-2 w-16 rounded bg-gray-700" />
                    <div className="h-1.5 w-12 rounded bg-gray-800" />
                    <div className="mt-auto h-6 w-full rounded bg-blue-900/60" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-foreground">Night Mode</span>
                  </div>
                </button>
              </div>

              <p className="text-xs text-muted-foreground pt-1">
                Your preference is saved automatically and will persist across sessions.
              </p>
            </div>
          </Section>
        );

      // ── Email Prefs ─────────────────────────────────────────────────────────
      case "email":
        return (
          <Section
            icon={<Mail className="h-4 w-4 text-blue-500" />}
            title="Email Marketing Preferences"
            description="Control what emails you receive from us"
          >
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Marketing Emails</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receive promotional emails, product updates, and special offers from SumoPod.
                </p>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => setMarketingEmails((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  marketingEmails ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    marketingEmails ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Transactional emails (invoices, billing alerts) are always sent regardless of this setting.
            </p>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Sidebar */}
        <nav className="w-52 shrink-0">
          <Card className="p-1.5">
            <CardContent className="p-0 space-y-0.5">
              {MENU.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(item.id)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 ${isActive ? "text-blue-500" : ""}`} />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardContent className="p-6 space-y-5">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Section({
  icon, title, description, children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        {icon}
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
      {children}
    </div>
  );
}
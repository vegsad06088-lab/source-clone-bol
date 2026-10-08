import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import TemplateStatus from "@/components/admin/TemplateStatus";
import ConfigEditor from "@/components/admin/ConfigEditor";
import PhotoManager from "@/components/admin/PhotoManager";
import TextEditor from "@/components/admin/TextEditor";
import BlockManager from "@/components/admin/BlockManager";
import AdminAIChat from "@/components/admin/AdminAIChat";
import { isLocal } from "@/components/admin/localApi";
import { useAuth, FullPageGuard } from "@/lib/auth/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, RefreshCw, LogOut, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface PersonRow {
  id: string;
  registration_id: string;
  vorname: string;
  familienname: string;
  geschlecht: string;
  geburtsdatum: string;
  staatsangehoerigkeit: string;
  reisedokument: string;
  dokumentennummer: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
  created_at: string;
}

interface RegistrationRow {
  id: string;
  apartment: string;
  check_in: string;
  check_out: string;
  datenschutz: boolean;
  ip_address: string;
  ort: string;
  land: string;
  created_at: string;
  persons: PersonRow[];
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [tab, setTabState] = useState(() => (isLocal && sessionStorage.getItem("adminTab")) || (isLocal ? "pages" : "registrations"));
  const setTab = (t: string) => { sessionStorage.setItem("adminTab", t); setTabState(t); };
  const [data, setData] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [supabaseAuthenticated, setSupabaseAuthenticated] = useState(false);
  const [showSupabaseLogin, setShowSupabaseLogin] = useState(false);
  const [supabaseEmail, setSupabaseEmail] = useState("");
  const [supabasePassword, setSupabasePassword] = useState("");

  // Month/year filter
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(String(now.getMonth() + 1));
  const [filterYear, setFilterYear] = useState(String(now.getFullYear()));

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user: supaUser },
      } = await supabase.auth.getUser();
      setSupabaseAuthenticated(!!supaUser);
    };
    checkAuth();
  }, []);

  const handleSupabaseLogin = async () => {
    if (!supabaseEmail || !supabasePassword) {
      toast.error("Bitte E-Mail und Passwort eingeben");
      return;
    }
    if (supabaseEmail === "user@user.com") {
      toast.error("Dieser Benutzer hat keinen Zugriff auf die Admin-Seite");
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: supabaseEmail,
        password: supabasePassword,
      });
      if (error) {
        toast.error("Supabase Auth Fehler: " + error.message);
        return;
      }
      setSupabaseAuthenticated(true);
      setShowSupabaseLogin(false);
      toast.success("Erfolgreich angemeldet");
    } catch (err) {
      toast.error("Authentifizierungsfehler");
    }
  };

  const authenticateWithSupabase = async () => {
    if (supabaseAuthenticated) return true;
    setShowSupabaseLogin(true);
    return false; // Will trigger after login
  };

  const fetchData = async () => {
    const authSuccess = await authenticateWithSupabase();
    if (!authSuccess) return;

    setLoading(true);
    try {
      const month = parseInt(filterMonth);
      const year = parseInt(filterYear);
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const endMonth = month === 12 ? 1 : month + 1;
      const endYear = month === 12 ? year + 1 : year;
      const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

      const { data: registrations, error } = await supabase
        .from("registrations")
        .select("*, persons(*)")
        .gte("check_in", startDate)
        .lt("check_in", endDate)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Fehler beim Laden: " + error.message);
        return;
      }
      setData(registrations || []);
      toast.success(`${(registrations || []).length} Registrierungen geladen`);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!supabaseAuthenticated) {
      toast.error("Bitte zuerst Daten laden, um zu authentifizieren");
      return;
    }
    if (data.length === 0) {
      toast.error("Keine Daten zum Exportieren");
      return;
    }

    const headers = [
      "Date",
      "Ort",
      "IP Address",
      "Vorname",
      "Familienname",
      "Geschlecht",
      "Geburtsdatum",
      "Staatsangehörigkeit",
      "Reisedokument",
      "Dokumentennummer",
      "Strasse",
      "Hausnummer",
      "PLZ",
      "Ort_Person",
      "Land_Person",
      "Check-In",
      "Check-Out",
      "Apartment",
      "Timestamp",
    ];

    const rows: string[][] = [];
    for (const reg of data) {
      for (const p of reg.persons || []) {
        rows.push([
          reg.created_at ? format(new Date(reg.created_at), "yyyy-MM-dd") : "",
          reg.ort || "",
          reg.ip_address || "",
          p.vorname || "",
          p.familienname || "",
          p.geschlecht || "",
          p.geburtsdatum || "",
          p.staatsangehoerigkeit || "",
          p.reisedokument || "",
          p.dokumentennummer || "",
          p.strasse || "",
          p.hausnummer || "",
          p.plz || "",
          p.ort || "",
          p.land || "",
          reg.check_in || "",
          reg.check_out || "",
          reg.apartment || "",
          reg.created_at || "",
        ]);
      }
    }

    const csvContent = [
      headers.join(","),
      ...rows
        .map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrierung-${filterYear}-${String(filterMonth).padStart(
      2,
      "0"
    )}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV heruntergeladen");
  };

  // Login screen — use secure-connect-kit FullPageGuard
  if (!user) {
    return <FullPageGuard><div className="min-h-screen" /></FullPageGuard>;
  }

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2000, i).toLocaleString("de", { month: "long" }),
  }));

  const years = Array.from({ length: 5 }, (_, i) => String(now.getFullYear() - 2 + i));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Admin{isLocal && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary align-middle">Lokaler Bearbeitungsmodus</span>}
          </h1>
          <Button variant="ghost" size="sm" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" /> Abmelden
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="flex h-auto flex-wrap justify-start">
            {isLocal && <TabsTrigger value="pages">Seiten & Einstellungen</TabsTrigger>}
            {isLocal && <TabsTrigger value="blocks">Blöcke</TabsTrigger>}
            {isLocal && <TabsTrigger value="texts">Texte</TabsTrigger>}
            {isLocal && <TabsTrigger value="photos">Fotos & PDFs</TabsTrigger>}
            {isLocal && <TabsTrigger value="ai"><Sparkles className="mr-1 inline h-3 w-3" />AI</TabsTrigger>}
            <TabsTrigger value="status">Foto-Check</TabsTrigger>
            <TabsTrigger value="registrations">Gästeregistrierungen</TabsTrigger>
          </TabsList>
          {!isLocal && (
            <p className="text-sm text-muted-foreground">
              Bearbeiten von Texten, Fotos und Einstellungen ist nur lokal möglich (<code>npm run dev</code>).
            </p>
          )}
          {isLocal && <TabsContent value="pages"><ConfigEditor /></TabsContent>}
          {isLocal && <TabsContent value="blocks"><BlockManager /></TabsContent>}
          {isLocal && <TabsContent value="texts"><TextEditor /></TabsContent>}
          {isLocal && <TabsContent value="photos"><PhotoManager /></TabsContent>}
          {isLocal && <TabsContent value="ai"><AdminAIChat /></TabsContent>}
          <TabsContent value="status"><TemplateStatus /></TabsContent>
          <TabsContent value="registrations" className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <Label>Monat</Label>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Jahr</Label>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={fetchData} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Daten laden
          </Button>
          <Button variant="outline" onClick={downloadCSV} className="gap-2">
            <Download className="w-4 h-4" /> CSV Download
          </Button>
        </div>

        {/* Data table */}
        {data.length > 0 ? (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apartment</TableHead>
                  <TableHead>Check-In</TableHead>
                  <TableHead>Check-Out</TableHead>
                  <TableHead>Gäste</TableHead>
                  <TableHead>Registriert am</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">
                      {reg.apartment || "–"}
                    </TableCell>
                    <TableCell>{reg.check_in}</TableCell>
                    <TableCell>{reg.check_out}</TableCell>
                    <TableCell>
                      {(reg.persons || []).map((p, i) => (
                        <div key={p.id || i} className="text-sm">
                          {p.vorname} {p.familienname} ({p.staatsangehoerigkeit})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {reg.created_at
                        ? format(new Date(reg.created_at), "dd.MM.yyyy HH:mm")
                        : ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-12">
            Keine Daten geladen. Wähle Monat/Jahr und klicke „Daten laden".
          </p>
        )}

          </TabsContent>
        </Tabs>

        {/* Supabase login form */}
        {showSupabaseLogin && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-card rounded-lg shadow-lg border border-border p-6 max-w-sm w-full">
              <h2 className="text-lg font-bold text-foreground mb-4">
                Supabase Anmeldung
              </h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>E-Mail</Label>
                  <Input
                    type="email"
                    value={supabaseEmail}
                    onChange={(e) => setSupabaseEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Passwort</Label>
                  <Input
                    type="password"
                    value={supabasePassword}
                    onChange={(e) => setSupabasePassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setShowSupabaseLogin(false)}
                    variant="outline"
                  >
                    Abbrechen
                  </Button>
                  <Button onClick={handleSupabaseLogin}>
                    Anmelden
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { buildRegistrationPayload } from "@/lib/registrationPayload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── i18n labels ──────────────────────────────────────────────
const labels: Record<string, Record<string, string>> = {
  de: {
    pageTitle: "Digitale Gästeregistrierung",
    pageIntro:
      "Willkommen in Wien! Damit dein Aufenthalt offiziell registriert wird, bitten wir dich, dieses Formular auszufüllen. Die Gästeregistrierung ist eine gesetzliche Vorgabe der Stadt Wien und dauert nur wenige Minuten. Deine Daten werden sicher übermittelt und ausschließlich für behördliche Zwecke verwendet.",
    bullet1: "Schnell & unkompliziert",
    bullet2: "Gesetzlich vorgeschrieben für alle Gäste",
    bullet3: "Sichere und verschlüsselte Übermittlung",
    step: "Schritt",
    step1Title: "Persönliche Angaben für die Registrierung",
    step1Desc: "Bitte trage hier Deine Daten ein.",
    step2Title: "Deine Heimatadresse & Aufenthaltsdetails",
    step2Desc:
      "Bitte gib hier deine Wohnadresse (Hauptwohnsitz) an, NICHT DIE ADRESSE DES APARTMENTS.",
    step3Title: "Angaben zur 2. Person (falls vorhanden)",
    step3Desc:
      'Falls eine weitere Person mit Dir reist, trage bitte deren Daten hier ein. Falls nicht, klicke einfach auf \u201EWeiter\u201C.',
    step4Title: "Angaben zur 3. Person (falls vorhanden)",
    step4Desc:
      'Falls Du mit einer dritten Person reist, gib hier bitte die entsprechenden Informationen ein. Falls nicht, klicke einfach auf \u201ERegistrieren\u201C.',
    vorname: "Vorname",
    familienname: "Familienname",
    geschlecht: "Geschlecht",
    selectPlaceholder: "Bitte auswählen...",
    maennlich: "Männlich",
    weiblich: "Weiblich",
    divers: "Divers",
    keineAngaben: "Keine Angaben",
    email: "E-Mail",
    geburtsdatum: "Geburtsdatum",
    staatsangehoerigkeit: "Staatsangehörigkeit",
    reisedokument: "Reisedokument",
    reisepass: "Reisepass",
    personalausweis: "Personalausweis",
    dokumentennummer: "Dokumentennummer",
    strasse: "Straße",
    hausnummer: "Hausnummer",
    plz: "PLZ",
    ort: "Ort",
    land: "Land",
    checkIn: "Check-In Datum",
    checkOut: "Check-Out Datum",
    weiter: "Weiter",
    zurueck: "Zurück",
    registrieren: "Registrieren",
    datenschutz:
      "Ich habe die Datenschutzerklärung zur Kenntnis genommen",
    datenschutzLink: "Datenschutzerklärung",
    datenschutzHint: "Bitte bestätige den Datenschutz und drücke auf REGISTRIEREN",
    successTitle: "🎉 Danke für deine Registrierung!",
    successBody:
      "Schön, dass du da bist – wir freuen uns, dich bei uns in Wien willkommen zu heißen! Als kleines Dankeschön bekommst du bei deiner nächsten Buchung über unsere Website einen 10 € Gutschein geschenkt.",
    successCode: "Gutscheincode: APP10",
    successCta:
      "Einfach auf www.ap-zur-quelle.at direkt buchen und den Code im Buchungsformular eingeben.",
    successOutro: "Bis bald & einen wunderbaren Aufenthalt! Dein Apartments zur Quelle – Team",
    pickDate: "Datum wählen",
    pflichtfeld: "Dieses Feld ist erforderlich",
    telefon: "Telefonnummer",
  },
  en: {
    pageTitle: "Digital Guest Registration",
    pageIntro:
      "Welcome to Vienna! To officially register your stay, we ask you to fill out this form. Guest registration is a legal requirement of the City of Vienna and only takes a few minutes. Your data is transmitted securely and used exclusively for official purposes.",
    bullet1: "Quick & easy",
    bullet2: "Legally required for all guests",
    bullet3: "Secure and encrypted transmission",
    step: "Step",
    step1Title: "Personal information for registration",
    step1Desc: "Please enter your details here.",
    step2Title: "Your home address & stay details",
    step2Desc:
      "Please enter your home address (primary residence), NOT THE APARTMENT ADDRESS.",
    step3Title: "Details for 2nd person (if applicable)",
    step3Desc:
      "If another person is traveling with you, please enter their details here. If not, simply click 'Next'.",
    step4Title: "Details for 3rd person (if applicable)",
    step4Desc:
      "If you are traveling with a third person, please enter their information here. If not, simply click 'Register'.",
    vorname: "First name",
    familienname: "Last name",
    geschlecht: "Gender",
    selectPlaceholder: "Please select...",
    maennlich: "Male",
    weiblich: "Female",
    divers: "Diverse",
    keineAngaben: "Prefer not to say",
    email: "Email",
    geburtsdatum: "Date of birth",
    staatsangehoerigkeit: "Nationality",
    reisedokument: "Travel document",
    reisepass: "Passport",
    personalausweis: "ID card",
    dokumentennummer: "Document number",
    strasse: "Street",
    hausnummer: "House number",
    plz: "Postal code",
    ort: "City",
    land: "Country",
    checkIn: "Check-in date",
    checkOut: "Check-out date",
    weiter: "Next",
    zurueck: "Back",
    registrieren: "Register",
    datenschutz: "I have read the Privacy Policy",
    datenschutzLink: "Privacy Policy",
    datenschutzHint: "Please confirm the privacy policy and press REGISTER",
    successTitle: "🎉 Thank you for your registration!",
    successBody:
      "Great to have you – we look forward to welcoming you in Vienna! As a small thank-you, you'll receive a €10 voucher for your next booking through our website.",
    successCode: "Voucher code: APP10",
    successCta:
      "Simply book directly at www.ap-zur-quelle.at and enter the code in the booking form.",
    successOutro: "See you soon & enjoy your stay! Your Apartments zur Quelle Team",
    pickDate: "Pick a date",
    pflichtfeld: "This field is required",
    telefon: "Phone number",
  },
  sq: {
    pageTitle: "Regjistrimi Dixhital i Mysafirëve",
    pageIntro:
      "Mirësevini në Vjenë! Për të regjistruar zyrtarisht qëndrimin tuaj, ju lutemi plotësoni këtë formular. Regjistrimi i mysafirëve është kërkesë ligjore e Qytetit të Vjenës dhe zgjat vetëm disa minuta.",
    bullet1: "E shpejtë & e thjeshtë",
    bullet2: "E detyrueshme ligjërisht për të gjithë mysafirët",
    bullet3: "Transmetim i sigurt dhe i koduar",
    step: "Hapi",
    step1Title: "Të dhënat personale për regjistrimin",
    step1Desc: "Ju lutemi vendosni të dhënat tuaja këtu.",
    step2Title: "Adresa juaj & detajet e qëndrimit",
    step2Desc: "Ju lutemi vendosni adresën tuaj të shtëpisë (vendbanimi kryesor).",
    step3Title: "Të dhënat e personit të 2-të (nëse ka)",
    step3Desc: "Nëse dikush tjetër udhëton me ju, vendosni të dhënat e tyre këtu.",
    step4Title: "Të dhënat e personit të 3-të (nëse ka)",
    step4Desc: "Nëse udhëtoni me një person të tretë, vendosni informacionin këtu.",
    vorname: "Emri",
    familienname: "Mbiemri",
    geschlecht: "Gjinia",
    selectPlaceholder: "Ju lutemi zgjidhni...",
    maennlich: "Mashkull",
    weiblich: "Femër",
    divers: "Diverse",
    keineAngaben: "Pa përgjigjie",
    email: "Email",
    geburtsdatum: "Data e lindjes",
    staatsangehoerigkeit: "Shtetësia",
    reisedokument: "Dokumenti i udhëtimit",
    reisepass: "Pasaportë",
    personalausweis: "Kartë identiteti",
    dokumentennummer: "Numri i dokumentit",
    strasse: "Rruga",
    hausnummer: "Numri i shtëpisë",
    plz: "Kodi postar",
    ort: "Qyteti",
    land: "Shteti",
    checkIn: "Data e Check-In",
    checkOut: "Data e Check-Out",
    weiter: "Vazhdo",
    zurueck: "Kthehu",
    registrieren: "Regjistrohu",
    datenschutz: "Kam lexuar Politikën e Privatësisë",
    datenschutzLink: "Politika e Privatësisë",
    datenschutzHint: "Ju lutemi konfirmoni privatësinë dhe shtypni REGJISTROHU",
    successTitle: "🎉 Faleminderit për regjistrimin tuaj!",
    successBody:
      "Na gëzon që jeni këtu – presim t'ju mirëpresim në Vjenë! Si falënderim, do të merrni një kupon 10 € për rezervimin tuaj të ardhshëm.",
    successCode: "Kodi i kuponit: APP10",
    successCta: "Rezervoni drejtpërdrejt në www.ap-zur-quelle.at dhe vendosni kodin.",
    successOutro: "Shihemi së shpejti! Ekipi juaj Apartments zur Quelle",
    pickDate: "Zgjidhni datën",
    pflichtfeld: "Kjo fushë kërkohet",
    telefon: "Numri i telefonit",
  },
};

// ── Types ────────────────────────────────────────────────────
interface PersonData {
  vorname: string;
  familienname: string;
  geschlecht: string;
  geburtsdatum: Date | undefined;
  staatsangehoerigkeit: string;
  reisedokument: string;
  dokumentennummer: string;
  email: string;
  telefon: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
  land: string;
}

const emptyPerson: PersonData = {
  vorname: "",
  familienname: "",
  geschlecht: "",
  geburtsdatum: undefined,
  staatsangehoerigkeit: "",
  reisedokument: "",
  dokumentennummer: "",
  email: "",
  telefon: "",
  strasse: "",
  hausnummer: "",
  plz: "",
  ort: "",
  land: "",
};

// ── Component ────────────────────────────────────────────────
export default function RegistrierungPage() {
  const { lang } = useI18n();
  const t = labels[lang] || labels["de"];
  const calendarLocale = lang === "de" ? de : enUS;

  const [searchParams] = useSearchParams();
  const apartment = searchParams.get("TOP") || null;

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [datenschutz, setDatenschutz] = useState(false);

  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();

  const [person1, setPerson1] = useState<PersonData>({ ...emptyPerson });
  const [person2, setPerson2] = useState<PersonData>({ ...emptyPerson });
  const [person3, setPerson3] = useState<PersonData>({ ...emptyPerson });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const validateStep1 = () => {
    const errs: Record<string, boolean> = {};
    if (!person1.vorname.trim()) errs["p1_vorname"] = true;
    if (!person1.familienname.trim()) errs["p1_familienname"] = true;
    if (!person1.geschlecht) errs["p1_geschlecht"] = true;
    if (!person1.geburtsdatum) errs["p1_geburtsdatum"] = true;
    if (!person1.staatsangehoerigkeit.trim()) errs["p1_staatsangehoerigkeit"] = true;
    if (!person1.reisedokument) errs["p1_reisedokument"] = true;
    if (!person1.dokumentennummer.trim()) errs["p1_dokumentennummer"] = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, boolean> = {};
    if (!person1.strasse.trim()) errs["p1_strasse"] = true;
    if (!person1.hausnummer.trim()) errs["p1_hausnummer"] = true;
    if (!person1.plz.trim()) errs["p1_plz"] = true;
    if (!person1.ort.trim()) errs["p1_ort"] = true;
    if (!person1.land.trim()) errs["p1_land"] = true;
    if (!checkInDate) errs["checkIn"] = true;
    if (!checkOutDate) errs["checkOut"] = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep((s) => Math.min(s + 1, 4));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const [submitting, setSubmitting] = useState(false);

  const autoAuthenticate = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@user.com',
      password: 'useruser',
    });

    if (error) {
      console.error('Auth failed:', error.message);
      throw new Error('Authentication failed');
    } else {
      console.log('Authenticated automatically:', data.session);
    }
  };

  const handleSubmit = async () => {
    if (!datenschutz) {
      toast.error(t.datenschutzHint);
      return;
    }

    if (!checkInDate || !checkOutDate || !person1.ort.trim() || !person1.land.trim()) {
      toast.error(t.pflichtfeld);
      return;
    }

    setSubmitting(true);

    try {
      // Automatic authentication
      await autoAuthenticate();

      // Get user IP (best effort)
      let ipAddress: string | undefined;
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ipAddress = ipData.ip || undefined;
      } catch {
        // silently ignore
      }

      const payload = buildRegistrationPayload({
        apartment,
        checkInDate,
        checkOutDate,
        datenschutz,
        userIp: ipAddress,
        userOrt: person1.ort.trim(),
        userLand: person1.land.trim(),
      });

      console.log("Payload being sent:", payload);

      // 1) Insert registration
      const { data: regData, error: regError } = await supabase
        .from('registrations')
        .insert(payload)
        .select();

      if (regError) {
        toast.error("Fehler: " + regError.message);
        setSubmitting(false);
        return;
      }

      const registrationId = regData[0].id;

      // 2) Build persons array
      const personsToInsert = [];

      const mapPerson = (p: PersonData) => ({
        registration_id: registrationId,
        vorname: p.vorname.trim(),
        familienname: p.familienname.trim(),
        geschlecht: p.geschlecht,
        geburtsdatum: p.geburtsdatum ? format(p.geburtsdatum, "yyyy-MM-dd") : null,
        staatsangehoerigkeit: p.staatsangehoerigkeit,
        reisedokument: p.reisedokument,
        dokumentennummer: p.dokumentennummer,
        strasse: p.strasse || null,
        hausnummer: p.hausnummer || null,
        plz: p.plz || null,
        ort: p.ort || null,
        land: p.land || null,
      });

      personsToInsert.push(mapPerson(person1));

      if (person2.vorname.trim() && person2.familienname.trim()) {
        personsToInsert.push(mapPerson(person2));
      }
      if (person3.vorname.trim() && person3.familienname.trim()) {
        personsToInsert.push(mapPerson(person3));
      }

      // 3) Insert persons
      const { error: persError } = await supabase
        .from('persons')
        .insert(personsToInsert);

      if (persError) {
        toast.error("Fehler bei Personen: " + persError.message);
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      toast.error("Fehler: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reusable field renderers ──────────────────────────────
  const updatePerson = (
    setter: React.Dispatch<React.SetStateAction<PersonData>>,
    field: keyof PersonData,
    value: string | Date | undefined
  ) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const renderTextField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    errorKey?: string,
    placeholder?: string,
    type = "text"
  ) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label} *</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className={cn(
          "bg-background border-input",
          errorKey && errors[errorKey] && "border-destructive"
        )}
      />
      {errorKey && errors[errorKey] && (
        <p className="text-xs text-destructive">{t.pflichtfeld}</p>
      )}
    </div>
  );

  const renderOptionalTextField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder?: string,
    type = "text"
  ) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || label}
        className="bg-background border-input"
      />
    </div>
  );

  const renderSelect = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    options: { value: string; label: string }[],
    errorKey?: string
  ) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label} *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "bg-background border-input",
            errorKey && errors[errorKey] && "border-destructive"
          )}
        >
          <SelectValue placeholder={t.selectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errorKey && errors[errorKey] && (
        <p className="text-xs text-destructive">{t.pflichtfeld}</p>
      )}
    </div>
  );

  const renderDatePicker = (
    label: string,
    value: Date | undefined,
    onChange: (d: Date | undefined) => void,
    errorKey?: string
  ) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">{label} *</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-background border-input",
              !value && "text-muted-foreground",
              errorKey && errors[errorKey] && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP", { locale: calendarLocale }) : t.pickDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            locale={calendarLocale}
            className="p-3 pointer-events-auto"
            captionLayout="dropdown-buttons"
            fromYear={1920}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>
      {errorKey && errors[errorKey] && (
        <p className="text-xs text-destructive">{t.pflichtfeld}</p>
      )}
    </div>
  );

  const genderOptions = [
    { value: "Männlich", label: t.maennlich },
    { value: "Weiblich", label: t.weiblich },
    { value: "Divers", label: t.divers },
    { value: "Keine Angaben", label: t.keineAngaben },
  ];

  const docOptions = [
    { value: "Reisepass", label: t.reisepass },
    { value: "Personalausweis", label: t.personalausweis },
  ];

  // ── Person form (Step 1 = main, Step 3/4 = additional) ───
  const renderPersonFields = (
    person: PersonData,
    setter: React.Dispatch<React.SetStateAction<PersonData>>,
    prefix: string,
    isMain: boolean,
    showAddress: boolean
  ) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderTextField(t.vorname, person.vorname, (v) => updatePerson(setter, "vorname", v), isMain ? `${prefix}_vorname` : undefined)}
        {renderTextField(t.familienname, person.familienname, (v) => updatePerson(setter, "familienname", v), isMain ? `${prefix}_familienname` : undefined)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderSelect(t.geschlecht, person.geschlecht, (v) => updatePerson(setter, "geschlecht", v), genderOptions, isMain ? `${prefix}_geschlecht` : undefined)}
        {isMain
          ? renderOptionalTextField(t.email, person.email, (v) => updatePerson(setter, "email", v), "email@example.com", "email")
          : renderDatePicker(t.geburtsdatum, person.geburtsdatum, (v) => updatePerson(setter, "geburtsdatum", v))
        }
      </div>
      {isMain && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderDatePicker(t.geburtsdatum, person.geburtsdatum, (v) => updatePerson(setter, "geburtsdatum", v), `${prefix}_geburtsdatum`)}
          {renderTextField(t.staatsangehoerigkeit, person.staatsangehoerigkeit, (v) => updatePerson(setter, "staatsangehoerigkeit", v), `${prefix}_staatsangehoerigkeit`)}
        </div>
      )}
      {!isMain && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderTextField(t.staatsangehoerigkeit, person.staatsangehoerigkeit, (v) => updatePerson(setter, "staatsangehoerigkeit", v))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderSelect(t.reisedokument, person.reisedokument, (v) => updatePerson(setter, "reisedokument", v), docOptions, isMain ? `${prefix}_reisedokument` : undefined)}
        {renderTextField(t.dokumentennummer, person.dokumentennummer, (v) => updatePerson(setter, "dokumentennummer", v), isMain ? `${prefix}_dokumentennummer` : undefined)}
      </div>

      {showAddress && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderOptionalTextField(t.strasse, person.strasse, (v) => updatePerson(setter, "strasse", v))}
            {renderOptionalTextField(t.hausnummer, person.hausnummer, (v) => updatePerson(setter, "hausnummer", v))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderOptionalTextField(t.plz, person.plz, (v) => updatePerson(setter, "plz", v))}
            {renderOptionalTextField(t.ort, person.ort, (v) => updatePerson(setter, "ort", v))}
            {renderOptionalTextField(t.land, person.land, (v) => updatePerson(setter, "land", v))}
          </div>
        </>
      )}
    </div>
  );

  // ── Progress bar ──────────────────────────────────────────
  const ProgressBar = () => (
    <div className="flex gap-2 mb-6">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            s <= step ? "bg-primary" : "bg-muted"
          )}
        />
      ))}
    </div>
  );

  // ── Success screen ────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto text-center space-y-6 bg-card rounded-2xl p-8 shadow-lg border border-border">
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">{t.successTitle}</h2>
          <p className="text-muted-foreground">{t.successBody}</p>
          <p className="text-lg font-semibold text-primary">💡 {t.successCode}</p>
          <p className="text-sm text-muted-foreground">{t.successCta}</p>
          <p className="text-sm font-medium text-foreground">{t.successOutro}</p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {/* Hero section with background */}
      <section
        className="relative w-full py-20 flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://cdn.prod.website-files.com/6515f2606ac654c52d9c4bfa/6515f2606ac654c52d9c4d15_hero-bg-rental-cabin-rental-webflow-ecommerce-template.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-white space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold font-serif">{t.pageTitle}</h1>
          <p className="text-sm md:text-base opacity-90 leading-relaxed">{t.pageIntro}</p>
          <ul className="space-y-1 text-sm">
            <li>🔹 {t.bullet1}</li>
            <li>🔹 {t.bullet2}</li>
            <li>🔹 {t.bullet3}</li>
          </ul>
        </div>
      </section>

      {/* Form card */}
      <section className="max-w-2xl mx-auto -mt-8 px-4 pb-16 relative z-20">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8">
          <ProgressBar />

          <p className="text-sm font-semibold text-primary mb-1">
            {t.step} {step}/4
          </p>

          {/* Step 1: Personal data */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t.step1Title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t.step1Desc}</p>
              </div>
              {renderPersonFields(person1, setPerson1, "p1", true, false)}
              <div className="flex justify-end">
                <Button onClick={next} className="gap-2">
                  {t.weiter} <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Address + stay */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t.step2Title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t.step2Desc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderTextField(t.strasse, person1.strasse, (v) => updatePerson(setPerson1, "strasse", v), "p1_strasse")}
                {renderTextField(t.hausnummer, person1.hausnummer, (v) => updatePerson(setPerson1, "hausnummer", v), "p1_hausnummer")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {renderTextField(t.plz, person1.plz, (v) => updatePerson(setPerson1, "plz", v), "p1_plz")}
                {renderTextField(t.ort, person1.ort, (v) => updatePerson(setPerson1, "ort", v), "p1_ort")}
                {renderTextField(t.land, person1.land, (v) => updatePerson(setPerson1, "land", v), "p1_land")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderDatePicker(t.checkIn, checkInDate, setCheckInDate, "checkIn")}
                {renderDatePicker(t.checkOut, checkOutDate, setCheckOutDate, "checkOut")}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={back} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> {t.zurueck}
                </Button>
                <Button onClick={next} className="gap-2">
                  {t.weiter} <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Person 2 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t.step3Title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t.step3Desc}</p>
              </div>
              {renderPersonFields(person2, setPerson2, "p2", false, true)}
              <div className="flex justify-between">
                <Button variant="outline" onClick={back} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> {t.zurueck}
                </Button>
                <Button onClick={next} className="gap-2">
                  {t.weiter} <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Person 3 + Datenschutz */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t.step4Title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t.step4Desc}</p>
              </div>
              {renderPersonFields(person3, setPerson3, "p3", false, true)}

              <div className="flex items-start gap-3 pt-4 border-t border-border">
                <Checkbox
                  id="datenschutz"
                  checked={datenschutz}
                  onCheckedChange={(v) => setDatenschutz(v === true)}
                />
                <label htmlFor="datenschutz" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  {t.datenschutz.split(t.datenschutzLink)[0]}
                  <Link
                    to={`/${lang}/datenschutz`}
                    className="text-primary underline hover:text-primary/80"
                    target="_blank"
                  >
                    {t.datenschutzLink}
                  </Link>
                  {t.datenschutz.split(t.datenschutzLink)[1]}
                </label>
              </div>

              <p className="text-xs text-muted-foreground">{t.datenschutzHint}</p>

              <div className="flex justify-between">
                <Button variant="outline" onClick={back} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> {t.zurueck}
                </Button>
                <Button onClick={handleSubmit} disabled={submitting || !datenschutz} className="gap-2">
                  {submitting ? "..." : t.registrieren} <CheckCircle2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

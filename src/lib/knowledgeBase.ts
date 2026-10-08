// Knowledge Base for the Chatbot
// Each entry has keywords (for matching) and content (the answer in multiple languages).

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  content: Record<string, string>; // lang code -> answer
  category?: string;
}

export const knowledgeBase: KnowledgeEntry[] = [
  // ===== CHECK-IN =====
  {
    id: "checkin",
    keywords: ["check-in", "checkin", "einchecken", "anreise", "arrival", "ankommen", "schlüssel", "key", "schlüsselbox", "keybox", "self-check-in", "eintrittscode", "code", "tastatur", "keypad", "türknauf"],
    content: {
      de: "Der Self-Check-in erfolgt ab 15:00 Uhr. Links neben der Eingangstür findest Du eine Tastatur für den Eintrittscode. Drücke zuerst die Einschalttaste, gib dann den Code ein. Bei korrektem Code leuchtet ein roter Punkt und Du kannst die Tür öffnen (Türknauf nach links drehen). Nimm den Aufzug zu Deinem Stockwerk. Neben der Apartment-Tür ist eine Schlüsselbox – Code eingeben und Hebel nach unten drücken. Den Code erhältst Du per E-Mail vor Deiner Anreise. Eine detaillierte Anleitung findest Du unter Anleitungen > Check-In Anleitung.",
      en: "Self-check-in is available from 3:00 PM. You will find a keypad to the left of the entrance door. First press the power button, then enter the code. If correct, a red dot lights up and you can open the door (turn the knob to the left). Take the elevator to your floor. Next to your apartment door is a key box – enter the code and press the lever down. You will receive the code by email before your arrival. A detailed guide is available under Instructions > Check-In Guide.",
    },
    category: "apartments",
  },
  // ===== CHECK-OUT =====
  {
    id: "checkout",
    keywords: ["check-out", "checkout", "auschecken", "abreise", "departure", "abreisen", "verlassen", "leave"],
    content: {
      de: "Check-out ist bis 10:00 Uhr. Wir hoffen, Du hattest einen angenehmen Aufenthalt! Bitte hinterlasse die Schlüssel in der Schlüsselbox vor dem Apartment. Eine detaillierte Anleitung findest Du unter Anleitungen > Check-Out Anleitung.",
      en: "Check-out is by 10:00 AM. We hope you had a pleasant stay! Please leave the keys in the key box next to your apartment. A detailed guide is available under Instructions > Check-Out Guide.",
    },
    category: "apartments",
  },
  // ===== PARKING =====
  {
    id: "parking",
    keywords: ["parken", "parking", "parkplatz", "auto", "car", "garage", "stellplatz", "tiefgarage", "parkmöglichkeiten", "parking options"],
    content: {
      de: "Parken leicht gemacht: Unsere Tiefgarage und nahegelegene öffentliche Parkplätze bieten Dir flexible Optionen für Deinen Aufenthalt. Kostenlose Parkplätze stehen direkt vor dem Haus zur Verfügung (keine Reservierung nötig). Weitere Details findest Du unter Anleitungen > Parkmöglichkeiten.",
      en: "Parking made easy: Our underground car park and nearby public parking spaces offer you flexible options for your stay. Free parking spaces are available directly in front of the building (no reservation needed). More details can be found under Instructions > Parking Options.",
    },
    category: "location",
  },
  // ===== WIFI =====
  {
    id: "wifi",
    keywords: ["wifi", "wlan", "internet", "passwort", "password", "netzwerk", "network"],
    content: {
      de: "Kostenloses WLAN ist in allen Apartments verfügbar. Die Zugangsdaten findest Du in der Willkommensmappe im Apartment.",
      en: "Free WiFi is available in all apartments. You can find the access details in the welcome folder in the apartment.",
    },
    category: "apartments",
  },
  // ===== PETS =====
  {
    id: "pets",
    keywords: ["haustier", "hund", "katze", "tier", "pet", "dog", "cat", "animal"],
    content: {
      de: "Haustiere sind nach vorheriger Absprache willkommen. Bitte gib dies bei der Buchung an.",
      en: "Pets are welcome by prior arrangement. Please mention this when booking.",
    },
    category: "apartments",
  },
  // ===== CONTACT =====
  {
    id: "kontakt",
    keywords: ["kontakt", "contact", "telefon", "phone", "email", "e-mail", "erreichen", "reach", "ansprechpartner", "schreiben", "anrufen", "write", "call"],
    content: {
      de: "Du kannst uns wie folgt erreichen:\n📧 E-Mail: info@ap-zur-quelle.at\n📞 Telefon: +43 676 842 287 105\n📍 Adresse: Absberggasse 6, 1100 Wien\nAlternativ nutze unser Kontaktformular auf der Kontakt-Seite.",
      en: "You can reach us as follows:\n📧 Email: info@ap-zur-quelle.at\n📞 Phone: +43 676 842 287 105\n📍 Address: Absberggasse 6, 1100 Vienna\nAlternatively, use our contact form on the Contact page.",
    },
    category: "general",
  },
  // ===== BOOKING =====
  {
    id: "buchung",
    keywords: ["buchen", "buchung", "reservieren", "reservierung", "booking", "reserve", "verfügbarkeit", "availability", "book"],
    content: {
      de: "Buchungen können direkt über unsere Webseite oder über gängige Buchungsplattformen vorgenommen werden. Nutze den Buchungsbereich auf der Startseite, um Verfügbarkeit zu prüfen und direkt zu buchen.",
      en: "Bookings can be made directly through our website or via common booking platforms. Use the booking section on the homepage to check availability and book directly.",
    },
    category: "general",
  },
  // ===== KITCHEN =====
  {
    id: "küche",
    keywords: ["küche", "kitchen", "kochen", "cook", "herd", "stove", "ceranfeld", "cooktop", "geschirr", "dishes", "ausstattung", "equipment", "induktion", "induction", "induktionskochplatte"],
    content: {
      de: "Alle Apartments verfügen über eine voll ausgestattete Küche mit Induktionskochplatte, Kühlschrank, Geschirrspüler und allem notwendigen Geschirr. Eine Anleitung zur Induktionskochplatte findest Du unter Anleitungen > Anleitung Induktionskochplatte.",
      en: "All apartments have a fully equipped kitchen with an induction cooktop, refrigerator, dishwasher, and all necessary dishes. Instructions for the induction cooktop can be found under Instructions > Induction Cooktop Guide.",
    },
    category: "apartments",
  },
  // ===== LOCATION =====
  {
    id: "lage",
    keywords: ["lage", "location", "umgebung", "surroundings", "wo", "where", "adresse", "address", "ort", "wien", "vienna"],
    content: {
      de: "Die Apartments zur Quelle befinden sich in der Absberggasse 6, 1100 Wien – in einer ruhigen Lage mit guter Anbindung an öffentliche Verkehrsmittel und Sehenswürdigkeiten.",
      en: "Apartments zur Quelle are located at Absberggasse 6, 1100 Vienna – in a quiet area with good connections to public transport and attractions.",
    },
    category: "location",
  },
  // ===== CHILDREN =====
  {
    id: "kinder",
    keywords: ["kinder", "children", "kids", "baby", "kinderbett", "crib", "hochstuhl", "highchair", "familie", "family", "kindern", "familienfreundlich"],
    content: {
      de: "Kinderbetten und Hochstühle sind auf Anfrage verfügbar. Bitte teile uns Deinen Bedarf bei der Buchung mit. Tipps für familienfreundliche Ausflüge in Wien findest Du unter Anleitungen > Mit Kindern Wien entdecken.",
      en: "Cribs and high chairs are available upon request. Please let us know your needs when booking. Tips for family-friendly activities in Vienna can be found under Instructions > Discover Vienna with Kids.",
    },
    category: "apartments",
  },
  // ===== LUGGAGE STORAGE BEFORE CHECK-IN =====
  {
    id: "gepaeck_vor_checkin",
    keywords: ["gepäck", "luggage", "koffer", "aufbewahrung", "storage", "vor check-in", "before check-in", "gepäckaufbewahrung", "lagern", "store"],
    content: {
      de: "Wir bieten Dir gerne die Möglichkeit, Dein Gepäck bei uns sicher aufzubewahren, falls Dein Apartment noch nicht bezugsfertig ist. Details findest Du unter Anleitungen > Gepäckaufbewahrung vor dem Check-In.",
      en: "We are happy to offer you the option to safely store your luggage with us if your apartment is not yet ready. Details can be found under Instructions > Luggage Storage Before Check-In.",
    },
    category: "apartments",
  },
  // ===== LUGGAGE STORAGE AFTER CHECK-OUT =====
  {
    id: "gepaeck_nach_checkout",
    keywords: ["gepäck nach", "luggage after", "nach check-out", "after check-out", "gepäck lassen", "leave luggage"],
    content: {
      de: "Du kannst Dein Gepäck gerne nach dem Check-Out bei uns lassen. Details findest Du unter Anleitungen > Gepäckaufbewahrung nach dem Check-Out.",
      en: "You are welcome to leave your luggage with us after check-out. Details can be found under Instructions > Luggage Storage After Check-Out.",
    },
    category: "apartments",
  },
  // ===== PUBLIC TRANSPORT =====
  {
    id: "transport",
    keywords: ["öffentliche", "verkehrsmittel", "public transport", "transportation", "u-bahn", "metro", "bus", "tram", "straßenbahn", "bahn", "train", "wiener linien"],
    content: {
      de: "Wien bietet ein ausgezeichnetes Netz an öffentlichen Verkehrsmitteln, das Dir ermöglicht, Dich schnell und bequem in der Stadt zu bewegen. Details findest Du unter Anleitungen > Öffentliche Verkehrsmittel in Wien.",
      en: "Vienna offers an excellent network of public transport, which allows you to move around the city quickly and easily. Details can be found under Instructions > Public Transportation in Vienna.",
    },
    category: "location",
  },
  // ===== HEATING =====
  {
    id: "heizung",
    keywords: ["heizung", "heating", "thermostat", "temperatur", "temperature", "warm", "kalt", "cold", "heizen", "wärme"],
    content: {
      de: "Die Heizung wird über einen programmierbaren Raumthermostat (TPOne) gesteuert. Du kannst Komfortmodi wählen: Anwesend, Abwesend, Schlafend. Die Temperaturen lassen sich im Benutzermenü einstellen. Eine detaillierte Anleitung mit Bildern findest Du unter Anleitungen > Anleitung zur Steuerung der Heizung (auch als PDF zum Download).",
      en: "The heating is controlled via a programmable room thermostat (TPOne). You can choose comfort modes: Home, Away, Asleep. Temperatures can be adjusted in the user menu. A detailed guide with images is available under Instructions > Heating Control Instructions (also available as PDF download).",
    },
    category: "apartments",
  },
  // ===== TV =====
  {
    id: "tv",
    keywords: ["tv", "fernseher", "television", "fernsehen", "fernbedienung", "remote", "programm", "sender", "channel"],
    content: {
      de: "Eine einfache Schritt-für-Schritt-Anleitung zur Nutzung des TVs findest Du unter Anleitungen > Anleitung TV (auch als PDF zum Download).",
      en: "Simple step-by-step instructions for using the TV can be found under Instructions > TV Instructions (also available as PDF download).",
    },
    category: "apartments",
  },
  // ===== IRON =====
  {
    id: "bugeleisen",
    keywords: ["bügeleisen", "bügelbrett", "iron", "ironing", "bügeln", "ironing board"],
    content: {
      de: "Das Bügeleisen und Bügelbrett befinden sich im Erdgeschoss. Folge den Anweisungen unter Anleitungen > Bügeleisen & Bügelbrett für die sichere Nutzung (auch als PDF zum Download).",
      en: "The iron and ironing board are located on the ground floor. Follow the instructions under Instructions > Iron & Ironing Board for safe use (also available as PDF download).",
    },
    category: "apartments",
  },
  // ===== ANLEITUNGEN OVERVIEW =====
  {
    id: "anleitungen",
    keywords: ["anleitung", "anleitungen", "instructions", "guide", "guides", "hilfe", "help", "tipps", "tips", "how to"],
    content: {
      de: "Unter dem Menüpunkt 'Anleitungen' findest Du alle wichtigen Informationen für Deinen Aufenthalt: Check-In/Check-Out Anleitungen, Parkmöglichkeiten, Öffentliche Verkehrsmittel, Gepäckaufbewahrung, Heizung, TV, Bügeleisen, Induktionskochplatte und Tipps für Wien mit Kindern.",
      en: "Under the 'Instructions' menu, you'll find all important information for your stay: Check-In/Check-Out guides, Parking options, Public transportation, Luggage storage, Heating, TV, Iron, Induction cooktop and tips for Vienna with kids.",
    },
    category: "general",
  },
  // ===== APARTMENTS OVERVIEW =====
  {
    id: "apartments_overview",
    keywords: ["apartment", "apartments", "wohnung", "wohnungen", "zimmer", "room", "rooms", "unterkunft", "accommodation", "typen", "types"],
    content: {
      de: "Wir bieten 19 Zimmer in 4 Apartment-Typen an:\n• Twin Harmony Suite (35m², 1-2 Personen, ab €50/Nacht)\n• Duo Deluxe Studio (35m², 1-2 Personen, ab €50/Nacht)\n• Cosy Couple Nest (25m², 1-2 Personen, ab €40/Nacht)\n• Trio Harmony Suite (55m², 1-3 Personen, ab €65/Nacht)\nAlle Apartments sind voll ausgestattet mit Küche, WLAN und allem was Du brauchst.",
      en: "We offer 19 rooms in 4 apartment types:\n• Twin Harmony Suite (35m², 1-2 persons, from €50/night)\n• Duo Deluxe Studio (35m², 1-2 persons, from €50/night)\n• Cosy Couple Nest (25m², 1-2 persons, from €40/night)\n• Trio Harmony Suite (55m², 1-3 persons, from €65/night)\nAll apartments are fully equipped with kitchen, WiFi and everything you need.",
    },
    category: "apartments",
  },
  // ===== TWIN HARMONY SUITE =====
  {
    id: "twin_harmony",
    keywords: ["twin harmony", "twin", "harmony suite"],
    content: {
      de: "Die Twin Harmony Suite ist ca. 35m² groß, für 1-2 Personen, ab €50 pro Nacht. Voll ausgestattet mit Küche, WLAN und allem Komfort.",
      en: "The Twin Harmony Suite is approx. 35m², for 1-2 persons, from €50 per night. Fully equipped with kitchen, WiFi and all comforts.",
    },
    category: "apartments",
  },
  // ===== DUO DELUXE STUDIO =====
  {
    id: "duo_deluxe",
    keywords: ["duo deluxe", "duo", "deluxe studio"],
    content: {
      de: "Das Duo Deluxe Studio ist ca. 35m² groß, für 1-2 Personen, ab €50 pro Nacht. Voll ausgestattet mit Küche, WLAN und allem Komfort.",
      en: "The Duo Deluxe Studio is approx. 35m², for 1-2 persons, from €50 per night. Fully equipped with kitchen, WiFi and all comforts.",
    },
    category: "apartments",
  },
  // ===== COSY COUPLE NEST =====
  {
    id: "cosy_couple",
    keywords: ["cosy couple", "cosy", "couple nest"],
    content: {
      de: "Das Cosy Couple Nest ist ca. 25m² groß, für 1-2 Personen, ab €40 pro Nacht. Gemütlich und voll ausgestattet.",
      en: "The Cosy Couple Nest is approx. 25m², for 1-2 persons, from €40 per night. Cozy and fully equipped.",
    },
    category: "apartments",
  },
  // ===== TRIO HARMONY SUITE =====
  {
    id: "trio_harmony",
    keywords: ["trio harmony", "trio", "harmony suite drei", "drei personen", "three persons", "family"],
    content: {
      de: "Die Trio Harmony Suite ist ca. 55m² groß, für 1-3 Personen, ab €65 pro Nacht. Ideal für Familien oder kleine Gruppen, voll ausgestattet.",
      en: "The Trio Harmony Suite is approx. 55m², for 1-3 persons, from €65 per night. Ideal for families or small groups, fully equipped.",
    },
    category: "apartments",
  },
  // ===== PRICE =====
  {
    id: "preis",
    keywords: ["preis", "price", "kosten", "cost", "wie viel", "how much", "tarif", "rate", "nacht", "night", "pro nacht"],
    content: {
      de: "Unsere Preise beginnen ab €40 pro Nacht (Cosy Couple Nest). Twin Harmony Suite und Duo Deluxe Studio ab €50/Nacht. Trio Harmony Suite ab €65/Nacht. Aktuelle Preise und Verfügbarkeit findest Du über den Buchungsbereich auf unserer Startseite.",
      en: "Our prices start from €40 per night (Cosy Couple Nest). Twin Harmony Suite and Duo Deluxe Studio from €50/night. Trio Harmony Suite from €65/night. Current prices and availability can be found via the booking section on our homepage.",
    },
    category: "general",
  },
  // ===== VIENNA TIPS WITH KIDS =====
  {
    id: "wien_kinder",
    keywords: ["wien mit kindern", "vienna with kids", "familienfreundlich", "family friendly", "ausflug", "trip", "spielplatz", "playground", "zoo", "schönbrunn", "prater"],
    content: {
      de: "Familienfreundliche Tipps für Euren Aufenthalt in Wien – von Ausflügen bis zu kleinen Ruhepausen mit Kindern. Details findest Du unter Anleitungen > Mit Kindern Wien entdecken.",
      en: "Family-friendly tips for your stay in Vienna – from trips to short breaks with children. Details can be found under Instructions > Discover Vienna with Kids.",
    },
    category: "location",
  },
  // ===== VIATOR RECOMMENDATIONS =====
  {
    id: "empfehlungen",
    keywords: ["empfehlung", "recommendation", "tour", "tours", "ticket", "tickets", "sehenswürdigkeit", "sightseeing", "highlight", "aktivität", "activity", "entdecken", "discover"],
    content: {
      de: "Entdecke die besten Touren, Tickets und Highlights für Deine Reise nach Wien. Unsere Empfehlungen findest Du auf unserer Webseite.",
      en: "Discover the best tours, tickets and highlights for your trip to Vienna. Our recommendations can be found on our website.",
    },
    category: "location",
  },
  // ===== MINIMUM STAY =====
  {
    id: "mindestaufenthalt",
    keywords: ["mindestaufenthalt", "minimum stay", "mindestens", "minimum", "nächte", "nights", "wie lange", "how long"],
    content: {
      de: "Informationen zum Mindestaufenthalt findest Du im Buchungsbereich auf unserer Startseite. Bitte beachte auch unsere Buchungsbedingungen.",
      en: "Information about minimum stay can be found in the booking section on our homepage. Please also check our booking conditions.",
    },
    category: "general",
  },
  // ===== INDUCTION COOKTOP =====
  {
    id: "induktionskochplatte",
    keywords: ["induktionskochplatte", "induction cooktop", "induktion", "induction", "kochplatte", "kochfeld"],
    content: {
      de: "Schnell und sicher kochen: Eine Schritt-für-Schritt-Anleitung zur Induktionskochplatte findest Du unter Anleitungen > Anleitung Induktionskochplatte (auch als PDF).",
      en: "Cook quickly and safely: Step-by-step instructions for the induction cooktop can be found under Instructions > Induction Cooktop Guide (also available as PDF).",
    },
    category: "apartments",
  },
];

// Fallback message when no answer is found
export const fallbackMessages: Record<string, string> = {
  de: "Diese Information liegt nicht vor. Bitte nutzen Sie unser Kontaktformular, um direkt mit dem Administrator in Verbindung zu treten.",
  en: "This information is not available. Please use our contact form to get in touch with the administrator directly.",
  fr: "Cette information n'est pas disponible. Veuillez utiliser notre formulaire de contact pour contacter directement l'administrateur.",
  it: "Questa informazione non è disponibile. Si prega di utilizzare il nostro modulo di contatto per mettersi direttamente in contatto con l'amministratore.",
  es: "Esta información no está disponible. Por favor, utilice nuestro formulario de contacto para ponerse en contacto directamente con el administrador.",
  sq: "Ky informacion nuk është i disponueshëm. Ju lutemi përdorni formularin tonë të kontaktit për të kontaktuar drejtpërdrejt administratorin.",
};

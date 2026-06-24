import { cookies } from "next/headers";

export const languages = ["en", "es"] as const;
export type Language = (typeof languages)[number];

export function isLanguage(value: string | undefined): value is Language {
  return value === "en" || value === "es";
}

export async function getLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const value = cookieStore.get("leadsignal_language")?.value;
  return isLanguage(value) ? value : "en";
}

export const dictionary = {
  en: {
    common: {
      language: "Language",
      english: "English",
      spanish: "Espa\u00f1ol",
      credits: "credits",
      loading: "Working...",
      tryAgain: "Try again",
      notFound: "Not found"
    },
    nav: {
      signIn: "Sign in",
      startFree: "Start free with 25 credits",
      dashboard: "Dashboard",
      newSearch: "New search",
      searches: "Searches",
      leads: "Leads",
      exports: "Exports",
      settings: "Settings",
      signOut: "Sign out"
    },
    landing: {
      badge: "Built for agencies, freelancers, SEO consultants, and web designers",
      headline: "Find local businesses ready for your marketing offer",
      subhead:
        "Search by niche and city, detect marketing gaps, score each opportunity, and generate personalized outreach openers in one focused workflow.",
      createAccount: "Start free with 25 credits",
      viewSampleLeads: "View sample leads",
      openDashboard: "Open dashboard",
      searchExampleTitle: "Sample search",
      searchExampleSubtitle: "Dental clinics in Miami scored for a website redesign offer.",
      livePreview: "Demo",
      sampleEyebrow: "Visible sample before signup",
      searchExample: [
        ["Niche", "Dental clinics"],
        ["City", "Miami"],
        ["Offer", "Website redesign"],
        ["Tone", "Professional"]
      ],
      sampleTitle: "Sample demo results",
      sampleSubtitle: "A quick look at the kind of local-business opportunities LeadSignal AI helps your team prioritize.",
      sampleLeads: [
        {
          name: "Bright Dental Studio",
          score: "84",
          signals: ["Missing booking", "Weak CTA", "No Meta Pixel"],
          offer: "Conversion audit",
          opener:
            "I noticed Bright Dental Studio has room to make appointment requests clearer, especially with booking and call-to-action signals."
        },
        {
          name: "Coral Smile Clinic",
          score: "76",
          signals: ["Slow site", "No schema", "Unclear service pages"],
          offer: "SEO + website refresh",
          opener:
            "Coral Smile Clinic already has a strong local category, and the site could be easier for patients and search engines to understand."
        },
        {
          name: "Miami Family Dental",
          score: "68",
          signals: ["Few reviews", "No form", "Weak mobile layout"],
          offer: "Local SEO audit",
          opener:
            "I saw a few signals that may be limiting new patient inquiries for Miami Family Dental, especially reviews, forms, and mobile clarity."
        }
      ],
      copyButton: "Copy",
      copiedButton: "Copied",
      howTitle: "How it works",
      howSubtitle: "Four practical steps from local search to useful outreach.",
      steps: [
        ["Search", "Enter a niche, city, country, quantity, offer type, language, and tone."],
        ["Analyze", "LeadSignal checks websites for technical, conversion, social, and tracking signals."],
        ["Prioritize", "Each business gets a deterministic opportunity score so you can focus first."],
        ["Contact", "Use a summary, recommended offer, reason to contact, and personalized opener."]
      ],
      signalsTitle: "Signals detected",
      signalsSubtitle: "The MVP focuses on visible website and marketing signals that agencies can explain clearly.",
      signalsDetected: [
        "HTTPS",
        "Page title",
        "Meta description",
        "H1",
        "CTA words",
        "Contact form",
        "WhatsApp link",
        "Social links",
        "Google Analytics",
        "Meta Pixel",
        "Schema.org / JSON-LD",
        "Booking links"
      ],
      whoTitle: "Who it is for",
      whoSubtitle: "Built for teams and solo operators selling practical marketing improvements to local businesses.",
      audiences: [
        ["Agencies", "Build prospect lists for SEO, ads, websites, and automation offers."],
        ["Freelancers", "Find warmer leads without spending hours manually auditing websites."],
        ["SEO consultants", "Spot businesses with missing metadata, schema, analytics, or weak calls to action."],
        ["Web designers", "Pitch redesigns with specific, evidence-based website gaps."]
      ],
      benefitsTitle: "Why teams use it",
      benefitsSubtitle: "LeadSignal AI keeps prospecting focused on evidence instead of guesswork.",
      benefits: [
        ["Clearer outreach angles", "Every opener is tied to detected signals, so the message feels specific and useful."],
        ["Less manual research", "Search, website checks, scoring, and opener generation live in one workflow."],
        ["Better prioritization", "Sort by opportunity score and start with leads most likely to need your offer."],
        ["Export-ready lists", "Move scored leads into your existing sales process with CSV export."]
      ],
      pricingTitle: "Credits preview",
      pricingSubtitle: "Simple usage-based architecture today, ready for paid plans later.",
      pricingBullets: [
        "Start with 25 free credits",
        "1 analyzed lead costs 1 credit",
        "CSV export included",
        "Stripe-ready schema, payments not enabled yet"
      ],
      pricingNote: "Payments are intentionally not implemented in this MVP.",
      finalEyebrow: "Ready when your next niche is",
      finalCtaTitle: "Find the local businesses worth contacting first",
      finalCtaSubtitle:
        "Start with 25 credits, test one city and niche, and see which businesses have clear marketing gaps."
    },
    auth: {
      loginTitle: "Sign in",
      loginDescription: "Open your LeadSignal AI dashboard.",
      signupTitle: "Create account",
      signupDescription: "Start with 25 analysis credits.",
      email: "Email",
      password: "Password",
      createAccount: "Create account",
      signIn: "Sign in",
      newUser: "New to LeadSignal AI?",
      existingUser: "Already have an account?"
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Track searches, credits, and generated opportunities.",
      overviewEyebrow: "Overview",
      creditsNote: "1 credit per analyzed lead",
      searches: "Searches",
      searchesNote: "Recent saved searches",
      leads: "Leads",
      leadsNote: "Analyzed and pending leads",
      recentSearches: "Recent searches",
      recentDescription: "Open a search to review scored leads and export CSV.",
      noSearches: "No searches yet.",
      requested: "requested",
      quickStartTitle: "Find your next outreach list",
      quickStartBody: "Search a niche and city, let LeadSignal analyze the websites, then sort by opportunity score before exporting or contacting leads.",
      quickStartCta: "Create a search",
      quickStartNote: "Tip: start with 3 to 5 leads while testing a new niche.",
      newLeadSearch: "New lead search",
      emptyTitle: "Start your first lead search",
      emptyDescription: "Choose a niche and city to find businesses with clear marketing opportunities.",
      emptyCta: "New lead search",
      totalLeadsAnalyzed: "Total leads analyzed",
      highOpportunityLeads: "High opportunity leads",
      highOpportunityShort: "High opportunity",
      openersGenerated: "Openers generated",
      creditsRemaining: "Credits remaining",
      highOpportunityNote: "Leads scoring 75 or higher",
      openersNote: "Generated outreach starters",
      creditProgress: "Credit usage",
      recentSearchesTable: "Recent searches",
      recentSearchesTableDescription: "Latest lead searches across niches and cities.",
      search: "Search",
      searchQuery: "Search query",
      location: "Location",
      date: "Date",
      status: "Status",
      leadsFound: "Leads",
      action: "Action",
      view: "View",
      allSearches: "All searches",
      allLeads: "All leads",
      exportsTitle: "Exports",
      exportsDescription: "Download CSV exports from completed searches.",
      noExports: "Completed searches with leads will appear here.",
      account: "Account",
      accountMenu: "Account menu"
    },
    search: {
      title: "New search",
      subtitle: "Find local businesses and analyze the outreach opportunity.",
      cardTitle: "Search criteria",
      cardDescription: "Quantity is capped at 25 for the MVP to keep searches fast.",
      niche: "Niche",
      nichePlaceholder: "Dentists, med spas, roofers",
      city: "City",
      country: "Country",
      quantity: "Quantity",
      creditsAvailable: "credits available. Each analyzed lead costs 1 credit.",
      offerType: "Offer type",
      language: "Language",
      tone: "Tone",
      run: "Run search",
      starting: "Starting search...",
      formError: "Please check the form and try again.",
      offers: {
        website_audit: "Website audit",
        seo: "SEO",
        ads: "Paid ads",
        social_media: "Social media",
        automation: "Automation",
        custom: "Custom"
      },
      processing: "Analysis is running in the background. Results will refresh automatically.",
      searchNotFound: "Search not found."
    },
    results: {
      score: "Score",
      name: "Name",
      rating: "Rating",
      exportCsv: "Export CSV",
      business: "Business",
      signals: "Signals",
      recommendedOffer: "Recommended offer",
      details: "Details",
      open: "Open",
      noLeads: "No leads yet.",
      pending: "Analysis pending",
      noWebsite: "No website",
      noMeta: "No meta",
      noCapture: "No clear capture",
      noSchema: "No schema",
      coreSignals: "Core signals present"
    },
    lead: {
      notFound: "Lead not found.",
      aiRecommendation: "AI recommendation",
      recommendedOffer: "Recommended offer",
      outreachOpeners: "Outreach openers",
      openersDescription: "Personalized starters generated for this business.",
      business: "Business",
      phone: "Phone",
      rating: "Rating",
      website: "Website",
      backToResults: "Back to results",
      websiteSignals: "Website signals",
      found: "Found",
      gap: "Gap",
      signals: ["HTTPS", "Title tag", "Meta description", "H1", "Lead form", "WhatsApp link", "Social links", "Google Analytics", "Meta Pixel", "Schema.org", "Booking links"],
      unknown: "Unknown"
    },
    settings: {
      title: "Settings",
      subtitle: "Manage profile details and account readiness.",
      profile: "Profile",
      profileDescription: "Used later to personalize outreach defaults.",
      fullName: "Full name",
      company: "Company",
      saved: "Settings saved.",
      saving: "Saving...",
      save: "Save settings",
      billing: "Billing architecture",
      billingDescription: "Stripe is intentionally not enabled yet.",
      plan: "Plan",
      status: "Status",
      credits: "Credits",
      profileNotFound: "Profile not found."
    },
    errors: {
      genericTitle: "Something went wrong",
      unauthorized: "Unauthorized",
      notEnoughCredits: "Not enough credits for this search.",
      missingEnv: "Missing environment variable."
    }
  },
  es: {
    common: {
      language: "Idioma",
      english: "English",
      spanish: "Espa\u00f1ol",
      credits: "créditos",
      loading: "Procesando...",
      tryAgain: "Intentar de nuevo",
      notFound: "No encontrado"
    },
    nav: {
      signIn: "Iniciar sesión",
      startFree: "Empieza gratis con 25 créditos",
      dashboard: "Panel",
      newSearch: "Nueva búsqueda",
      searches: "Búsquedas",
      leads: "Leads",
      exports: "Exportaciones",
      settings: "Ajustes",
      signOut: "Cerrar sesión"
    },
    landing: {
      badge: "Creado para agencias, freelancers, consultores SEO y dise\u00f1adores web",
      headline: "Encuentra negocios locales listos para tu oferta de marketing",
      subhead:
        "Busca por nicho y ciudad, detecta brechas de marketing, punt\u00faa cada oportunidad y genera aperturas de contacto personalizadas en un flujo enfocado.",
      createAccount: "Empieza gratis con 25 cr\u00e9ditos",
      viewSampleLeads: "Ver leads de ejemplo",
      openDashboard: "Abrir panel",
      searchExampleTitle: "B\u00fasqueda de ejemplo",
      searchExampleSubtitle: "Cl\u00ednicas dentales en Miami puntuadas para una oferta de redise\u00f1o web.",
      livePreview: "Demo",
      sampleEyebrow: "Muestra visible antes de registrarte",
      searchExample: [
        ["Nicho", "Cl\u00ednicas dentales"],
        ["Ciudad", "Miami"],
        ["Oferta", "Redise\u00f1o web"],
        ["Tono", "Profesional"]
      ],
      sampleTitle: "Resultados demo de ejemplo",
      sampleSubtitle: "Una vista r\u00e1pida del tipo de oportunidades locales que LeadSignal AI ayuda a priorizar.",
      sampleLeads: [
        {
          name: "Bright Dental Studio",
          score: "84",
          signals: ["Falta reserva", "CTA d\u00e9bil", "Sin Meta Pixel"],
          offer: "Auditor\u00eda de conversi\u00f3n",
          opener:
            "Not\u00e9 que Bright Dental Studio podr\u00eda hacer m\u00e1s claro el proceso para pedir cita, especialmente en reserva y llamadas a la acci\u00f3n."
        },
        {
          name: "Coral Smile Clinic",
          score: "76",
          signals: ["Sitio lento", "Sin schema", "P\u00e1ginas de servicios poco claras"],
          offer: "SEO + actualizaci\u00f3n web",
          opener:
            "Coral Smile Clinic ya tiene una categor\u00eda local fuerte, y el sitio podr\u00eda ser m\u00e1s claro para pacientes y motores de b\u00fasqueda."
        },
        {
          name: "Miami Family Dental",
          score: "68",
          signals: ["Pocas rese\u00f1as", "Sin formulario", "Mobile d\u00e9bil"],
          offer: "Auditor\u00eda de SEO local",
          opener:
            "Vi algunas se\u00f1ales que pueden limitar las consultas de nuevos pacientes para Miami Family Dental, sobre todo rese\u00f1as, formularios y claridad m\u00f3vil."
        }
      ],
      copyButton: "Copiar",
      copiedButton: "Copiado",
      howTitle: "C\u00f3mo funciona",
      howSubtitle: "Cuatro pasos pr\u00e1cticos desde b\u00fasqueda local hasta outreach \u00fatil.",
      steps: [
        ["Search", "Ingresa nicho, ciudad, pa\u00eds, cantidad, oferta, idioma y tono."],
        ["Analyze", "LeadSignal revisa se\u00f1ales t\u00e9cnicas, de conversi\u00f3n, redes y tracking del sitio."],
        ["Prioritize", "Cada negocio recibe un puntaje determin\u00edstico para saber por d\u00f3nde empezar."],
        ["Contact", "Usa un resumen, oferta recomendada, raz\u00f3n para contactar y apertura personalizada."]
      ],
      signalsTitle: "Se\u00f1ales detectadas",
      signalsSubtitle: "El MVP se enfoca en se\u00f1ales visibles de sitio web y marketing que una agencia puede explicar con claridad.",
      signalsDetected: [
        "HTTPS",
        "T\u00edtulo de p\u00e1gina",
        "Meta description",
        "H1",
        "Palabras de CTA",
        "Formulario de contacto",
        "Link de WhatsApp",
        "Redes sociales",
        "Google Analytics",
        "Meta Pixel",
        "Schema.org / JSON-LD",
        "Links de reserva"
      ],
      whoTitle: "Para qui\u00e9n es",
      whoSubtitle: "Creado para equipos y operadores independientes que venden mejoras pr\u00e1cticas de marketing a negocios locales.",
      audiences: [
        ["Agencias", "Crea listas de prospectos para SEO, ads, sitios web y automatizaci\u00f3n."],
        ["Freelancers", "Encuentra leads m\u00e1s c\u00e1lidos sin pasar horas auditando sitios manualmente."],
        ["Consultores SEO", "Detecta negocios con metadatos, schema, anal\u00edtica o CTAs d\u00e9biles."],
        ["Dise\u00f1adores web", "Presenta redise\u00f1os con brechas espec\u00edficas y basadas en evidencia."]
      ],
      benefitsTitle: "Por qu\u00e9 lo usan los equipos",
      benefitsSubtitle: "LeadSignal AI mantiene la prospecci\u00f3n basada en evidencia, no en suposiciones.",
      benefits: [
        ["\u00c1ngulos de outreach m\u00e1s claros", "Cada apertura est\u00e1 conectada a se\u00f1ales detectadas, as\u00ed el mensaje se siente espec\u00edfico y \u00fatil."],
        ["Menos investigaci\u00f3n manual", "B\u00fasqueda, revisi\u00f3n web, puntuaci\u00f3n y generaci\u00f3n de aperturas viven en un solo flujo."],
        ["Mejor priorizaci\u00f3n", "Ordena por puntaje de oportunidad y empieza por los leads que m\u00e1s pueden necesitar tu oferta."],
        ["Listas listas para exportar", "Lleva leads puntuados a tu proceso comercial actual con exportaci\u00f3n CSV."]
      ],
      pricingTitle: "Vista previa de cr\u00e9ditos",
      pricingSubtitle: "Arquitectura simple por uso hoy, lista para planes pagos despu\u00e9s.",
      pricingBullets: [
        "Empieza con 25 cr\u00e9ditos gratis",
        "1 lead analizado cuesta 1 cr\u00e9dito",
        "Exportaci\u00f3n CSV incluida",
        "Schema listo para Stripe, pagos a\u00fan no habilitados"
      ],
      pricingNote: "Los pagos no est\u00e1n implementados intencionalmente en este MVP.",
      finalEyebrow: "Listo para tu pr\u00f3ximo nicho",
      finalCtaTitle: "Encuentra primero los negocios locales que vale la pena contactar",
      finalCtaSubtitle:
        "Empieza con 25 cr\u00e9ditos, prueba una ciudad y un nicho, y descubre qu\u00e9 negocios tienen brechas claras de marketing."
    },
    auth: {
      loginTitle: "Iniciar sesión",
      loginDescription: "Abre tu panel de LeadSignal AI.",
      signupTitle: "Crear cuenta",
      signupDescription: "Empieza con 25 créditos de análisis.",
      email: "Email",
      password: "Contraseña",
      createAccount: "Crear cuenta",
      signIn: "Iniciar sesión",
      newUser: "¿Nuevo en LeadSignal AI?",
      existingUser: "¿Ya tienes una cuenta?"
    },
    dashboard: {
      title: "Panel",
      subtitle: "Sigue búsquedas, créditos y oportunidades generadas.",
      overviewEyebrow: "Resumen",
      creditsNote: "1 crédito por lead analizado",
      searches: "Búsquedas",
      searchesNote: "Búsquedas recientes guardadas",
      leads: "Leads",
      leadsNote: "Leads analizados y pendientes",
      recentSearches: "Búsquedas recientes",
      recentDescription: "Abre una búsqueda para revisar leads puntuados y exportar CSV.",
      noSearches: "Aún no hay búsquedas.",
      requested: "solicitados",
      quickStartTitle: "Encuentra tu próxima lista de outreach",
      quickStartBody: "Busca un nicho y ciudad, deja que LeadSignal analice los sitios y ordena por puntaje de oportunidad antes de exportar o contactar leads.",
      quickStartCta: "Crear búsqueda",
      quickStartNote: "Tip: empieza con 3 a 5 leads mientras pruebas un nicho nuevo.",
      newLeadSearch: "Nueva b\u00fasqueda de leads",
      emptyTitle: "Inicia tu primera b\u00fasqueda de leads",
      emptyDescription: "Elige un nicho y una ciudad para encontrar negocios con oportunidades claras de marketing.",
      emptyCta: "Nueva b\u00fasqueda de leads",
      totalLeadsAnalyzed: "Leads analizados",
      highOpportunityLeads: "Leads de alta oportunidad",
      highOpportunityShort: "Alta oportunidad",
      openersGenerated: "Aperturas generadas",
      creditsRemaining: "Créditos restantes",
      highOpportunityNote: "Leads con puntaje 75 o más",
      openersNote: "Inicios de outreach generados",
      creditProgress: "Uso de créditos",
      recentSearchesTable: "Búsquedas recientes",
      recentSearchesTableDescription: "Últimas búsquedas de leads por nicho y ciudad.",
      search: "Búsqueda",
      searchQuery: "B\u00fasqueda",
      location: "Ubicaci\u00f3n",
      date: "Fecha",
      status: "Estado",
      leadsFound: "Leads",
      action: "Acción",
      view: "Ver",
      allSearches: "Todas las búsquedas",
      allLeads: "Todos los leads",
      exportsTitle: "Exportaciones",
      exportsDescription: "Descarga CSV de búsquedas completadas.",
      noExports: "Las búsquedas completadas con leads aparecerán aquí.",
      account: "Cuenta",
      accountMenu: "Menú de cuenta"
    },
    search: {
      title: "Nueva búsqueda",
      subtitle: "Encuentra negocios locales y analiza la oportunidad de contacto.",
      cardTitle: "Criterios de búsqueda",
      cardDescription: "La cantidad está limitada a 25 en el MVP para mantener búsquedas rápidas.",
      niche: "Nicho",
      nichePlaceholder: "Dentistas, med spas, techadores",
      city: "Ciudad",
      country: "País",
      quantity: "Cantidad",
      creditsAvailable: "créditos disponibles. Cada lead analizado cuesta 1 crédito.",
      offerType: "Tipo de oferta",
      language: "Idioma",
      tone: "Tono",
      run: "Ejecutar búsqueda",
      starting: "Iniciando búsqueda...",
      formError: "Revisa el formulario e inténtalo de nuevo.",
      offers: {
        website_audit: "Auditoría web",
        seo: "SEO",
        ads: "Publicidad paga",
        social_media: "Redes sociales",
        automation: "Automatización",
        custom: "Personalizada"
      },
      processing: "El análisis se está ejecutando en segundo plano. Los resultados se actualizarán automáticamente.",
      searchNotFound: "Búsqueda no encontrada."
    },
    results: {
      score: "Puntaje",
      name: "Nombre",
      rating: "Rating",
      exportCsv: "Exportar CSV",
      business: "Negocio",
      signals: "Señales",
      recommendedOffer: "Oferta recomendada",
      details: "Detalles",
      open: "Abrir",
      noLeads: "Aún no hay leads.",
      pending: "Análisis pendiente",
      noWebsite: "Sin sitio web",
      noMeta: "Sin meta",
      noCapture: "Sin captura clara",
      noSchema: "Sin schema",
      coreSignals: "Señales principales presentes"
    },
    lead: {
      notFound: "Lead no encontrado.",
      aiRecommendation: "Recomendación de IA",
      recommendedOffer: "Oferta recomendada",
      outreachOpeners: "Aperturas de contacto",
      openersDescription: "Inicios personalizados generados para este negocio.",
      business: "Negocio",
      phone: "Teléfono",
      rating: "Rating",
      website: "Sitio web",
      backToResults: "Volver a resultados",
      websiteSignals: "Señales del sitio web",
      found: "Encontrado",
      gap: "Brecha",
      signals: ["HTTPS", "Etiqueta title", "Meta description", "H1", "Formulario", "Link de WhatsApp", "Redes sociales", "Google Analytics", "Meta Pixel", "Schema.org", "Links de reserva"],
      unknown: "Desconocido"
    },
    settings: {
      title: "Ajustes",
      subtitle: "Gestiona el perfil y el estado de la cuenta.",
      profile: "Perfil",
      profileDescription: "Se usará luego para personalizar valores predeterminados de contacto.",
      fullName: "Nombre completo",
      company: "Empresa",
      saved: "Ajustes guardados.",
      saving: "Guardando...",
      save: "Guardar ajustes",
      billing: "Arquitectura de facturación",
      billingDescription: "Stripe aún no está habilitado intencionalmente.",
      plan: "Plan",
      status: "Estado",
      credits: "Créditos",
      profileNotFound: "Perfil no encontrado."
    },
    errors: {
      genericTitle: "Algo salió mal",
      unauthorized: "No autorizado",
      notEnoughCredits: "No tienes suficientes créditos para esta búsqueda.",
      missingEnv: "Falta una variable de entorno."
    }
  }
} as const;

export type Copy = (typeof dictionary)[Language];

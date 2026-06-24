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
      spanish: "Español",
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
      headline: "Turn local business gaps into qualified outreach",
      subhead:
        "Find local businesses with visible marketing gaps, prioritize the best opportunities, and generate personalized openers before your competitors do.",
      createAccount: "Start free with 25 credits",
      viewSampleLeads: "View sample leads",
      openDashboard: "Open dashboard",
      imageAlt: "Team reviewing local business opportunities",
      statScore: "Opportunity score",
      statScoreNote: "Missing form, no schema, weak CTA",
      statOffer: "Recommended offer",
      statOfferNote: "Clear reason to contact",
      statOpeners: "Openers generated",
      statOpenersNote: "Ready for email or LinkedIn",
      features: [
        ["Places search", "Find businesses by niche, city, country, and quantity."],
        ["Signal analysis", "Detect HTTPS, metadata, forms, social links, analytics, pixels, and schema."],
        ["Personalized openers", "Generate concise reasons to contact and outreach starters."]
      ],
      sampleTitle: "Sample local lead report",
      sampleSubtitle: "See the kind of opportunities LeadSignal AI surfaces before you create an account.",
      sampleLeads: [
        {
          name: "Oak & Ivy Dental",
          niche: "Dentist in Austin",
          score: "86",
          signals: "No schema, weak CTA, no lead form",
          offer: "Website conversion audit",
          opener:
            "I noticed your practice ranks locally, but the website makes it harder than it should for new patients to request an appointment."
        },
        {
          name: "River City Med Spa",
          niche: "Med spa in Tampa",
          score: "78",
          signals: "Meta description missing, no Meta Pixel",
          offer: "Landing page + retargeting setup",
          opener:
            "Your services look premium, and I spotted a few quick fixes that could turn more treatment-page visitors into consultations."
        },
        {
          name: "Summit Roof Repair",
          niche: "Roofer in Denver",
          score: "72",
          signals: "No HTTPS redirect, no analytics, limited social links",
          offer: "Local SEO and tracking cleanup",
          opener:
            "I found your company while checking roof repair searches in Denver and saw a few tracking gaps that may be hiding good leads."
        }
      ],
      howTitle: "How it works",
      howSubtitle: "A simple workflow for turning local search data into useful outreach.",
      steps: [
        ["Search", "Enter a niche, city, country, quantity, offer type, language, and tone."],
        ["Analyze", "LeadSignal checks websites for technical, conversion, social, and tracking signals."],
        ["Prioritize", "Each business gets a deterministic opportunity score so you can focus first."],
        ["Contact", "Get a summary, recommended offer, reason to contact, and personalized openers."]
      ],
      whoTitle: "Who it is for",
      whoSubtitle: "Designed for people selling practical marketing and web improvements to local businesses.",
      audiences: [
        ["Agencies", "Build prospect lists for SEO, ads, websites, and automation offers."],
        ["Freelancers", "Find warmer leads without spending hours manually auditing websites."],
        ["SEO consultants", "Spot businesses with missing metadata, schema, analytics, or weak calls to action."],
        ["Web designers", "Pitch redesigns with specific, evidence-based website gaps."]
      ],
      pricingTitle: "Credits preview",
      pricingSubtitle: "Simple usage-based architecture today, ready for paid plans later.",
      pricingBullets: [
        "Start with 25 free credits",
        "1 analyzed lead costs 1 credit",
        "CSV export included",
        "Stripe-ready schema, payments not enabled yet"
      ],
      pricingNote: "Payments are intentionally not implemented in this MVP."
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
      totalLeadsAnalyzed: "Total leads analyzed",
      highOpportunityLeads: "High opportunity leads",
      openersGenerated: "Openers generated",
      creditsRemaining: "Credits remaining",
      highOpportunityNote: "Leads scoring 75 or higher",
      openersNote: "Generated outreach starters",
      creditProgress: "Credit usage",
      recentSearchesTable: "Recent searches",
      recentSearchesTableDescription: "Latest lead searches across niches and cities.",
      search: "Search",
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
      signals: ["HTTPS", "Title tag", "Meta description", "H1", "Lead form", "WhatsApp link", "Social links", "Google Analytics", "Meta Pixel", "Schema.org"],
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
      spanish: "Español",
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
      badge: "Creado para agencias, freelancers, consultores SEO y diseñadores web",
      headline: "Convierte brechas de negocios locales en outreach calificado",
      subhead:
        "Encuentra negocios locales con brechas visibles de marketing, prioriza las mejores oportunidades y genera aperturas personalizadas antes que tu competencia.",
      createAccount: "Empieza gratis con 25 créditos",
      viewSampleLeads: "Ver leads de ejemplo",
      openDashboard: "Abrir panel",
      imageAlt: "Equipo revisando oportunidades de negocios locales",
      statScore: "Puntaje de oportunidad",
      statScoreNote: "Sin formulario, sin schema, CTA débil",
      statOffer: "Oferta recomendada",
      statOfferNote: "Razón clara para contactar",
      statOpeners: "Aperturas generadas",
      statOpenersNote: "Listas para email o LinkedIn",
      features: [
        ["Búsqueda en Places", "Encuentra negocios por nicho, ciudad, país y cantidad."],
        ["Análisis de señales", "Detecta HTTPS, metadatos, formularios, redes, analítica, píxeles y schema."],
        ["Aperturas personalizadas", "Genera razones de contacto y primeras líneas concisas."]
      ],
      sampleTitle: "Reporte de leads locales de ejemplo",
      sampleSubtitle: "Mira el tipo de oportunidades que LeadSignal AI encuentra antes de crear una cuenta.",
      sampleLeads: [
        {
          name: "Oak & Ivy Dental",
          niche: "Dentista en Austin",
          score: "86",
          signals: "Sin schema, CTA débil, sin formulario",
          offer: "Auditoría de conversión web",
          opener: "Noté que la clínica tiene presencia local, pero el sitio hace más difícil de lo necesario pedir una cita."
        },
        {
          name: "River City Med Spa",
          niche: "Med spa en Tampa",
          score: "78",
          signals: "Falta meta description, sin Meta Pixel",
          offer: "Landing page + retargeting",
          opener: "Tus servicios se ven premium y vi algunos ajustes rápidos que podrían convertir más visitas en consultas."
        },
        {
          name: "Summit Roof Repair",
          niche: "Techadores en Denver",
          score: "72",
          signals: "Sin redirección HTTPS, sin analítica, pocas redes",
          offer: "SEO local y limpieza de tracking",
          opener: "Encontré la empresa revisando búsquedas de reparación de techos en Denver y vi brechas de tracking que pueden ocultar leads."
        }
      ],
      howTitle: "Cómo funciona",
      howSubtitle: "Un flujo simple para convertir datos de búsqueda local en outreach útil.",
      steps: [
        ["Search", "Ingresa nicho, ciudad, país, cantidad, oferta, idioma y tono."],
        ["Analyze", "LeadSignal revisa señales técnicas, conversión, redes y tracking del sitio."],
        ["Prioritize", "Cada negocio recibe un puntaje de oportunidad para decidir por dónde empezar."],
        ["Contact", "Obtén resumen, oferta recomendada, razón para contactar y aperturas personalizadas."]
      ],
      whoTitle: "Para quién es",
      whoSubtitle: "Diseñado para vender mejoras prácticas de marketing y web a negocios locales.",
      audiences: [
        ["Agencias", "Crea listas de prospectos para SEO, ads, sitios web y automatización."],
        ["Freelancers", "Encuentra leads más cálidos sin pasar horas auditando sitios manualmente."],
        ["Consultores SEO", "Detecta negocios con metadatos, schema, analítica o CTAs débiles."],
        ["Diseñadores web", "Presenta rediseños con brechas específicas y basadas en evidencia."]
      ],
      pricingTitle: "Vista previa de créditos",
      pricingSubtitle: "Arquitectura simple por uso hoy, lista para planes pagos luego.",
      pricingBullets: [
        "Empieza con 25 créditos gratis",
        "1 lead analizado cuesta 1 crédito",
        "Exportación CSV incluida",
        "Schema listo para Stripe, pagos aún no habilitados"
      ],
      pricingNote: "Los pagos no están implementados intencionalmente en este MVP."
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
      totalLeadsAnalyzed: "Leads analizados",
      highOpportunityLeads: "Leads de alta oportunidad",
      openersGenerated: "Aperturas generadas",
      creditsRemaining: "Créditos restantes",
      highOpportunityNote: "Leads con puntaje 75 o más",
      openersNote: "Inicios de outreach generados",
      creditProgress: "Uso de créditos",
      recentSearchesTable: "Búsquedas recientes",
      recentSearchesTableDescription: "Últimas búsquedas de leads por nicho y ciudad.",
      search: "Búsqueda",
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
      signals: ["HTTPS", "Etiqueta title", "Meta description", "H1", "Formulario", "Link de WhatsApp", "Redes sociales", "Google Analytics", "Meta Pixel", "Schema.org"],
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

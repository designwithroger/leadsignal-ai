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
      startFree: "Start free",
      dashboard: "Dashboard",
      newSearch: "New search",
      settings: "Settings",
      signOut: "Sign out"
    },
    landing: {
      badge: "Local lead research with credits built in",
      headline: "LeadSignal AI",
      subhead:
        "Search local businesses, analyze their marketing gaps, score the opportunity, and generate outreach openers in one focused workflow.",
      createAccount: "Create account",
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
      ]
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
      requested: "requested"
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
      startFree: "Empezar gratis",
      dashboard: "Panel",
      newSearch: "Nueva búsqueda",
      settings: "Ajustes",
      signOut: "Cerrar sesión"
    },
    landing: {
      badge: "Investigación de leads locales con créditos incluidos",
      headline: "LeadSignal AI",
      subhead:
        "Busca negocios locales, analiza sus brechas de marketing, puntúa la oportunidad y genera aperturas de contacto en un flujo enfocado.",
      createAccount: "Crear cuenta",
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
      ]
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
      requested: "solicitados"
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

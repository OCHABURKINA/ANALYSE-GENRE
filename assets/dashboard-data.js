const DASHBOARD_DATA = {
  meta: {
    title: "Analyse Conjointe Genre — Burkina Faso 2025",
    country: "Burkina Faso",
    year: 2025,
    totalRespondents: 3681,
    odf: 89,
    humanitarianActors: 148,
    regionsCovered: 7
  },

  regions: [
    { id: "bankui", name: "Boucle du Mouhoun (Bankui)", total: 534, adults: 398, adolescents: 136, women: 218, men: 180, girls: 75, boys: 61 },
    { id: "goulmou", name: "Est (Goulmou)", total: 487, adults: 352, adolescents: 135, women: 191, men: 161, girls: 74, boys: 61 },
    { id: "kadiogo", name: "Centre (Kadiogo)", total: 612, adults: 462, adolescents: 150, women: 253, men: 209, girls: 83, boys: 67 },
    { id: "koulse", name: "Centre-Nord (Koulsé)", total: 541, adults: 405, adolescents: 136, women: 226, men: 179, girls: 78, boys: 58 },
    { id: "liptako", name: "Sahel (Liptako)", total: 603, adults: 438, adolescents: 165, women: 248, men: 190, girls: 92, boys: 73 },
    { id: "nakambe", name: "Centre-Sud (Nakambé)", total: 428, adults: 319, adolescents: 109, women: 173, men: 146, girls: 61, boys: 48 },
    { id: "yaadga", name: "Nord (Yaadga)", total: 476, adults: 356, adolescents: 120, women: 198, men: 158, girls: 69, boys: 51 }
  ],

  genderAnalysis: {
    protectionRisks: [
      { label: "Insécurité dans les déplacements", value: 72 },
      { label: "Risques de VBG", value: 64 },
      { label: "Mariage précoce", value: 47 },
      { label: "Accès limité aux services", value: 58 },
      { label: "Manque d’information", value: 52 }
    ],

    livelihoodBarriers: [
      { label: "Manque de capital", value: 76 },
      { label: "Accès limité aux marchés", value: 61 },
      { label: "Insécurité", value: 68 },
      { label: "Charge domestique", value: 59 },
      { label: "Accès limité à la terre", value: 43 }
    ],

    adolescentPriorities: [
      { label: "Éducation", girls: 74, boys: 69 },
      { label: "Protection", girls: 71, boys: 55 },
      { label: "Santé", girls: 63, boys: 51 },
      { label: "Moyens de subsistance", girls: 48, boys: 57 },
      { label: "Participation", girls: 42, boys: 46 }
    ]
  },

  organisationalAnalysis: {
    odfDomains: [
      { label: "Protection / VBG", value: 31 },
      { label: "Cohésion sociale", value: 19 },
      { label: "Moyens de subsistance", value: 17 },
      { label: "Santé communautaire", value: 12 },
      { label: "Plaidoyer / droits", value: 10 }
    ],

    coordinationBarriers: [
      { label: "Manque d’information", value: 67 },
      { label: "Faible accès numérique", value: 54 },
      { label: "Contraintes de mobilité", value: 49 },
      { label: "Manque de ressources", value: 72 },
      { label: "Barrières institutionnelles", value: 45 }
    ],

    clusterGenderIntegration: [
      { label: "Protection", value: 68 },
      { label: "Santé", value: 54 },
      { label: "Éducation", value: 49 },
      { label: "WASH", value: 44 },
      { label: "Sécurité alimentaire", value: 52 },
      { label: "Abris / NFI", value: 38 }
    ],

    accountability: [
      { label: "Accessibilité", value: 46 },
      { label: "Confidentialité", value: 39 },
      { label: "Participation", value: 43 },
      { label: "Retour d’information", value: 34 },
      { label: "Adaptation des services", value: 31 }
    ]
  }
};

window.DASHBOARD_DATA = DASHBOARD_DATA;

const DASHBOARD_DATA = {
  meta: {
    title: "Analyse Conjointe Genre",
    country: "Burkina Faso",
    year: 2025,
    reportDate: "Mars 2026",
    collectionPeriod: "Septembre 2025",
    regionsCovered: 7,
    regions: ["Bankui", "Goulmou", "Kadiogo", "Koulsé", "Liptako", "Nakambé", "Yaadga"]
  },

  samples: {
    totalRespondents: 3681,
    adults: 1827,
    adolescents: 1864,
    pdi: 1300,
    hosts: 2391,
    women: 922,
    men: 905,
    girls: 874,
    boys: 990,
    odf: 89,
    humanitarianActors: 148,
    interviews: 54,
    focusGroups: 66
  },

  keyMessages: [
    {
      icon: "livelihood",
      title: "Pression économique",
      text: "64,1 % des ménages déclarent un déséquilibre entre revenus et besoins essentiels."
    },
    {
      icon: "water",
      title: "Charge domestique",
      text: "77 % des femmes participent à la collecte d’eau contre 26 % des hommes."
    },
    {
      icon: "education",
      title: "Déscolarisation",
      text: "26,4 % des garçons de 12–17 ans ne sont pas scolarisés contre 18,3 % des filles."
    },
    {
      icon: "cash",
      title: "Financement des ODF",
      text: "89 % des ODF se financent principalement sur fonds propres."
    },
    {
      icon: "coordination",
      title: "Coordination",
      text: "77 % des mécanismes collectent des données ventilées par sexe, âge et handicap."
    },
    {
      icon: "children",
      title: "Participation des adolescentes",
      text: "Seulement 23 % des mécanismes consultent des organisations dirigées par des adolescentes."
    }
  ],

  regions: [
    { name: "Bankui", adults: 166, adolescents: 165, total: 331 },
    { name: "Goulmou", adults: 198, adolescents: 251, total: 449 },
    { name: "Kadiogo", adults: 237, adolescents: 276, total: 513 },
    { name: "Koulsé", adults: 317, adolescents: 309, total: 626 },
    { name: "Liptako", adults: 274, adolescents: 224, total: 498 },
    { name: "Nakambé", adults: 298, adolescents: 292, total: 590 },
    { name: "Yaadga", adults: 337, adolescents: 347, total: 684 }
  ],

  genre: {
    priorityNeeds: {
      labels: ["Alimentation", "Santé", "Argent", "Moyens de subsistance", "Éducation", "Logement", "Protection", "Eau"],
      women: [76.2, 66.9, 41.0, 26.4, 26.5, 23.2, 12.6, 20.7],
      men: [81.5, 70.2, 42.3, 27.4, 23.8, 24.5, 14.7, 15.6]
    },
    roles: [
      { task: "Cuisine", women: 88, men: 15 },
      { task: "Travail ménager", women: 85, men: 32 },
      { task: "Collecte d'eau", women: 77, men: 26 },
      { task: "Collecte du bois", women: 65, men: 23 },
      { task: "Soins aux enfants", women: 86, men: 86 },
      { task: "Agriculture", women: 69, men: 76 }
    ],
    livelihoods: {
      incomeNeedsGap: 64.1,
      creditSupportGap: 62.5,
      landAccessGap: 38.8,
      resourceInsecurity: 24.9
    }
  },

  organisations: {
    odf: 89,
    humanitarianActors: 148,
    womenLeadershipAbove50: 97,
    ownFundsDependence: 89,
    noHumanitarianFunding: 52,
    coordinationParticipation: 84,

    sectors: {
      labels: [
        "VBG / PEAS",
        "Égalité de genre",
        "Autonomisation / AGR",
        "Éducation",
        "Santé sexuelle et reproductive",
        "Leadership femmes et filles",
        "Protection",
        "Protection de l’enfant",
        "Santé",
        "WASH"
      ],
      values: [75, 67, 60, 50, 50, 48, 48, 43, 41, 34]
    },

    coordination: {
      labels: [
        "Sous-Cluster VBG",
        "Réseau PEAS",
        "Cluster Protection",
        "Protection Enfant",
        "GT ÉGIAH",
        "GT Santé Mentale",
        "Engagement communautaire"
      ],
      values: [72, 65, 58, 55, 48, 38, 32]
    },

    iasc: {
      saddd: 77,
      genderFocalPoint: 69,
      genderPriority: 85,
      genderQuestions: 93,
      womenGirlsConsultation: 69,
      womenOrganizationsConsultation: 46,
      adolescentOrganizationsConsultation: 23,
      coherentMonitoring: 39
    }
  }
};

window.DASHBOARD_DATA = DASHBOARD_DATA;

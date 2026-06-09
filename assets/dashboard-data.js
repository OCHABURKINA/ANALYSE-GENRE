/* ============================================================
   Analyse Conjointe Genre — Burkina Faso 2025
   Données consolidées pour le dashboard
   Source : Rapport Analyse Conjointe Genre, version finale 28/04/2026
   ============================================================ */

const DASHBOARD_DATA = {
  meta: {
    title: "Analyse Conjointe Genre",
    country: "Burkina Faso",
    year: 2025,
    reportDate: "Mars 2026",
    collectionPeriod: "Septembre 2025",
    source: "CERFODES, enquête terrain septembre 2025",
    regionsCovered: 7,
    totalRegionsCountry: 13,
    regions: [
      "Bankui",
      "Goulmou",
      "Kadiogo",
      "Koulsé",
      "Liptako",
      "Nakambé",
      "Yaadga"
    ]
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
    individualInterviews: 54,
    focusGroups: 66,
    focusGroupsGirls: 16,
    focusGroupsBoys: 13,
    focusGroupsWomen: 22,
    focusGroupsMen: 15
  },

  regions: [
    {
      id: "bankui",
      name: "Bankui",
      formerName: "Boucle du Mouhoun",
      adults: 166,
      adolescents: 165,
      total: 331,
      foodNeeds: 74,
      healthNeeds: 64,
      cashNeeds: 37,
      youthPdi: 20
    },
    {
      id: "goulmou",
      name: "Goulmou",
      formerName: "Est",
      adults: 198,
      adolescents: 251,
      total: 449,
      foodNeeds: 80,
      healthNeeds: 66,
      cashNeeds: 41,
      youthPdi: 38
    },
    {
      id: "kadiogo",
      name: "Kadiogo",
      formerName: "Centre",
      adults: 237,
      adolescents: 276,
      total: 513,
      foodNeeds: 69,
      healthNeeds: 60,
      cashNeeds: 35,
      youthPdi: 22
    },
    {
      id: "koulse",
      name: "Koulsé",
      formerName: "Centre-Nord",
      adults: 317,
      adolescents: 309,
      total: 626,
      foodNeeds: 85,
      healthNeeds: 70,
      cashNeeds: 40,
      youthPdi: 35
    },
    {
      id: "liptako",
      name: "Liptako",
      formerName: "Sahel",
      adults: 274,
      adolescents: 224,
      total: 498,
      foodNeeds: 85,
      healthNeeds: 72,
      cashNeeds: 44,
      youthPdi: 42
    },
    {
      id: "nakambe",
      name: "Nakambé",
      formerName: "Centre-Sud",
      adults: 298,
      adolescents: 292,
      total: 590,
      foodNeeds: 72,
      healthNeeds: 65,
      cashNeeds: 42,
      youthPdi: 30
    },
    {
      id: "yaadga",
      name: "Yaadga",
      formerName: "Nord",
      adults: 337,
      adolescents: 347,
      total: 684,
      foodNeeds: 83,
      healthNeeds: 68,
      cashNeeds: 38,
      youthPdi: 28
    }
  ],

  education: {
    adultsBySex: {
      labels: [
        "Alphabétisation",
        "Aucun",
        "École coranique",
        "Post-primaire",
        "Primaire",
        "Secondaire",
        "Université"
      ],
      women: [9.5, 55.5, 0.8, 7.7, 17.0, 8.4, 1.1],
      men: [5.1, 51.0, 3.0, 3.1, 21.9, 8.3, 7.6],
      total: [7.3, 53.3, 1.9, 5.4, 19.4, 8.3, 4.3]
    },

    adolescentsBySex: {
      labels: [
        "Alphabétisation",
        "Aucun",
        "École coranique",
        "Post-primaire",
        "Primaire",
        "Secondaire"
      ],
      girls: [3.0, 18.3, 1.0, 16.8, 23.0, 37.9],
      boys: [2.6, 26.4, 1.5, 12.9, 23.7, 32.8],
      total: [2.8, 22.6, 1.3, 14.8, 23.4, 35.2]
    },

    adolescentsByZone: {
      labels: [
        "Alphabétisation",
        "Aucun",
        "École coranique",
        "Post-primaire",
        "Primaire",
        "Secondaire"
      ],
      nonHumanitarianZone: [0.7, 4.3, 0.0, 20.7, 13.0, 61.2],
      humanitarianZones: [3.1, 25.8, 1.5, 13.7, 25.2, 30.7],
      total: [2.8, 22.6, 1.3, 14.8, 23.4, 35.2]
    },

    nonSchoolingReasons: {
      labels: [
        "Manque de moyens",
        "Travail / charges",
        "Insécurité",
        "Mariage précoce",
        "Distance école",
        "Autres"
      ],
      girls: [193, 47, 77, 41, 11, 106],
      boys: [263, 160, 0, 0, 0, 0]
    }
  },

  livelihoods: {
    keyFindings: [
      {
        label: "Déséquilibre revenus / besoins",
        value: 64.1,
        unit: "%",
        theme: "economic"
      },
      {
        label: "Faible accès aux services de soutien et au crédit",
        value: 62.5,
        unit: "%",
        theme: "economic"
      },
      {
        label: "Accès limité à la terre",
        value: 38.8,
        unit: "%",
        theme: "land"
      },
      {
        label: "Insécurité lors de la recherche de ressources productives",
        value: 24.9,
        unit: "%",
        theme: "protection"
      },
      {
        label: "Normes de genre défavorables au travail des femmes",
        value: 13.4,
        unit: "%",
        theme: "gender"
      }
    ],

    challengesBySex: {
      labels: [
        "Faible accès crédit / soutien",
        "Accès à la terre",
        "VBG",
        "EAS",
        "Insécurité ressources",
        "Engins explosifs improvisés"
      ],
      women: [63.4, 38.8, 7.9, 1.0, 22.1, 3.0],
      men: [61.4, 38.7, 7.7, 6.4, 27.7, 8.0],
      total: [62.5, 38.8, 7.8, 3.7, 24.9, 5.5]
    },

    challengesByRegion: [
      {
        region: "Bankui",
        creditSupport: 57.2,
        landAccess: 34.3,
        gbv: 2.4,
        sea: 0.6,
        insecurityResources: 10.2,
        explosiveDevices: 1.2,
        genderNorms: 6.0,
        incomeNeedsGap: 55.4
      },
      {
        region: "Goulmou",
        creditSupport: 46.0,
        landAccess: 59.6,
        gbv: 6.6,
        sea: 2.0,
        insecurityResources: 36.4,
        explosiveDevices: 6.1,
        genderNorms: 5.1,
        incomeNeedsGap: 60.1
      },
      {
        region: "Kadiogo",
        creditSupport: 66.2,
        landAccess: 23.6,
        gbv: 8.4,
        sea: 3.0,
        insecurityResources: 8.4,
        explosiveDevices: 0.4,
        genderNorms: 12.7,
        incomeNeedsGap: 69.6
      },
      {
        region: "Koulsé",
        creditSupport: 63.7,
        landAccess: 38.2,
        gbv: 2.5,
        sea: 0.0,
        insecurityResources: 18.0,
        explosiveDevices: 1.3,
        genderNorms: 4.1,
        incomeNeedsGap: 79.2
      },
      {
        region: "Liptako",
        creditSupport: 63.1,
        landAccess: 29.2,
        gbv: 8.4,
        sea: 3.3,
        insecurityResources: 39.4,
        explosiveDevices: 15.3,
        genderNorms: 10.6,
        incomeNeedsGap: 39.1
      },
      {
        region: "Nakambé",
        creditSupport: 80.9,
        landAccess: 48.7,
        gbv: 12.1,
        sea: 13.4,
        insecurityResources: 26.5,
        explosiveDevices: 6.0,
        genderNorms: 28.9,
        incomeNeedsGap: 70.1
      },
      {
        region: "Yaadga",
        creditSupport: 54.0,
        landAccess: 38.9,
        gbv: 11.6,
        sea: 1.8,
        insecurityResources: 30.3,
        explosiveDevices: 6.2,
        genderNorms: 19.9,
        incomeNeedsGap: 67.7
      }
    ],

    womenEconomicActivities: {
      labels: [
        "Agriculture",
        "Petit commerce",
        "Sans activité",
        "Travail journalier",
        "Élevage",
        "Jardin familial"
      ],
      beforeCrisis: [39.6, 30.6, 14.4, 7.7, 4.3, 3.1],
      current: [12.3, 32.3, 36.7, 11.1, 0.8, 2.0]
    },

    menEconomicActivities: {
      labels: [
        "Agriculture",
        "Petit commerce",
        "Sans activité",
        "Travail journalier",
        "Élevage",
        "Jardin familial"
      ],
      beforeCrisis: [50.3, 19.1, 4.0, 17.3, 8.3, 0.9],
      current: [24.5, 20.4, 20.8, 18.6, 5.4, 1.0]
    }
  },

  householdRoles: {
    tasks: [
      {
        task: "Cuisine",
        women: 88,
        men: 15
      },
      {
        task: "Travail ménager",
        women: 85,
        men: 32
      },
      {
        task: "Collecte d'eau",
        women: 77,
        men: 26
      },
      {
        task: "Collecte du bois",
        women: 65,
        men: 23
      },
      {
        task: "Soins aux enfants",
        women: 86,
        men: 86
      },
      {
        task: "Élevage",
        women: 47,
        men: 72
      },
      {
        task: "Agriculture",
        women: 69,
        men: 76
      },
      {
        task: "Achat de nourriture",
        women: 53,
        men: 76
      }
    ]
  },

  decisionMaking: {
    domains: [
      "Actifs (achat / vente)",
      "Soins de santé",
      "Avoir un enfant",
      "École des enfants",
      "Mariage des enfants"
    ],

    womenBeforeCrisis: {
      alone: [14.0, 14.9, 13.8, 11.7, 9.1],
      joint: [39.8, 52.4, 54.7, 50.9, 38.7],
      consulted: [29.7, 24.7, 18.4, 24.2, 23.3],
      none: [16.5, 8.0, 13.1, 13.2, 28.9]
    },

    womenAfterCrisis: {
      alone: [18.3, 19.2, 17.5, 16.7, 12.3],
      joint: [37.6, 49.9, 50.5, 48.0, 36.0],
      consulted: [27.3, 22.1, 18.1, 21.9, 22.7],
      none: [16.7, 8.8, 13.9, 13.3, 29.1]
    },

    communityParticipation: {
      women: 29.6,
      men: 54.7,
      womenNotParticipating: 70.4,
      menNotParticipating: 45.3,
      womenListened: 46.5,
      womenPartiallyListened: 30.9
    }
  },

  needs: {
    adultPriorityNeedsBySex: {
      labels: [
        "Alimentation",
        "Soins de santé",
        "Argent",
        "Moyens de subsistance",
        "Éducation",
        "Logement",
        "Protection",
        "Eau",
        "Hygiène"
      ],
      women: [76.2, 66.9, 41.0, 26.4, 26.5, 23.2, 12.6, 20.7, 9.1],
      men: [81.5, 70.2, 42.3, 27.4, 23.8, 24.5, 14.7, 15.6, 6.2]
    },

    adultPriorityNeedsByRegion: [
      {
        region: "Bankui",
        food: 74,
        health: 64,
        cash: 37
      },
      {
        region: "Goulmou",
        food: 80,
        health: 66,
        cash: 41
      },
      {
        region: "Kadiogo",
        food: 69,
        health: 60,
        cash: 35
      },
      {
        region: "Koulsé",
        food: 85,
        health: 70,
        cash: 40
      },
      {
        region: "Liptako",
        food: 85,
        health: 72,
        cash: 44
      },
      {
        region: "Nakambé",
        food: 72,
        health: 65,
        cash: 42
      },
      {
        region: "Yaadga",
        food: 83,
        health: 68,
        cash: 38
      }
    ]
  },

  protection: {
    gbvRiskContexts: {
      labels: [
        "Domicile",
        "Brousse / bois de chauffe",
        "Points d'eau",
        "École",
        "Marché",
        "Latrines / douches",
        "Points de services humanitaires",
        "Ne sait pas"
      ],
      values: [32.1, 32.0, 19.9, 15.5, 14.7, 10.0, 9.0, 40.5]
    },

    gbvCasesAoR: {
      period: "Janvier–septembre 2025",
      totalCases: 3750,
      womenShare: 87,
      girlsShare: 11
    },

    violenceVictimsAdolescents: {
      labels: ["Filles", "Garçons"],
      victims: [3.9, 9.8],
      nonVictims: [96.1, 90.2]
    },

    violenceTypesAdolescents: {
      labels: [
        "Physique",
        "Psychologique / émotionnelle",
        "Exploitation",
        "Économique",
        "Autre"
      ],
      girls: [8, 18, 8, 5, 1],
      boys: [62, 30, 16, 16, 7]
    },

    perceptionForcedMarriage: {
      labels: [
        "Mariage forcé — Filles",
        "Mariage forcé — Garçons",
        "Mariage enfants — Filles",
        "Mariage enfants — Garçons"
      ],
      unacceptable: [94.6, 94.1, 97.0, 92.9],
      depends: [3.0, 5.1, 2.1, 5.1],
      acceptable: [2.4, 0.8, 0.9, 2.0]
    }
  },

  health: {
    accessFindings: {
      adultHealthAccessGlobal: 93.2,
      pdiHealthAccess: 87.6,
      liptakoPdiHealthAccess: 80.6,
      liptakoHostHealthAccess: 94.5,
      adolescentPdiNonAccess: 13.9,
      adolescentHostNonAccess: 5.1
    },

    sexualReproductiveHealth: {
      totalNonAccess: 29.8,
      pdiNonAccess: 38.8,
      hostNonAccess: 24.8,
      goulmouNonAccess: 53.5,
      liptakoNonAccess: 57.7,
      adolescentTotalNonAccess: 45.8,
      boysNonAccess: 47.9,
      girlsNonAccess: 43.4,
      adolescentPdiNonAccess: 53.0,
      adolescentHostNonAccess: 42.1
    },

    mentalHealth: {
      adultsWithDifficulties: 66.0,
      menWithDifficulties: 66.9,
      womenWithDifficulties: 65.1,
      pdiWithDifficulties: 72.6,
      hostsWithDifficulties: 62.2,
      withoutPsychosocialSupport: 70.0,
      adolescentsWithDifficulties: 47.7,
      boysWithDifficulties: 52.4,
      girlsWithDifficulties: 42.4
    }
  },

  wash: {
    hygieneNeedsSatisfied: {
      hosts: 86.0,
      pdi: 68.0
    },

    waterCollection: {
      women: 77,
      men: 26,
      girlsPdiMoreThanSixMinutes: 24.2,
      adolescentHostsMoreThanSixMinutes: 9.7
    }
  },

  adolescents: {
    maritalStatus: {
      labels: [
        "Célibataire",
        "Marié·e monogame",
        "Marié·e polygame",
        "Union libre",
        "Veuf / Divorcé"
      ],
      values: [1455, 339, 45, 15, 10],
      marriedShare: 18.2
    },

    childMarriageByRegion: {
      liptako: 39.3,
      bankui: 24.2,
      koulse: 21.7,
      yaadga: 25.8,
      pdi: 27.3,
      hosts: 17.1
    },

    residenceStatus: {
      labels: ["Hôtes", "PDI", "Retournés"],
      values: [1227, 632, 5]
    },

    residenceZone: {
      labels: ["Zone urbaine", "Zone rurale"],
      values: [1466, 398],
      percentages: [79, 21]
    },

    youthPdiByRegion: [
      {
        region: "Bankui",
        youth: 165,
        pdi: 20
      },
      {
        region: "Goulmou",
        youth: 251,
        pdi: 38
      },
      {
        region: "Kadiogo",
        youth: 276,
        pdi: 22
      },
      {
        region: "Koulsé",
        youth: 309,
        pdi: 35
      },
      {
        region: "Liptako",
        youth: 224,
        pdi: 42
      },
      {
        region: "Nakambé",
        youth: 292,
        pdi: 30
      },
      {
        region: "Yaadga",
        youth: 347,
        pdi: 28
      }
    ]
  },

  organisations: {
    overview: {
      odfSurveyed: 89,
      womenLeadershipAbove50: 97,
      womenFirstResponsible: 89,
      ownFundsDependence: 89,
      noHumanitarianFunding2023_2025: 52,
      coordinationParticipation: 84,
      unawareCoordinationMechanisms: 18
    },

    priorityThemes: {
      labels: [
        "Protection / VBG",
        "Égalité genre",
        "Autonomisation",
        "Leadership",
        "Santé",
        "Éducation",
        "WASH",
        "Nutrition",
        "Paix / Conflits",
        "Handicap"
      ],
      values: [75, 67, 60, 48, 50, 50, 34, 27, 40, 33]
    },

    sectors: {
      labels: [
        "VBG / PEAS",
        "Égalité de genre",
        "Autonomisation / AGR",
        "Éducation",
        "Santé sexuelle et reproductive",
        "Leadership femmes et filles",
        "Protection",
        "Protection de l'enfant",
        "Santé",
        "Prévention des conflits",
        "WASH",
        "Handicap",
        "Nutrition",
        "Sécurité alimentaire",
        "Changements climatiques"
      ],
      values: [75, 67, 60, 50, 50, 48, 48, 43, 41, 40, 34, 33, 27, 25, 22]
    },

    fundingSources: {
      labels: [
        "Fonds propres",
        "ONG internationales",
        "Bailleurs internationaux",
        "Gouvernement",
        "Agences onusiennes",
        "Collectivités locales",
        "Secteur privé",
        "Organisations confessionnelles",
        "Diaspora"
      ],
      values: [79, 51, 39, 24, 10, 9, 9, 3, 2]
    },

    institutionalChallenges: {
      labels: [
        "Manque de financement",
        "Insuffisance de ressources matérielles",
        "Compétences et connaissances limitées",
        "Faible accès aux informations",
        "Risques sécuritaires élevés",
        "Normes genre défavorables au leadership",
        "Forte rotation du personnel"
      ],
      values: [92, 78, 65, 55, 48, 42, 30]
    },

    fundingReductionImpact: {
      labels: [
        "Impact significatif",
        "Impact moyen",
        "Pas d'impact"
      ],
      values: [61, 26, 2],
      percentages: [68, 29, 2]
    },

    anticipatedConsequences: {
      labels: [
        "Accès réduit",
        "Moins de personnel genre",
        "Réponse humanitaire moins sensible au genre",
        "Leadership féminin réduit",
        "Difficulté de plaidoyer",
        "Moins d'intérêt des bailleurs",
        "Autres"
      ],
      values: [64, 48, 52, 35, 40, 30, 18]
    },

    capacityNeeds: {
      labels: [
        "Renforcement des capacités",
        "Mobilisation des ressources",
        "Réseautage des organisations féminines",
        "Visibilité des actions",
        "Accès à l'information",
        "Sécurité du personnel",
        "Participation à la coordination",
        "Données et évidences genre"
      ],
      values: [85, 78, 72, 65, 58, 50, 48, 35]
    },

    coordinationParticipation: {
      labels: [
        "Sous-Cluster VBG",
        "Réseau PEAS",
        "Cluster Protection",
        "Sous-Cluster Protection Enfant",
        "GT ÉGIAH",
        "GT Santé Mentale",
        "GT Engagement Communautaire",
        "Cluster Éducation",
        "Cluster WASH",
        "Sécurité Alimentaire",
        "Logistique"
      ],
      values: [72, 65, 58, 55, 48, 38, 32, 28, 22, 18, 12]
    },

    coordinationSatisfaction: {
      labels: [
        "Très satisfaisant",
        "Satisfaisant",
        "Moyennement satisfaisant",
        "Peu satisfaisant"
      ],
      values: [12, 35, 42, 11]
    }
  },

  humanitarianCoordination: {
    iascGenderAccountability: {
      clustersResponding: 13,
      totalMechanismsTargeted: 17,
      collectSexAgeDisabilityData: 77,
      haveGenderFocalPoint: 69,
      genderAsStrategicPriority: 85,
      includeGenderQuestionsInAssessments: 93,
      consultWomenAndGirlsForGbgRiskMitigation: 69,
      consultWomenRightsOrganizations: 46,
      consultAdolescentGirlLedOrganizations: 23,
      coherentGenderSensitiveMonitoring: 39,
      occasionalGenderSensitiveMonitoring: 54
    }
  },

  keyMessages: [
    {
      title: "La crise renforce les inégalités économiques",
      text: "64,1 % des ménages déclarent un déséquilibre entre revenus et besoins essentiels, tandis que 62,5 % signalent un faible accès au crédit et aux services de soutien.",
      theme: "livelihoods"
    },
    {
      title: "Les femmes supportent une charge domestique élevée",
      text: "77 % des femmes sont engagées dans la collecte d'eau contre 26 % des hommes, renforçant les risques de protection et la charge de travail non rémunérée.",
      theme: "gender"
    },
    {
      title: "Les garçons apparaissent comme un groupe à risque de déscolarisation",
      text: "26,4 % des garçons de 12–17 ans ne sont pas scolarisés contre 18,3 % des filles.",
      theme: "education"
    },
    {
      title: "Les ODF jouent un rôle stratégique mais restent sous-financées",
      text: "89 % des ODF se financent sur fonds propres, tandis que 52 % n'ont reçu aucun financement humanitaire entre 2023 et 2025.",
      theme: "organisations"
    },
    {
      title: "Les adolescentes restent peu consultées dans la coordination",
      text: "Seulement 23 % des mécanismes consultent des organisations dirigées par des adolescentes.",
      theme: "coordination"
    }
  ]
};

/* ============================================================
   Helpers
   ============================================================ */

function getRegionById(id) {
  return DASHBOARD_DATA.regions.find(region => region.id === id);
}

function getRegionByName(name) {
  return DASHBOARD_DATA.regions.find(region => region.name === name);
}

function getRegionalMetric(metricKey) {
  return DASHBOARD_DATA.regions.map(region => ({
    region: region.name,
    value: region[metricKey]
  }));
}

function getTotalAdults() {
  return DASHBOARD_DATA.regions.reduce((sum, region) => sum + region.adults, 0);
}

function getTotalAdolescents() {
  return DASHBOARD_DATA.regions.reduce((sum, region) => sum + region.adolescents, 0);
}

function percentage(part, total) {
  if (!total || total === 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}

window.DASHBOARD_DATA = DASHBOARD_DATA;

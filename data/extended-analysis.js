window.EXTENDED_ANALYSIS = {
  "1": {
    "title": "Vulnérabilités croisées",
    "charts": [
      {
        "type": "grouped",
        "title": "Vulnérabilités des adultes selon le sexe",
        "labels": ["Non-scolarisation", "Veuvage", "Handicap"],
        "series": [
          {"name": "Femmes", "values": [55.5, 13.4, 7.4]},
          {"name": "Hommes", "values": [51.0, 2.1, 4.8]}
        ],
        "suffix": "%",
        "note": "Les écarts sont particulièrement prononcés pour le veuvage et le handicap."
      },
      {
        "type": "grouped",
        "title": "Vulnérabilités des filles et des garçons",
        "labels": ["Non-scolarisation", "Mariage des enfants"],
        "series": [
          {"name": "Filles", "values": [18.3, 23.5]},
          {"name": "Garçons", "values": [26.4, 18.1]}
        ],
        "suffix": "%",
        "note": "La non-scolarisation touche davantage les garçons, tandis que le mariage des enfants affecte davantage les filles."
      },
      {
        "type": "bar",
        "title": "Mariage des enfants selon le statut de résidence",
        "labels": ["Enfants PDI", "Enfants hôtes"],
        "values": [27.8, 17.3],
        "suffix": "%",
        "note": "Le niveau déclaré parmi les enfants PDI dépasse celui des enfants hôtes de 10,5 points."
      }
    ],
    "analysis": [
      "Les vulnérabilités ne suivent pas un schéma unique : les femmes adultes cumulent davantage le veuvage et le handicap, alors que la non-scolarisation des adolescents est plus élevée chez les garçons.",
      "Le mariage des enfants combine un effet de genre et un effet de déplacement : il est plus fréquent chez les filles et chez les enfants PDI.",
      "Le ciblage doit donc croiser sexe, âge, statut de déplacement, handicap et niveau d’instruction plutôt que traiter chaque facteur séparément."
    ]
  },
  "2": {
    "title": "Dynamiques de genre",
    "charts": [
      {
        "type": "grouped",
        "title": "Changements dans la répartition des rôles",
        "labels": ["Travaux domestiques", "Agriculture"],
        "series": [
          {"name": "PDI", "values": [21.1, 79.2]},
          {"name": "Communautés hôtes", "values": [7.3, 31.6]}
        ],
        "suffix": "%",
        "note": "Les changements sont nettement plus fréquents dans les ménages déplacés, surtout dans l’agriculture."
      },
      {
        "type": "grouped",
        "title": "Décisions conjointes déclarées par les hommes PDI",
        "labels": ["Dépenses du ménage", "Scolarisation"],
        "series": [
          {"name": "Avant la crise", "values": [49.2, 63.1]},
          {"name": "Avec la crise", "values": [63.4, 68.9]}
        ],
        "suffix": "%",
        "note": "La concertation progresse, mais les perceptions diffèrent selon le sexe des personnes répondantes."
      },
      {
        "type": "grouped",
        "title": "Décisions prises seules par les femmes PDI",
        "labels": ["Dépenses", "Scolarisation", "Soins aux enfants"],
        "series": [
          {"name": "Avant la crise", "values": [16.3, 13.7, 15.2]},
          {"name": "Avec la crise", "values": [23.9, 21.9, 22.2]}
        ],
        "suffix": "%",
        "note": "La progression traduit une autonomisation contrainte, liée à la prise en charge accrue des responsabilités."
      },
      {
        "type": "grouped",
        "title": "Contrôle de ses propres revenus selon le sexe",
        "labels": ["Ne contrôle pas", "Contrôle"],
        "series": [
          {"name": "Femmes", "values": [60.7, 39.3]},
          {"name": "Hommes", "values": [43.4, 56.6]}
        ],
        "suffix": "%",
        "note": "L’écart de contrôle financier en faveur des hommes atteint 17,3 points."
      }
    ],
    "analysis": [
      "La crise modifie davantage les rôles productifs que les rôles domestiques, ce qui expose les femmes déplacées à une double charge.",
      "L’augmentation de la prise de décision féminine ne signifie pas automatiquement une transformation égalitaire : elle peut résulter de l’absence ou de la perte de moyens des hommes.",
      "Le contrôle des revenus demeure un indicateur central du pouvoir économique réel, distinct de la simple participation aux activités."
    ]
  },
  "3": {
    "title": "Participation et leadership",
    "charts": [
      {
        "type": "grouped",
        "title": "Participation aux instances décisionnelles communautaires",
        "labels": ["PDI", "Communautés hôtes"],
        "series": [
          {"name": "Femmes", "values": [26.8, 31.3]},
          {"name": "Hommes", "values": [56.6, 53.5]}
        ],
        "suffix": "%",
        "note": "L’écart femmes-hommes est de 29,8 points chez les PDI et de 22,2 points dans les communautés hôtes."
      },
      {
        "type": "bar",
        "title": "Présence des femmes dans les organisations féminines",
        "labels": ["Femmes membres"],
        "values": [74.6],
        "suffix": "%",
        "note": "La présence associative des femmes reste concentrée dans les organisations féminines plutôt que dans les espaces décisionnels mixtes."
      }
    ],
    "analysis": [
      "Le déplacement aggrave le déficit de représentation des femmes : les femmes PDI présentent le niveau de participation le plus faible.",
      "La forte présence féminine dans les organisations féminines ne se traduit pas encore par une influence comparable dans les instances communautaires générales.",
      "Les indicateurs de suivi devraient mesurer non seulement la présence, mais aussi la capacité à proposer, négocier et faire adopter des décisions."
    ]
  },
  "4": {
    "title": "Moyens de subsistance",
    "charts": [
      {
        "type": "grouped",
        "title": "Réduction du temps productif agricole",
        "labels": ["PDI", "Communautés hôtes"],
        "series": [
          {"name": "Femmes", "values": [41, 31]},
          {"name": "Hommes", "values": [48, 30]}
        ],
        "suffix": "%",
        "note": "La contraction est plus forte chez les populations déplacées, particulièrement chez les hommes PDI."
      },
      {
        "type": "grouped",
        "title": "Dépendance déclarée à l’aide humanitaire",
        "labels": ["PDI", "Communautés hôtes"],
        "series": [
          {"name": "Femmes", "values": [12.2, 2.6]},
          {"name": "Hommes", "values": [15.1, 2.8]}
        ],
        "suffix": "%",
        "note": "La dépendance est environ cinq fois plus élevée chez les PDI que chez les communautés hôtes."
      },
      {
        "type": "grouped",
        "title": "Inactivité économique selon le sexe et le statut",
        "labels": ["PDI", "Communautés hôtes"],
        "series": [
          {"name": "Femmes", "values": [55.1, 25.9]},
          {"name": "Hommes", "values": [39.4, 10.4]}
        ],
        "suffix": "%",
        "note": "Les femmes déplacées présentent le niveau d’inactivité le plus élevé de toutes les catégories."
      },
      {
        "type": "bar",
        "title": "Principales activités des femmes PDI",
        "labels": ["Commerce", "Travail journalier", "Agriculture"],
        "values": [19.8, 14.6, 7.9],
        "suffix": "%",
        "note": "Les activités déclarées restent concentrées dans des segments précaires et faiblement capitalisés."
      }
    ],
    "analysis": [
      "Le statut de déplacement explique une part majeure de la vulnérabilité économique, mais les femmes PDI cumulent en plus un désavantage lié au genre.",
      "La réduction du temps productif, l’inactivité et la dépendance à l’aide se renforcent mutuellement et limitent la capacité de relèvement autonome.",
      "Les programmes devraient combiner accès aux actifs productifs, financement adapté, garde d’enfants, sécurité et réduction de la charge domestique."
    ]
  },
  "5": {
    "title": "Accès aux services essentiels",
    "charts": [
      {
        "type": "grouped",
        "title": "Accès à l’eau chez les adolescents selon le sexe",
        "labels": ["Filles", "Garçons"],
        "series": [
          {"name": "Accès", "values": [93.1, 92.8]},
          {"name": "Non-accès", "values": [6.9, 7.2]}
        ],
        "suffix": "%",
        "note": "Les différences filles-garçons sont faibles ; le statut de déplacement est plus discriminant."
      },
      {
        "type": "grouped",
        "title": "Accès à l’eau chez les adolescents selon le statut",
        "labels": ["PDI", "Communautés hôtes"],
        "series": [
          {"name": "Accès", "values": [90.0, 94.5]},
          {"name": "Non-accès", "values": [10.0, 5.5]}
        ],
        "suffix": "%",
        "note": "Le non-accès est presque deux fois plus élevé chez les adolescents PDI."
      },
      {
        "type": "grouped",
        "title": "Accès aux latrines chez les adultes",
        "labels": ["Femmes", "Hommes", "PDI", "Communautés hôtes"],
        "series": [
          {"name": "Accès", "values": [77.4, 89.3, 73.8, 89.1]}
        ],
        "suffix": "%",
        "note": "Les femmes et les PDI présentent les niveaux d’accès les plus faibles."
      },
      {
        "type": "grouped",
        "title": "Non-accès aux services de santé sexuelle et reproductive",
        "labels": ["Filles", "Garçons", "PDI adolescents", "Hôtes adolescents", "PDI adultes", "Hôtes adultes"],
        "series": [
          {"name": "Non-accès", "values": [43.4, 47.9, 53.0, 42.1, 38.8, 24.8]}
        ],
        "suffix": "%",
        "note": "Les écarts sont plus marqués selon le statut de déplacement que selon le sexe."
      },
      {
        "type": "grouped",
        "title": "Manque d’intimité dans les abris",
        "labels": ["PDI", "Communautés hôtes"],
        "series": [
          {"name": "Manque d’intimité", "values": [82.9, 47.9]},
          {"name": "Intimité disponible", "values": [17.1, 52.1]}
        ],
        "suffix": "%",
        "note": "Le déficit d’intimité touche plus de quatre PDI sur cinq."
      }
    ],
    "analysis": [
      "Les niveaux nationaux élevés d’accès peuvent masquer des écarts importants selon le statut de résidence et la sécurité réelle de l’accès.",
      "Pour l’eau, les différences selon le sexe des adolescents sont faibles, tandis que le déplacement augmente nettement le non-accès.",
      "L’accès aux latrines, à l’intimité et aux services de santé sexuelle et reproductive montre un cumul de désavantages pour les PDI, avec des effets spécifiques sur les femmes et les filles."
    ]
  },
  "6": {
    "title": "ODF/ODDF",
    "charts": [
      {
        "type": "grouped",
        "title": "Impact de la crise et du financement sur les ODF/ODDF",
        "labels": ["Affectées par la crise", "Affectées par la baisse des financements", "Fonctionnent sur fonds propres"],
        "series": [
          {"name": "Proportion", "values": [98, 98, 89]}
        ],
        "suffix": "%",
        "note": "La combinaison crise-financement fragilise presque toutes les organisations consultées."
      },
      {
        "type": "bar",
        "title": "Effets opérationnels déclarés",
        "labels": ["Réduction des activités", "Hausse des besoins", "Arrêt d’activités"],
        "values": [63, 55, 11],
        "suffix": "%",
        "note": "La réduction des activités intervient alors que les besoins communautaires augmentent."
      },
      {
        "type": "bar",
        "title": "Contraintes majeures des ODF/ODDF",
        "labels": ["Manque de financement", "Insuffisance des ressources", "Faible accès à l’information", "Compétences limitées"],
        "values": [90, 78, 40, 37],
        "suffix": "%",
        "note": "Les contraintes financières dominent, mais les déficits informationnels et techniques restent significatifs."
      },
      {
        "type": "bar",
        "title": "Besoins prioritaires exprimés",
        "labels": ["Mobilisation de ressources", "Renforcement des capacités", "Accès à l’information", "Réseautage", "Participation aux mécanismes"],
        "values": [93, 92, 72, 72, 52],
        "suffix": "%",
        "note": "Les attentes combinent financement, capacités, information et accès aux espaces de coordination."
      }
    ],
    "analysis": [
      "Les organisations sont à la fois des actrices de première ligne et des structures institutionnellement fragilisées par la crise.",
      "Le recours massif aux fonds propres indique une forte capacité d’engagement local, mais aussi un risque d’épuisement organisationnel.",
      "L’appui doit associer financement flexible, renforcement institutionnel, accès à l’information et participation effective aux mécanismes humanitaires."
    ]
  },
  "7": {
    "title": "Réponse humanitaire sensible au genre",
    "charts": [
      {
        "type": "bar",
        "title": "Intégration stratégique et utilisation des données",
        "labels": ["Genre bien pris en compte", "Clusters collectant des données désagrégées", "Clusters avec genre prioritaire"],
        "values": [32.2, 77, 85],
        "suffix": "%",
        "note": "La priorisation et la collecte progressent davantage que la perception d’une prise en compte effective."
      },
      {
        "type": "bar",
        "title": "Besoins de renforcement des capacités",
        "labels": ["Besoin global", "Formation", "Outils pratiques", "Accompagnement technique"],
        "values": [96.6, 81, 74, 56],
        "suffix": "%",
        "note": "Le besoin est quasi universel et porte d’abord sur la formation et les outils opérationnels."
      }
    ],
    "analysis": [
      "Un écart persiste entre engagement stratégique et traduction opérationnelle : seuls 32,2 % des acteurs estiment que le genre est bien pris en compte.",
      "La collecte de données désagrégées ne garantit pas leur utilisation dans le ciblage, la programmation et le suivi.",
      "Le renforcement des capacités doit être continu, pratique et accompagné d’un soutien technique permettant l’application dans les projets et mécanismes de coordination."
    ]
  }
};

window.PORTAL_DATA = {
  meta: {
    title: "Analyse conjointe genre",
    subtitle: "Pour une réponse humanitaire et un relèvement inclusif",
    year: 2026,
    respondents: 3681,
    regions: 7,
    adolescents: 1864,
    adults: 1827,
    pdi: 1300,
    hosts: 2391,
    womenGirls: 1796,
    menBoys: 1895,
    odf: 89,
    humanitarianActors: 148,
    interviews: 54,
    focusGroups: 66,
    geography: ["Bankui", "Goulmou", "Kadiogo", "Koulsé", "Liptako", "Nakambé", "Yaadga"]
  },
  methodology: {
    pillars: [
      {title:"Revue documentaire", text:"Analyse des sources institutionnelles, évaluations sectorielles et travaux antérieurs sur le genre et l’inclusion."},
      {title:"Enquête quantitative", text:"Questionnaires individuels administrés aux adultes et aux adolescent·e·s, auprès des PDI et des communautés hôtes."},
      {title:"Approche qualitative", text:"54 entretiens individuels et 66 groupes de discussion avec femmes, hommes, filles, garçons et personnes ressources."},
      {title:"Consultations en ligne", text:"Sondages auprès de 148 acteurs humanitaires et de 89 organisations dirigées par des femmes."},
      {title:"Protection et éthique", text:"Consentement éclairé, confidentialité, anonymisation, prévention VBG/PEAS et mécanismes de référencement."}
    ]
  },
  chapters: [
    {
      id:"vulnerabilites", number:1, color:"#6F2C91", accent:"#A953C6",
      title:"Vulnérabilités croisées : des inégalités renforcées",
      summary:"La crise amplifie des vulnérabilités déjà structurelles. Les écarts les plus marqués concernent la non-scolarisation, le mariage des enfants, le veuvage et le handicap, avec des cumuls particulièrement critiques chez les femmes, les filles et les PDI.",
      kpis:[
        {value:"55,5 %", label:"des femmes adultes non scolarisées"},
        {value:"13,4 %", label:"de veuvage chez les femmes, contre 2,1 % chez les hommes"},
        {value:"20,6 %", label:"des adolescent·e·s déclarent être marié·e·s"},
        {value:"6,1 %", label:"de prévalence déclarée du handicap chez les adultes"}
      ],
      charts:[
        {type:"bar", title:"Non-scolarisation des adultes par région", labels:["Bankui","Goulmou","Kadiogo","Koulsé","Liptako","Nakambé","Yaadga"], values:[45.8,71.7,33.8,54.3,57.3,53.7,55.5], suffix:"%"},
        {type:"bar", title:"Mariage des enfants par région", labels:["Bankui","Goulmou","Kadiogo","Koulsé","Liptako","Nakambé","Yaadga"], values:[24.2,12.4,5.4,21.7,39.3,18.5,25.6], suffix:"%"}
      ],
      insights:[
        "Le Goulmou présente le taux de non-scolarisation adulte le plus élevé (71,7 %), soit plus du double du Kadiogo, zone témoin.",
        "Le Liptako concentre plusieurs facteurs de risque : forte non-scolarisation, mariage des enfants élevé et prévalence du handicap supérieure à la moyenne.",
        "Les femmes sont environ six fois plus exposées au veuvage que les hommes, ce qui augmente le risque de pauvreté et de chefferie de ménage sans ressources suffisantes."
      ],
      actions:["Cibler les zones de cumul de vulnérabilités avec des paquets multisectoriels.","Renforcer le maintien scolaire, notamment des garçons en zones humanitaires.","Intégrer systématiquement sexe, âge, handicap et statut de déplacement dans le ciblage."]
    },
    {
      id:"dynamiques", number:2, color:"#A84324", accent:"#F07A2B",
      title:"Crise et dynamiques de genre : changements inéquitables",
      summary:"La crise reconfigure les rôles sans supprimer les inégalités. Les femmes assument davantage de responsabilités économiques et domestiques, mais leur contrôle des revenus et leur pouvoir de décision restent limités.",
      kpis:[
        {value:"60,7 %", label:"des femmes ne contrôlent pas seules leurs revenus"},
        {value:"79,2 %", label:"des PDI signalent une évolution des rôles dans l’agriculture"},
        {value:"54,9 %", label:"des femmes étaient entièrement responsables de la cuisine avant la crise"},
        {value:"8,1 %", label:"des hommes étaient entièrement engagés dans le travail domestique"}
      ],
      charts:[
        {type:"grouped", title:"Évolution de l’engagement depuis la crise", labels:["Agriculture","Soins des enfants","Collecte d’eau","Bois","Travail domestique","Achat nourriture"], series:[{name:"Femmes PDI", values:[74.3,28.3,34.7,54.8,21,36.4]},{name:"Hommes PDI", values:[84.3,44.3,28.3,24.3,21.2,49.2]}], suffix:"%"}
      ],
      insights:["Les changements sont plus prononcés chez les PDI que chez les communautés hôtes, signe d’une adaptation contrainte par le déplacement.","La redistribution des tâches reste partielle : la cuisine, les soins et le travail domestique demeurent fortement féminisés.","La progression des décisions conjointes ne signifie pas nécessairement un contrôle égal des ressources."],
      actions:["Financer des programmes de transformation des normes sociales.","Réduire la charge de soins non rémunérés par des services de proximité.","Mesurer séparément participation, influence et contrôle effectif des ressources."]
    },
    {
      id:"participation", number:3, color:"#273E8B", accent:"#4D70E8",
      title:"Participation communautaire et leadership : pouvoir limité des femmes",
      summary:"La visibilité des femmes augmente dans les espaces associatifs, mais leur influence demeure faible dans les structures décisionnelles. Les femmes déplacées sont les plus éloignées des espaces de pouvoir.",
      kpis:[
        {value:"26,8 %", label:"de participation décisionnelle chez les femmes PDI"},
        {value:"56,6 %", label:"chez les hommes PDI"},
        {value:"31,3 %", label:"chez les femmes hôtes"},
        {value:"74,6 %", label:"des femmes appartiennent à des organisations féminines"}
      ],
      charts:[
        {type:"bar", title:"Participation aux instances décisionnelles", labels:["Hommes PDI","Femmes PDI","Hommes hôtes","Femmes hôtes"], values:[56.6,26.8,53.5,31.3], suffix:"%"}
      ],
      insights:["L’écart de participation entre hommes et femmes dépasse 20 points quel que soit le statut de résidence.","L’appartenance à une organisation féminine ne se traduit pas automatiquement par une influence sur les décisions communautaires.","Le manque de temps, les normes sociales, la peur et les responsabilités domestiques constituent des barrières cumulatives."],
      actions:["Introduire des mécanismes de représentation minimale et d’influence mesurable.","Financer la participation des femmes : transport, garde d’enfants, traduction et accessibilité.","Suivre la qualité de la participation, pas seulement la présence."]
    },
    {
      id:"subsistance", number:4, color:"#8E351D", accent:"#E76F2E",
      title:"Moyens de subsistance : vulnérabilité économique des PDI et des femmes",
      summary:"Le déplacement provoque une perte massive d’activités rémunérées, particulièrement chez les femmes. L’accès à la terre, au capital, aux marchés et aux équipements demeure profondément inégal.",
      kpis:[
        {value:"55,1 %", label:"des femmes PDI sans activité rémunérée"},
        {value:"39,4 %", label:"des hommes PDI sans activité rémunérée"},
        {value:"19,8 %", label:"des femmes PDI actives dans le petit commerce"},
        {value:"7,9 %", label:"des femmes PDI actives dans l’agriculture"}
      ],
      charts:[
        {type:"grouped", title:"Inactivité économique selon le sexe et le statut", labels:["Femmes","Hommes"], series:[{name:"PDI", values:[55.1,39.4]},{name:"Hôtes", values:[25.9,10.4]}], suffix:"%"},
        {type:"bar", title:"Activités principales des femmes PDI", labels:["Petit commerce","Travail journalier","Agriculture"], values:[19.8,14.6,7.9], suffix:"%"}
      ],
      insights:["Une femme PDI sur deux est sans activité rémunérée, ce qui révèle un risque majeur de dépendance économique et de stratégies négatives de survie.","Le petit commerce reste le principal point d’entrée économique, mais il exige un fonds de roulement et un accès sûr au marché.","L’effondrement de l’agriculture chez les PDI traduit une exclusion foncière et productive, pas seulement une perte temporaire de revenus."],
      actions:["Prioriser des subventions flexibles et des transferts productifs pour les femmes PDI.","Coupler moyens de subsistance, protection, santé mentale et garde d’enfants.","Sécuriser l’accès à la terre, aux intrants, au crédit et aux marchés."]
    },
    {
      id:"services", number:5, color:"#174E2B", accent:"#3FA24C",
      title:"Accès sûr et équitable aux services essentiels",
      summary:"Les niveaux d’accès globaux masquent des écarts profonds selon le sexe, l’âge, le statut de déplacement et la région. Santé mentale, santé sexuelle et reproductive, sécurité alimentaire et protection constituent les principaux points critiques.",
      kpis:[
        {value:"72,6 %", label:"des adultes PDI déclarent des difficultés de santé mentale"},
        {value:"45,8 %", label:"des adolescent·e·s sans accès aux services de SSR"},
        {value:"71,5 %", label:"des adultes sans soutien psychosocial"},
        {value:"32,1 %", label:"des VBG rapportées au domicile"}
      ],
      charts:[
        {type:"bar", title:"Lieux de survenue des VBG", labels:["Domicile","Brousse","Points d’eau","École","Marché","Latrines/douches","Services humanitaires"], values:[32.1,32,19.9,15.5,14.7,10,9], suffix:"%"},
        {type:"bar", title:"Non-accès à la SSR", labels:["Adultes PDI","Adultes hôtes","Adolescent·e·s PDI","Adolescent·e·s hôtes"], values:[38.8,24.8,53,42.1], suffix:"%"}
      ],
      insights:["La vulnérabilité est intersectorielle : les mêmes groupes cumulent insécurité alimentaire, santé mentale, manque d’information et risques de protection.","Les espaces ordinaires de la vie quotidienne — domicile, brousse, eau, école et marché — sont aussi des espaces de risque de VBG.","L’accès nominal à un service ne garantit ni sécurité, ni qualité, ni accessibilité financière."],
      actions:["Déployer des services intégrés de proximité dans les zones à forte concentration de PDI.","Renforcer les mécanismes confidentiels de référencement VBG et PSS.","Mesurer l’accès effectif : coût, distance, sécurité, qualité et satisfaction."]
    },
    {
      id:"odf", number:6, color:"#252D80", accent:"#4856E8",
      title:"Des ODF au potentiel sous-exploité",
      summary:"Les organisations dirigées par des femmes disposent d’un fort ancrage communautaire et d’un leadership élevé, mais leur potentiel reste limité par le sous-financement, l’accès inégal à l’information et une participation souvent peu influente aux mécanismes de coordination.",
      kpis:[
        {value:"98 %", label:"des ODF affectées par la crise humanitaire"},
        {value:"52 %", label:"sans financement humanitaire entre 2023 et 2025"},
        {value:"89 %", label:"fonctionnent sur fonds propres ou appuis ponctuels"},
        {value:"84 %", label:"participent à au moins un cadre de coordination"}
      ],
      charts:[
        {type:"bar", title:"Contraintes majeures exprimées par les ODF", labels:["Manque de financement","Insuffisance des ressources","Faible accès à l’information","Compétences limitées"], values:[90,78,40,37], suffix:"%"},
        {type:"bar", title:"Besoins prioritaires des ODF", labels:["Mobilisation de ressources","Renforcement de capacités","Accès à l’information","Réseautage","Participation aux mécanismes"], values:[93,92,72,72,52], suffix:"%"}
      ],
      insights:["Le déficit de financement est structurel : il affecte directement la continuité des activités et la capacité de déploiement dans les zones difficiles d’accès.","La participation aux cadres de coordination reste élevée en apparence, mais l’accès à l’information et le pouvoir d’influence demeurent limités.","Les ODF peuvent améliorer le ciblage, la confiance communautaire et la redevabilité, à condition d’être financées comme partenaires stratégiques."],
      actions:["Créer des guichets de financement direct, souples et pluriannuels.","Simplifier les exigences administratives et accompagner la conformité.","Institutionnaliser la représentation des ODF dans les mécanismes de décision."]
    },
    {
      id:"reponse", number:7, color:"#4A1E66", accent:"#A03FC4",
      title:"Une réponse humanitaire sensible et transformatrice : défis persistants",
      summary:"L’intégration du genre progresse dans les stratégies et les outils, mais elle reste insuffisamment systématique, financée et suivie. L’enjeu n’est plus seulement l’engagement, mais la qualité de l’opérationnalisation.",
      kpis:[
        {value:"32,2 %", label:"des acteurs jugent le genre bien pris en compte"},
        {value:"77 %", label:"des clusters collectent des données désagrégées"},
        {value:"85 %", label:"des clusters font du genre une priorité stratégique"},
        {value:"96,6 %", label:"expriment un besoin de renforcement des capacités"}
      ],
      charts:[
        {type:"bar", title:"Besoins de renforcement des capacités", labels:["Formation","Outils pratiques","Accompagnement technique"], values:[81,74,56], suffix:"%"},
        {type:"bar", title:"Maturité de l’intégration du genre", labels:["Priorité stratégique","Données désagrégées","Suivi cohérent par indicateurs"], values:[85,77,39], suffix:"%"}
      ],
      insights:["L’écart entre engagement stratégique (85 %) et suivi cohérent (39 %) révèle une faiblesse d’institutionnalisation.","La collecte de données désagrégées ne produit de valeur que si elle influence le ciblage, le financement, la programmation et le suivi.","Les points focaux genre restent souvent peu dotés en temps, ressources et autorité."],
      actions:["Intégrer des indicateurs genre obligatoires dans les cadres de performance des clusters.","Budgétiser explicitement les adaptations inclusives et transformatrices.","Renforcer l’accompagnement technique continu plutôt que les formations ponctuelles."]
    }
  ]
};

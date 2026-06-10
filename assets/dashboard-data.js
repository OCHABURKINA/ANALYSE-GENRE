const DASHBOARD_DATA = {
  samples:{
    totalRespondents:3681,
    adults:1827,
    adolescents:1864,
    pdi:1300,
    hosts:2391,
    women:922,
    men:905,
    girls:874,
    boys:990,
    odf:89,
    humanitarianActors:148,
    interviews:54,
    focusGroups:66
  },

  regions:[
    {name:"Bankui",adults:166,adolescents:165,total:331,food:74,health:64,cash:37},
    {name:"Goulmou",adults:198,adolescents:251,total:449,food:80,health:66,cash:41},
    {name:"Kadiogo",adults:237,adolescents:276,total:513,food:69,health:60,cash:35},
    {name:"Koulsé",adults:317,adolescents:309,total:626,food:85,health:70,cash:40},
    {name:"Liptako",adults:274,adolescents:224,total:498,food:85,health:72,cash:44},
    {name:"Nakambé",adults:298,adolescents:292,total:590,food:72,health:65,cash:42},
    {name:"Yaadga",adults:337,adolescents:347,total:684,food:83,health:68,cash:38}
  ],

  genre:{
    priorityNeeds:{
      labels:["Alimentation","Santé","Argent","Moyens de subsistance","Éducation","Logement","Protection","Eau"],
      women:[76.2,66.9,41.0,26.4,26.5,23.2,12.6,20.7],
      men:[81.5,70.2,42.3,27.4,23.8,24.5,14.7,15.6]
    },

    educationAdolescents:{
      labels:["Aucun","Primaire","Post-primaire","Secondaire","Alphabétisation"],
      girls:[18.3,23.0,16.8,37.9,3.0],
      boys:[26.4,23.7,12.9,32.8,2.6]
    },

    livelihoods:{
      key:[
        {label:"Revenus insuffisants",value:64.1},
        {label:"Faible accès crédit / soutien",value:62.5},
        {label:"Accès limité à la terre",value:38.8},
        {label:"Insécurité ressources",value:24.9},
        {label:"Normes genre défavorables",value:13.4}
      ],
      bySex:{
        labels:["Crédit / soutien","Accès terre","VBG","EAS","Insécurité ressources","Engins explosifs"],
        women:[63.4,38.8,7.9,1.0,22.1,3.0],
        men:[61.4,38.7,7.7,6.4,27.7,8.0]
      }
    },

    roles:[
      {task:"Cuisine",women:88,men:15},
      {task:"Travail ménager",women:85,men:32},
      {task:"Collecte d'eau",women:77,men:26},
      {task:"Collecte du bois",women:65,men:23},
      {task:"Soins aux enfants",women:86,men:86},
      {task:"Élevage",women:47,men:72},
      {task:"Agriculture",women:69,men:76},
      {task:"Achat nourriture",women:53,men:76}
    ],

    decision:{
      womenCommunityParticipation:29.6,
      menCommunityParticipation:54.7,
      womenListened:46.5,
      womenPartiallyListened:30.9
    },

    protection:{
      gbvContexts:{
        labels:["Domicile","Brousse / bois","Points d'eau","École","Marché","Latrines","Services humanitaires","Ne sait pas"],
        values:[32.1,32.0,19.9,15.5,14.7,10.0,9.0,40.5]
      },
      gbvCases:3750,
      womenShare:87,
      girlsShare:11
    },

    health:{
      mentalHealthAdults:66,
      noPsychosocialSupport:70,
      srhNoAccessAdolescents:45.8,
      srhNoAccessPdiAdolescents:53
    }
  },

  organisations:{
    odf:89,
    actors:148,
    womenLeadershipAbove50:97,
    womenFirstResponsible:89,
    ownFunds:89,
    noHumanitarianFunding:52,
    coordinationParticipation:84,
    unawareCoordination:18,

    sectors:{
      labels:["VBG / PEAS","Égalité genre","Autonomisation","Éducation","SSR","Leadership","Protection","Protection enfant","Santé","WASH"],
      values:[75,67,60,50,50,48,48,43,41,34]
    },

    funding:{
      labels:["Fonds propres","ONG internationales","Bailleurs","Gouvernement","Agences UN","Collectivités","Secteur privé"],
      values:[79,51,39,24,10,9,9]
    },

    challenges:{
      labels:["Manque financement","Ressources matérielles","Compétences limitées","Accès information","Risques sécuritaires","Normes défavorables","Rotation personnel"],
      values:[92,78,65,55,48,42,30]
    },

    coordination:{
      labels:["Sous-Cluster VBG","Réseau PEAS","Cluster Protection","Protection Enfant","GT ÉGIAH","GT Santé mentale","Engagement communautaire"],
      values:[72,65,58,55,48,38,32]
    },

    iasc:{
      labels:[
        "Questions genre dans évaluations",
        "Genre priorité stratégique",
        "Données sexe âge handicap",
        "Consultation femmes/filles VBG",
        "Point focal genre",
        "Suivi ponctuel genre",
        "Consultation organisations femmes",
        "Suivi cohérent genre",
        "Consultation organisations adolescentes"
      ],
      values:[93,85,77,69,69,54,46,39,23]
    }
  }
};

window.DASHBOARD_DATA = DASHBOARD_DATA;

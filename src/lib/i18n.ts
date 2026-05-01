export type Lang = "en" | "te";

export const translations = {
  en: {
    "hero.eyebrow": "ॐ   SACRED WALL ART   ॐ",
    "hero.title.a": "Ancient Wisdom",
    "hero.title.b": "For Modern Walls",
    "hero.tagline":
      "Yoga is skill in action — Bhagavad Gita 2.50. Bring centuries of devotion onto your walls with verses, portraits, and hand-written calligraphy printed in the UK.",
    "hero.cta.shop": "Shop Wall Art",
    "hero.cta.custom": "Custom Quote Builder",
    "section.featured": "Featured Gita Quotes",
    "section.featured.sub": "Timeless verses, beautifully framed for daily inspiration",
    "section.portraits": "Hindu God Portraits",
    "section.portraits.sub": "Devotional art of beloved deities",
    "section.testimonials": "Words from Our Devotees",
    "stat.designs": "Sacred Designs",
    "stat.rating": "Customer Rating",
    "stat.uk": "UK Printed",
    "about.title": "About the Bhagavad Gita",
    "about.what.title": "What is the Gita",
    "about.what.body":
      "The Bhagavad Gita ('The Song of God') is a 700-verse Hindu scripture, part of the Mahabharata, in which Lord Krishna guides Prince Arjuna on the battlefield of Kurukshetra.",
    "about.teach.title": "Core Teachings",
    "about.teach.body":
      "The Gita teaches three intertwined paths — Karma Yoga (selfless action), Bhakti Yoga (loving devotion), and Jnana Yoga (the wisdom of the eternal Self).",
    "about.mission.title": "Our Mission at DivineVerse Art",
    "about.mission.body":
      "We craft authentic Sanskrit verses with Telugu and English translations as wall art — bringing the living tradition into modern, mindful homes.",
  },
  te: {
    "hero.eyebrow": "ॐ   పవిత్ర గోడ కళ   ॐ",
    "hero.title.a": "ఆధునిక గోడలకు",
    "hero.title.b": "ప్రాచీన జ్ఞానం",
    "hero.tagline":
      "యోగః కర్మసు కౌశలమ్ — భగవద్గీత 2.50. శతాబ్దాల భక్తిని శ్లోకాలు, చిత్రాలు, చేతితో రాసిన కాలిగ్రఫీ రూపంలో మీ గోడలపైకి తీసుకురండి. యూకేలో ముద్రించబడింది.",
    "hero.cta.shop": "షాపింగ్ చేయండి",
    "hero.cta.custom": "మీ స్వంత శ్లోకం",
    "section.featured": "ప్రముఖ గీత శ్లోకాలు",
    "section.featured.sub": "నిత్య ప్రేరణ కోసం అందమైన శాశ్వత శ్లోకాలు",
    "section.portraits": "హిందూ దేవతా చిత్రాలు",
    "section.portraits.sub": "ప్రియమైన దేవతల భక్తి కళ",
    "section.testimonials": "మా భక్తుల మాటలు",
    "stat.designs": "పవిత్ర డిజైన్లు",
    "stat.rating": "కస్టమర్ రేటింగ్",
    "stat.uk": "యూకే ముద్రణ",
    "about.title": "భగవద్గీత గురించి",
    "about.what.title": "భగవద్గీత అంటే ఏమిటి?",
    "about.what.body":
      "భగవద్గీత అంటే 'భగవంతుని పాట'. ఇది మహాభారతంలో భాగమైన 700 శ్లోకాల హిందూ గ్రంథం. కురుక్షేత్ర యుద్ధభూమిలో శ్రీకృష్ణుడు అర్జునుడికి బోధించిన జ్ఞానమిది.",
    "about.teach.title": "ప్రధాన బోధనలు",
    "about.teach.body":
      "గీత కర్మ యోగం (నిష్కామ కర్మ), భక్తి యోగం (ప్రేమ భక్తి), మరియు జ్ఞాన యోగం (శాశ్వత ఆత్మ జ్ఞానం) — ఈ మూడు మార్గాలను బోధిస్తుంది.",
    "about.mission.title": "దివైన్‌వర్స్ ఆర్ట్ మా లక్ష్యం",
    "about.mission.body":
      "అసలైన సంస్కృత శ్లోకాలను తెలుగు మరియు ఆంగ్ల అనువాదాలతో వాల్ ఆర్ట్‌గా తయారు చేస్తాము — ఆధునిక భక్తి కలిగిన ఇళ్లలోకి జీవంత సంప్రదాయాన్ని తెస్తాము.",
  },
} as const;

export type TKey = keyof typeof translations["en"];

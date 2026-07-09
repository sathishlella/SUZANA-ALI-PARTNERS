export const firm = {
  name: "Suzana Ali & Partners",
  descriptor: "Advocates & Solicitors",
  established: "Established 01.01.2020",
  profileUrl: "/downloads/suzana-ali-partners-firm-profile-2026.pdf",
  primaryPhone: "+603 6414 3696",
  mobilePhone: "+6011 2345 4565",
  serembanPhone: "+6011 5641 6548",
  ipohPhone: "+605 210 6696",
  klEmail: "admin.kl@suzanaali.com",
  nsEmail: "admin.ns@suzanaali.com",
  ipohEmail: "admin.perak@suzanaali.com",
  offices: [
    {
      id: "kota-damansara",
      city: "Kota Damansara",
      label: "Petaling Jaya - Selangor",
      address: "D-2-2 Menara Mitraland, Jalan PJU 5/1, PJU 5, Kota Damansara, 47810 Petaling Jaya, Selangor",
      phone: "+603 6414 3696 / +6011 2345 4565",
      email: "admin.kl@suzanaali.com",
      emailEnv: "SUZANA_EMAIL"
    },
    {
      id: "seremban",
      city: "Seremban",
      label: "Seremban - Negeri Sembilan",
      address: "13A, No. 548 Jalan TBK 2/9, Taman Bukit Kepayang, 70200 Seremban, Negeri Sembilan",
      phone: "+6011 5641 6548",
      email: "admin.ns@suzanaali.com",
      emailEnv: "SUZANA_EMAIL"
    },
    {
      id: "ipoh",
      city: "Ipoh",
      label: "Ipoh - Perak",
      address: "No.37A, First Floor, Hala Pusat Perdagangan Canning I, Pusat Perdagangan Canning II, 30350 Ipoh, Perak",
      phone: "+605 210 6696 / +6011 2345 4565",
      email: "admin.perak@suzanaali.com",
      emailEnv: "SUZANA_EMAIL"
    }
  ]
};

export const partners = [
  {
    id: "suzana",
    name: "Suzana Ali",
    title: "Partner",
    qualification: "Bachelor of Laws (LLB Hons), IIUM; Master of Laws (LLM), UiTM; Doctor of Business Administration (DBA), Taylor's University",
    photo: "/images/suzana-portrait.png"
  },
  {
    id: "shahriman",
    name: "Shahriman Ruslan",
    title: "Partner",
    qualification: "Bachelor of Laws (LLB Hons), IIUM",
    photo: "/images/shahriman-ruslan.png"
  },
  {
    id: "nur-farahizzah",
    name: "Nur Farahizzah Ahmad Nazri",
    title: "Partner",
    qualification: "Bachelor of Laws (LLB Hons), IIUM",
    photo: "/images/nur-farahizzah.png"
  },
  {
    id: "muhammad-idzzul",
    name: "Muhammad Idzzul Wajdi Bin Zubaralhadi",
    title: "Lawyer",
    qualification: "Bachelor of Laws (Hons), Universiti Sultan Zainal Abidin (UniSZA)",
    photo: "/images/muhammad-idzzul.jpg"
  },
  {
    id: "nur-izzatul",
    name: "Nur Izzatul Nabilah binti Mohd Nusi",
    title: "Lawyer",
    qualification: "Bachelor of Laws (Hons), Universiti Malaya",
    photo: "/images/nur-izzatul.jpg"
  }
];

export const practiceGroups = [
  {
    title: "Banking, Finance & Recovery",
    summary:
      "Islamic and conventional finance, banking disputes, insolvency, bankruptcy, debt recovery and execution proceedings.",
    matters: [
      "Banking law",
      "Islamic finance",
      "Conventional finance",
      "Debt recovery",
      "Bankruptcy & insolvency",
      "Enforcement proceedings"
    ]
  },
  {
    title: "Litigation & Dispute Resolution",
    summary: "Civil litigation, defamation, commercial disagreements, landlord and tenant disputes, and courtroom advocacy.",
    matters: ["Civil litigation", "Commercial disputes", "Defamation", "Landlord & tenant", "Criminal law"]
  },
  {
    title: "Corporate, Commercial & Government",
    summary: "Corporate law, commercial law, contractual disputes, government contracts and institutional advisory.",
    matters: ["Corporate law", "Commercial law", "Government contracts", "Government loans", "Contractual disputes"]
  },
  {
    title: "Property, Family & Private Client",
    summary: "Property law, conveyancing, employment, family law, trusts, wills, probate and inheritance matters.",
    matters: ["Property & conveyancing", "Employment law", "Family law", "Trusts & wills", "Probate & inheritance"]
  },
  {
    title: "Regulated & Cross-Border Matters",
    summary: "Customs, immigration and advisory for clients navigating regulated or multi-jurisdictional matters.",
    matters: ["Customs", "Immigration", "Institutional advisory", "Embassy matters", "Regulatory response"]
  }
];

export const panelPartners = [
  { name: "Medical Device Authority, Ministry of Health Malaysia", logo: "/logos/medical-device-authority.png" },
  { name: "Amanah Ikhtiar Malaysia", logo: "/logos/amanah-ikhtiar-malaysia.png" },
  { name: "Wasiyyah Shoppe Berhad", logo: "/logos/wasiyyah-shoppe.png" },
  { name: "Inda Architect", logo: "/logos/inda-architect.jpg" },
  { name: "Embassy of the Kingdom of Bahrain, Malaysia", logo: "/logos/kingdom-of-bahrain.png" },
  { name: "Maahad Tahfiz Harun Al-Masri", logo: "/logos/maahad-tahfiz-harun-al-masri.jpg" },
  { name: "LPPSA", logo: "/logos/lppsa.jpg" },
  { name: "Maybank Berhad / Maybank Islamic Berhad", logo: "/logos/maybank.png" },
  { name: "Public Bank Berhad / Public Islamic Berhad", logo: "/logos/public-bank.png" },
  { name: "United Overseas Bank", logo: "/logos/uob.jpg" },
  { name: "Hong Leong Bank Berhad / Hong Leong Islamic Berhad", logo: "/logos/hong-leong-bank.png" },
  { name: "AmBank Islamic Berhad", logo: "/logos/ambank.png" },
  { name: "RHB Bank", logo: "/logos/rhb.png" },
  { name: "Bank Islam Malaysia Berhad", logo: "/logos/bank-islam.png" }
];

export const matterTypes = [
  "Banking, finance or insolvency",
  "Civil litigation or dispute",
  "Property or conveyancing",
  "Corporate, commercial or contract",
  "Probate, wills or inheritance",
  "Family, employment or private client",
  "Customs, immigration or regulated matter"
];

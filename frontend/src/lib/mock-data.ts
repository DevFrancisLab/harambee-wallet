export interface Fundraiser {
  id: string;
  title: string;
  story: string;
  category: "Medical" | "School Fees" | "Community" | "Emergency";
  goalAmount: number;
  raisedAmount: number;
  contributorCount: number;
  organizer: string;
  organizerAvatar: string;
  createdAt: string;
  contributors: Contributor[];
}

export interface Contributor {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  time: string;
  verified: boolean;
}

export const mockFundraisers: Fundraiser[] = [
  {
    id: "1",
    title: "Help Amina's Family with Hospital Bills",
    story: "Amina's mother was admitted for emergency surgery. The family needs support to cover the medical bills. Every contribution counts and brings hope to the family during this difficult time.",
    category: "Medical",
    goalAmount: 50000,
    raisedAmount: 32500,
    contributorCount: 48,
    organizer: "James Mwangi",
    organizerAvatar: "JM",
    createdAt: "2026-02-15",
    contributors: [
      { id: "c1", name: "Sarah Wanjiku", avatar: "SW", amount: 2000, time: "2 hours ago", verified: true },
      { id: "c2", name: "Peter Ochieng", avatar: "PO", amount: 5000, time: "5 hours ago", verified: true },
      { id: "c3", name: "Grace Akinyi", avatar: "GA", amount: 1000, time: "1 day ago", verified: true },
      { id: "c4", name: "David Kimani", avatar: "DK", amount: 3000, time: "1 day ago", verified: true },
      { id: "c5", name: "Faith Njeri", avatar: "FN", amount: 500, time: "2 days ago", verified: true },
    ],
  },
  {
    id: "2",
    title: "School Fees for Bright Futures Academy",
    story: "15 children from our community need help paying their school fees for next term. Education is the pathway to a better future for these children.",
    category: "School Fees",
    goalAmount: 120000,
    raisedAmount: 78000,
    contributorCount: 92,
    organizer: "Mary Wambui",
    organizerAvatar: "MW",
    createdAt: "2026-02-10",
    contributors: [
      { id: "c6", name: "John Kamau", avatar: "JK", amount: 10000, time: "3 hours ago", verified: true },
      { id: "c7", name: "Lucy Muthoni", avatar: "LM", amount: 2500, time: "8 hours ago", verified: true },
      { id: "c8", name: "Moses Kipchoge", avatar: "MK", amount: 5000, time: "1 day ago", verified: true },
    ],
  },
  {
    id: "3",
    title: "Community Well Water Project",
    story: "Our village needs a clean water well. Together we can provide safe drinking water for over 200 families. Clean water changes everything.",
    category: "Community",
    goalAmount: 250000,
    raisedAmount: 145000,
    contributorCount: 156,
    organizer: "Joseph Otieno",
    organizerAvatar: "JO",
    createdAt: "2026-01-28",
    contributors: [
      { id: "c9", name: "Agnes Chebet", avatar: "AC", amount: 15000, time: "1 hour ago", verified: true },
      { id: "c10", name: "Robert Njoroge", avatar: "RN", amount: 3000, time: "6 hours ago", verified: true },
    ],
  },
  {
    id: "4",
    title: "Emergency Flood Relief for Tana River",
    story: "Families displaced by recent floods need immediate food, shelter, and medical supplies. Let's come together to help our neighbors in their time of need.",
    category: "Emergency",
    goalAmount: 80000,
    raisedAmount: 61000,
    contributorCount: 73,
    organizer: "Ruth Auma",
    organizerAvatar: "RA",
    createdAt: "2026-02-22",
    contributors: [
      { id: "c11", name: "Daniel Wekesa", avatar: "DW", amount: 8000, time: "30 min ago", verified: true },
      { id: "c12", name: "Esther Nyambura", avatar: "EN", amount: 1500, time: "4 hours ago", verified: true },
    ],
  },
];

export const mockUserProfile = {
  name: "Amara Osei",
  email: "amara@example.com",
  walletCreated: true,
  totalContributed: 15500,
  fundraisersCreated: 2,
  contributions: [
    { fundraiserTitle: "Help Amina's Family with Hospital Bills", amount: 5000, date: "2026-02-20" },
    { fundraiserTitle: "School Fees for Bright Futures Academy", amount: 2500, date: "2026-02-18" },
    { fundraiserTitle: "Community Well Water Project", amount: 3000, date: "2026-02-12" },
    { fundraiserTitle: "Emergency Flood Relief for Tana River", amount: 5000, date: "2026-02-25" },
  ],
};

export const allLedgerEntries = mockFundraisers.flatMap((f) =>
  f.contributors.map((c) => ({
    ...c,
    fundraiserTitle: f.title,
    fundraiserId: f.id,
  }))
);

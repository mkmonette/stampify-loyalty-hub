// LocalStorage-backed lightweight data layer for core features
// NOTE: This is a simple in-browser store and not suitable for production.

export type ID = string;

export type Campaign = {
  id: ID;
  name: string;
  description?: string;
  stampsRequired: number;
  active: boolean;
  createdAt: string;
};

export type Reward = {
  id: ID;
  name: string;
  description?: string;
  stampsRequired: number; // required stamps to redeem
  active: boolean;
  createdAt: string;
};

export type Coupon = {
  id: ID;
  code: string;
  discount: number; // percent 0-100
  expiresAt?: string; // ISO
  active: boolean;
  createdAt: string;
};

export type LoyaltyCard = {
  id: ID;
  customerId: ID;
  campaignId: ID;
  stamps: number;
  updatedAt: string;
};

export type Redemption = {
  id: ID;
  userId: ID;
  rewardId: ID;
  date: string;
};

export type Referral = {
  id: ID;
  ownerUserId: ID;
  code: string;
  referredCount: number;
  createdAt: string;
};

const DB = {
  campaigns: 'db_campaigns',
  rewards: 'db_rewards',
  coupons: 'db_coupons',
  cards: 'db_loyalty_cards',
  redemptions: 'db_redemptions',
  referrals: 'db_referrals',
} as const;

type Key = typeof DB[keyof typeof DB];

function read<T>(key: Key): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: Key, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid() {
  return crypto.randomUUID();
}

// Campaigns
export const Campaigns = {
  list: (): Campaign[] => read<Campaign>(DB.campaigns),
  add: (input: Omit<Campaign, 'id' | 'createdAt'>): Campaign => {
    const next: Campaign = { id: uid(), createdAt: new Date().toISOString(), ...input };
    const items = Campaigns.list();
    write(DB.campaigns, [next, ...items]);
    return next;
  },
  update: (id: ID, patch: Partial<Campaign>) => {
    const items = Campaigns.list().map((c) => (c.id === id ? { ...c, ...patch } : c));
    write(DB.campaigns, items);
  },
  remove: (id: ID) => write(DB.campaigns, Campaigns.list().filter((c) => c.id !== id)),
};

// Rewards
export const Rewards = {
  list: (): Reward[] => read<Reward>(DB.rewards),
  add: (input: Omit<Reward, 'id' | 'createdAt'>): Reward => {
    const next: Reward = { id: uid(), createdAt: new Date().toISOString(), ...input };
    const items = Rewards.list();
    write(DB.rewards, [next, ...items]);
    return next;
  },
  update: (id: ID, patch: Partial<Reward>) => {
    const items = Rewards.list().map((r) => (r.id === id ? { ...r, ...patch } : r));
    write(DB.rewards, items);
  },
  remove: (id: ID) => write(DB.rewards, Rewards.list().filter((r) => r.id !== id)),
};

// Coupons
export const Coupons = {
  list: (): Coupon[] => read<Coupon>(DB.coupons),
  add: (input: Omit<Coupon, 'id' | 'createdAt'>): Coupon => {
    const next: Coupon = { id: uid(), createdAt: new Date().toISOString(), ...input };
    const items = Coupons.list();
    write(DB.coupons, [next, ...items]);
    return next;
  },
  update: (id: ID, patch: Partial<Coupon>) => {
    const items = Coupons.list().map((c) => (c.id === id ? { ...c, ...patch } : c));
    write(DB.coupons, items);
  },
  remove: (id: ID) => write(DB.coupons, Coupons.list().filter((c) => c.id !== id)),
};

// Loyalty Cards
export const Cards = {
  list: (): LoyaltyCard[] => read<LoyaltyCard>(DB.cards),
  byUser: (customerId: ID): LoyaltyCard[] => Cards.list().filter((c) => c.customerId === customerId),
  getOrCreate: (customerId: ID, campaignId: ID): LoyaltyCard => {
    const items = Cards.list();
    const found = items.find((c) => c.customerId === customerId && c.campaignId === campaignId);
    if (found) return found;
    const card: LoyaltyCard = { id: uid(), customerId, campaignId, stamps: 0, updatedAt: new Date().toISOString() };
    write(DB.cards, [card, ...items]);
    return card;
  },
  addStamp: (cardId: ID, count = 1) => {
    const items = Cards.list().map((c) =>
      c.id === cardId ? { ...c, stamps: c.stamps + count, updatedAt: new Date().toISOString() } : c
    );
    write(DB.cards, items);
  },
  setStamps: (cardId: ID, stamps: number) => {
    const items = Cards.list().map((c) => (c.id === cardId ? { ...c, stamps, updatedAt: new Date().toISOString() } : c));
    write(DB.cards, items);
  },
};

// Redemptions
export const Redemptions = {
  list: (): Redemption[] => read<Redemption>(DB.redemptions),
  add: (input: Omit<Redemption, 'id' | 'date'>): Redemption => {
    const next: Redemption = { id: uid(), date: new Date().toISOString(), ...input };
    const items = Redemptions.list();
    write(DB.redemptions, [next, ...items]);
    return next;
  },
};

// Referrals
export const Referrals = {
  list: (): Referral[] => read<Referral>(DB.referrals),
  byOwner: (ownerUserId: ID): Referral | undefined => Referrals.list().find((r) => r.ownerUserId === ownerUserId),
  ensureForUser: (ownerUserId: ID): Referral => {
    const existing = Referrals.byOwner(ownerUserId);
    if (existing) return existing;
    const code = `REF-${ownerUserId.slice(0, 6).toUpperCase()}`;
    const ref: Referral = { id: uid(), ownerUserId, code, referredCount: 0, createdAt: new Date().toISOString() };
    write(DB.referrals, [ref, ...Referrals.list()]);
    return ref;
  },
  increment: (id: ID, count = 1) => {
    const items = Referrals.list().map((r) => (r.id === id ? { ...r, referredCount: r.referredCount + count } : r));
    write(DB.referrals, items);
  },
};

// Seed demo data if empty
export function seedIfEmpty() {
  if (Campaigns.list().length === 0) {
    Campaigns.add({ name: 'Coffee Lovers', description: 'Buy 9 get 1 free', stampsRequired: 10, active: true });
    Campaigns.add({ name: 'Sandwich Club', description: 'Collect 5 stamps', stampsRequired: 5, active: true });
  }
  if (Rewards.list().length === 0) {
    Rewards.add({ name: 'Free Coffee', description: 'Redeem with 10 stamps', stampsRequired: 10, active: true });
    Rewards.add({ name: 'Free Muffin', description: '5 stamps', stampsRequired: 5, active: true });
  }
}

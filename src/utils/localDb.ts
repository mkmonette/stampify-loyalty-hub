// LocalStorage-backed lightweight data layer for core features
// NOTE: This is a simple in-browser store and not suitable for production.

export type ID = string;

export type Business = {
  id: ID;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  template: string;
  colors: {
    primary: string;
    background: string;
  };
  ownerId?: ID; // User ID who owns this business
  createdAt: string;
};

export type Campaign = {
  id: ID;
  businessId?: ID; // Link to Business
  name: string;
  slug: string;
  description?: string;
  stampsRequired: number;
  active: boolean;
  createdAt: string;
  ownerId?: ID; // Business owner ID for branding (deprecated, use businessId)
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
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

export type CustomerCampaign = {
  id: ID;
  customerId: ID; // user email
  campaignId: ID;
  dateJoined: string;
};

const DB = {
  businesses: 'businesses',
  campaigns: 'campaigns',
  rewards: 'db_rewards',
  coupons: 'db_coupons',
  cards: 'db_loyalty_cards',
  redemptions: 'db_redemptions',
  referrals: 'db_referrals',
  customerCampaigns: 'db_customer_campaigns',
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Businesses
export const Businesses = {
  list: (): Business[] => read<Business>(DB.businesses),
  add: (input: Omit<Business, 'id' | 'createdAt' | 'slug'>): Business => {
    const slug = generateSlug(input.name);
    const existing = Businesses.findBySlug(slug);
    if (existing) {
      console.warn('⚠️ Business with slug already exists:', slug);
      return existing;
    }
    const next: Business = { id: uid(), slug, createdAt: new Date().toISOString(), ...input };
    const items = Businesses.list();
    write(DB.businesses, [next, ...items]);
    console.log('✅ Business saved:', next);
    return next;
  },
  update: (id: ID, patch: Partial<Business>) => {
    const items = Businesses.list().map((b) => (b.id === id ? { ...b, ...patch } : b));
    write(DB.businesses, items);
    const updated = items.find(b => b.id === id);
    if (updated) console.log('✅ Business updated:', updated);
  },
  remove: (id: ID) => {
    write(DB.businesses, Businesses.list().filter((b) => b.id !== id));
    console.log('✅ Business removed:', id);
  },
  findBySlug: (slug: string): Business | undefined => Businesses.list().find((b) => b.slug === slug),
  findById: (id: ID): Business | undefined => Businesses.list().find((b) => b.id === id),
};

// Campaigns
export const Campaigns = {
  list: (): Campaign[] => read<Campaign>(DB.campaigns),
  add: (input: Omit<Campaign, 'id' | 'createdAt' | 'slug'>): Campaign => {
    const slug = generateSlug(input.name);
    const existing = Campaigns.findBySlug(slug);
    if (existing) {
      console.warn('⚠️ Campaign with slug already exists:', slug);
      return existing;
    }
    const next: Campaign = { id: uid(), slug, createdAt: new Date().toISOString(), ...input };
    const items = Campaigns.list();
    write(DB.campaigns, [next, ...items]);
    console.log('✅ Campaign saved:', next);
    return next;
  },
  update: (id: ID, patch: Partial<Campaign>) => {
    const items = Campaigns.list().map((c) => (c.id === id ? { ...c, ...patch } : c));
    write(DB.campaigns, items);
    const updated = items.find(c => c.id === id);
    if (updated) console.log('✅ Campaign updated:', updated);
  },
  remove: (id: ID) => {
    write(DB.campaigns, Campaigns.list().filter((c) => c.id !== id));
    console.log('✅ Campaign removed:', id);
  },
  findBySlug: (slug: string): Campaign | undefined => Campaigns.list().find((c) => c.slug === slug),
  byBusiness: (businessId: ID): Campaign[] => Campaigns.list().filter((c) => c.businessId === businessId),
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

// Customer Campaigns
export const CustomerCampaigns = {
  list: (): CustomerCampaign[] => read<CustomerCampaign>(DB.customerCampaigns),
  hasJoined: (customerId: ID, campaignId: ID): boolean => 
    CustomerCampaigns.list().some((cc) => cc.customerId === customerId && cc.campaignId === campaignId),
  join: (customerId: ID, campaignId: ID): CustomerCampaign => {
    const existing = CustomerCampaigns.list().find((cc) => cc.customerId === customerId && cc.campaignId === campaignId);
    if (existing) return existing;
    const next: CustomerCampaign = { id: uid(), customerId, campaignId, dateJoined: new Date().toISOString() };
    write(DB.customerCampaigns, [next, ...CustomerCampaigns.list()]);
    return next;
  },
  countByCampaign: (campaignId: ID): number => 
    CustomerCampaigns.list().filter((cc) => cc.campaignId === campaignId).length,
};

// Seed demo data if empty
export function seedIfEmpty() {
  // Seed demo business first
  if (Businesses.list().length === 0) {
    const demoBusiness = Businesses.add({
      name: 'Demo Coffee Shop',
      description: 'Your favorite local coffee spot',
      logo: '/placeholder.svg',
      template: 'modern',
      colors: {
        primary: '#8B4513',
        background: '#FFF8F0'
      },
      ownerId: 'demo-business-admin'
    });

    // Seed campaigns linked to business
    if (Campaigns.list().length === 0) {
      Campaigns.add({ 
        businessId: demoBusiness.id,
        name: 'Coffee Lovers', 
        description: 'Buy 9 get 1 free', 
        stampsRequired: 10, 
        active: true,
        ownerId: 'demo-business-admin',
        contactEmail: 'coffee@demo.com',
        socialLinks: {
          website: 'https://example.com',
          instagram: 'https://instagram.com/coffeelovers'
        }
      });
      Campaigns.add({ 
        businessId: demoBusiness.id,
        name: 'Sandwich Club', 
        description: 'Collect 5 stamps', 
        stampsRequired: 5, 
        active: true,
        ownerId: 'demo-business-admin',
        contactEmail: 'sandwich@demo.com'
      });
    }
  }
  
  if (Rewards.list().length === 0) {
    Rewards.add({ name: 'Free Coffee', description: 'Redeem with 10 stamps', stampsRequired: 10, active: true });
    Rewards.add({ name: 'Free Muffin', description: '5 stamps', stampsRequired: 5, active: true });
  }
}

// Helper functions for easy access
export function saveBusiness(business: Omit<Business, 'id' | 'createdAt' | 'slug'>): Business {
  return Businesses.add(business);
}

export function saveCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'slug'>): Campaign {
  return Campaigns.add(campaign);
}

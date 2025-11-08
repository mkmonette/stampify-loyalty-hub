import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaigns, Campaign, Businesses, Business } from '@/utils/localDb';

interface CampaignContextType {
  campaigns: Campaign[];
  businesses: Business[];
  refreshCampaigns: () => void;
  refreshBusinesses: () => void;
  addOrUpdateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  addOrUpdateBusiness: (business: Business) => void;
  deleteBusiness: (id: string) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  const refreshCampaigns = () => {
    // Initialize localStorage if null
    if (localStorage.getItem('campaigns') === null) {
      localStorage.setItem('campaigns', '[]');
      console.log('🔧 Initialized empty campaigns array in localStorage');
    }
    
    const data = Campaigns.list();
    setCampaigns(data);
    console.log('📢 Campaigns synced from unified source:', data);
    console.log('📊 Campaign slugs available:', data.map(c => c.slug));
    console.log('📦 localStorage.campaigns:', localStorage.getItem('campaigns'));
    console.log('📦 localStorage.db_campaigns:', localStorage.getItem('db_campaigns'));
  };

  const refreshBusinesses = () => {
    // Initialize localStorage if null
    if (localStorage.getItem('businesses') === null) {
      localStorage.setItem('businesses', '[]');
      console.log('🔧 Initialized empty businesses array in localStorage');
    }
    
    const data = Businesses.list();
    setBusinesses(data);
    console.log('📢 Businesses synced:', data);
    console.log('📦 Raw localStorage businesses:', localStorage.getItem('businesses'));
  };

  const addOrUpdateCampaign = (campaign: Campaign) => {
    const existing = Campaigns.findBySlug(campaign.slug);
    if (existing && existing.id !== campaign.id) {
      console.warn('⚠️ Campaign with slug already exists:', campaign.slug);
      return;
    }
    
    if (existing) {
      Campaigns.update(campaign.id, campaign);
    } else {
      Campaigns.add({
        businessId: campaign.businessId,
        name: campaign.name,
        description: campaign.description,
        stampsRequired: campaign.stampsRequired,
        active: campaign.active,
        ownerId: campaign.ownerId,
        contactEmail: campaign.contactEmail,
        contactPhone: campaign.contactPhone,
        socialLinks: campaign.socialLinks,
      });
    }
    refreshCampaigns();
    console.log('📦 LocalStorage updated:', localStorage.getItem('campaigns'));
  };

  const deleteCampaign = (id: string) => {
    Campaigns.remove(id);
    refreshCampaigns();
    console.log('📦 Campaign deleted, localStorage updated');
  };

  const addOrUpdateBusiness = (business: Business) => {
    const existing = Businesses.findBySlug(business.slug);
    if (existing && existing.id !== business.id) {
      console.warn('⚠️ Business with slug already exists:', business.slug);
      return;
    }
    
    if (existing) {
      Businesses.update(business.id, business);
    } else {
      Businesses.add({
        name: business.name,
        description: business.description,
        logo: business.logo,
        template: business.template,
        colors: business.colors,
        ownerId: business.ownerId,
      });
    }
    refreshBusinesses();
    console.log('📦 Business localStorage updated');
  };

  const deleteBusiness = (id: string) => {
    Businesses.remove(id);
    refreshBusinesses();
    console.log('📦 Business deleted, localStorage updated');
  };

  // Initial load
  useEffect(() => {
    // Initialize storage first
    refreshCampaigns();
    refreshBusinesses();
    
    // Then seed if empty (with a small delay to ensure storage is ready)
    setTimeout(() => {
      const currentCampaigns = Campaigns.list();
      const currentBusinesses = Businesses.list();
      
      if (currentCampaigns.length === 0 || currentBusinesses.length === 0) {
        console.log('🌱 Seeding demo data...');
        import('@/utils/localDb').then(({ seedIfEmpty }) => {
          seedIfEmpty();
          // Refresh after seeding
          refreshCampaigns();
          refreshBusinesses();
          console.log('✅ Demo data seeded and refreshed');
        });
      }
    }, 100);
  }, []);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'campaigns') {
        refreshCampaigns();
      }
      if (e.key === 'businesses') {
        refreshBusinesses();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        businesses,
        refreshCampaigns,
        refreshBusinesses,
        addOrUpdateCampaign,
        deleteCampaign,
        addOrUpdateBusiness,
        deleteBusiness,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within CampaignProvider');
  }
  return context;
}

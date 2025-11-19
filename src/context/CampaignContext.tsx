import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaigns, Campaign, Businesses, Business, cleanupOldData, seedIfEmpty } from '@/utils/localDb';

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
    
    // CLEANUP: Remove old db_campaigns if it exists
    const oldDbCampaigns = localStorage.getItem('db_campaigns');
    if (oldDbCampaigns) {
      console.log('🧹 Found old db_campaigns data, removing:', oldDbCampaigns);
      localStorage.removeItem('db_campaigns');
      console.log('✅ Cleared old db_campaigns from localStorage');
    }
    
    const data = Campaigns.list();
    setCampaigns(data);
    console.log('📢 Campaigns synced from unified source:', data);
    console.log('📊 Campaign slugs available:', data.map(c => c.slug));
    console.log('📦 localStorage.campaigns:', localStorage.getItem('campaigns'));
  };

  const refreshBusinesses = () => {
    // Initialize localStorage if null
    if (localStorage.getItem('businesses') === null) {
      localStorage.setItem('businesses', '[]');
      console.log('🔧 Initialized empty businesses array in localStorage');
    }
    
    // CLEANUP: Remove any old business-related keys
    const oldKeys = ['db_businesses', 'business_data'];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🧹 Removing old localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
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
    console.log('🔄 CampaignProvider: Loading initial data');
    
    // Clean up ALL old data keys on every start
    cleanupOldData();
    
    // Initialize storage
    refreshCampaigns();
    refreshBusinesses();
    
    // Seed demo data only if this is truly the first initialization
    setTimeout(() => {
      const currentCampaigns = Campaigns.list();
      const currentBusinesses = Businesses.list();
      const isInitialized = localStorage.getItem('app_initialized') === 'true';
      
      console.log('🔍 Data integrity check:', {
        campaigns: currentCampaigns.length,
        businesses: currentBusinesses.length,
        isInitialized
      });
      
      // Seed if app has never been initialized OR if data is inconsistent
      const needsSeeding = !isInitialized || (currentBusinesses.length > 0 && currentCampaigns.length === 0);
      
      if (needsSeeding) {
        console.log('🌱 Seeding demo data...', { isInitialized, hasBusinesses: currentBusinesses.length > 0, hasCampaigns: currentCampaigns.length > 0 });
        seedIfEmpty();
        // Refresh after seeding
        refreshCampaigns();
        refreshBusinesses();
        console.log('✅ Demo data seeded and refreshed');
        console.log('🟩 All campaigns in memory:', Campaigns.list());
      } else {
        console.log('✅ App already initialized. Current data:', { 
          campaigns: currentCampaigns.length, 
          businesses: currentBusinesses.length 
        });
        if (currentCampaigns.length > 0) {
          console.log('🟩 All campaigns in memory:', currentCampaigns);
        }
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
  if (context === undefined) {
    throw new Error('useCampaigns must be used within CampaignProvider');
  }
  return context;
}

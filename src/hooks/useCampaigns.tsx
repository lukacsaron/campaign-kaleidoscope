
import { useState, useEffect } from 'react';
import { Campaign, UTMLink, generateId } from '@/utils/utmUtils';
import { toast } from '@/components/ui/use-toast';

// Local storage keys
const CAMPAIGNS_STORAGE_KEY = 'utm_campaigns';
const LINKS_STORAGE_KEY = 'utm_links';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load campaigns from local storage on initial render
  useEffect(() => {
    const loadCampaigns = () => {
      try {
        const storedCampaigns = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
        const storedLinks = localStorage.getItem(LINKS_STORAGE_KEY);
        
        if (storedCampaigns) {
          // Parse the campaigns and convert createdAt string back to Date objects
          const parsedCampaigns = JSON.parse(storedCampaigns).map((campaign: any) => ({
            ...campaign,
            createdAt: new Date(campaign.createdAt),
            links: [] // Initialize with empty links array
          }));
          
          // If we have links, associate them with campaigns
          if (storedLinks) {
            const parsedLinks = JSON.parse(storedLinks).map((link: any) => ({
              ...link,
              createdAt: new Date(link.createdAt)
            }));
            
            // Group links by campaign ID
            parsedCampaigns.forEach((campaign: Campaign) => {
              campaign.links = parsedLinks.filter((link: UTMLink) => link.campaignId === campaign.id);
            });
          }
          
          setCampaigns(parsedCampaigns);
        }
      } catch (error) {
        console.error("Error loading campaigns from storage:", error);
        toast({
          title: "Error",
          description: "Failed to load saved campaigns",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaigns();
  }, []);

  // Save campaigns to local storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        // Extract all links from all campaigns
        const allLinks = campaigns.flatMap(campaign => campaign.links);
        
        // Store campaigns (without links to avoid duplication)
        const campaignsWithoutLinks = campaigns.map(({ links, ...rest }) => rest);
        localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaignsWithoutLinks));
        
        // Store links separately
        localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(allLinks));
      } catch (error) {
        console.error("Error saving campaigns to storage:", error);
      }
    }
  }, [campaigns, isLoading]);

  const addCampaign = (name: string, description?: string) => {
    const newCampaign: Campaign = {
      id: generateId(),
      name,
      description,
      createdAt: new Date(),
      links: []
    };
    
    setCampaigns(prevCampaigns => [...prevCampaigns, newCampaign]);
    toast({
      title: "Campaign Created",
      description: `${name} has been created successfully`,
    });
    
    return newCampaign;
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === id 
          ? { ...campaign, ...updates } 
          : campaign
      )
    );
    
    toast({
      title: "Campaign Updated",
      description: "Campaign details have been updated",
    });
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.filter(campaign => campaign.id !== id)
    );
    
    toast({
      title: "Campaign Deleted",
      description: "Campaign and all its links have been removed",
    });
  };

  const addLink = (campaignId: string, link: Omit<UTMLink, 'id' | 'campaignId' | 'createdAt' | 'clicks'>) => {
    const newLink: UTMLink = {
      ...link,
      id: generateId(),
      campaignId,
      createdAt: new Date(),
      clicks: 0
    };
    
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === campaignId
          ? { ...campaign, links: [...campaign.links, newLink] }
          : campaign
      )
    );
    
    toast({
      title: "Link Created",
      description: "UTM link has been generated and saved",
    });
    
    return newLink;
  };

  const deleteLink = (linkId: string) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => ({
        ...campaign,
        links: campaign.links.filter(link => link.id !== linkId)
      }))
    );
    
    toast({
      title: "Link Deleted",
      description: "UTM link has been removed",
    });
  };

  const incrementLinkClicks = (linkId: string) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => ({
        ...campaign,
        links: campaign.links.map(link => 
          link.id === linkId
            ? { ...link, clicks: link.clicks + 1 }
            : link
        )
      }))
    );
  };

  const getRecentLinks = (limit = 5): UTMLink[] => {
    const allLinks = campaigns.flatMap(campaign => campaign.links);
    return allLinks
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  };

  const getAllLinks = (): UTMLink[] => {
    return campaigns.flatMap(campaign => campaign.links);
  };

  const getCampaign = (id: string): Campaign | undefined => {
    return campaigns.find(campaign => campaign.id === id);
  };

  return {
    campaigns,
    isLoading,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addLink,
    deleteLink,
    incrementLinkClicks,
    getRecentLinks,
    getAllLinks,
    getCampaign
  };
}

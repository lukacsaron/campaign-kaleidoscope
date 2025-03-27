
import React, { useState } from 'react';
import CampaignCard from './CampaignCard';
import { Campaign } from '@/utils/utmUtils';
import { PlusCircle, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

interface CampaignListProps {
  campaigns: Campaign[];
  onAddCampaign: (name: string, description?: string) => void;
  onDeleteCampaign: (id: string) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({ 
  campaigns, 
  onAddCampaign, 
  onDeleteCampaign 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (campaign.description && campaign.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddCampaign = () => {
    if (newCampaignName.trim()) {
      onAddCampaign(newCampaignName.trim(), newCampaignDesc.trim() || undefined);
      setNewCampaignName('');
      setNewCampaignDesc('');
      setIsDialogOpen(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search campaigns..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9 bg-secondary/50"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle size={16} className="mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Add a new campaign to organize your UTM links.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input 
                  id="name" 
                  value={newCampaignName} 
                  onChange={(e) => setNewCampaignName(e.target.value)} 
                  placeholder="Summer Sale 2023"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea 
                  id="description" 
                  value={newCampaignDesc} 
                  onChange={(e) => setNewCampaignDesc(e.target.value)}
                  placeholder="Campaign details and notes"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCampaign} disabled={!newCampaignName.trim()}>Create Campaign</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg bg-secondary/30">
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'No campaigns match your search.' : 'No campaigns yet. Create your first campaign to get started!'}
          </p>
          {searchQuery ? (
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          ) : (
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle size={16} className="mr-2" />
              Create Campaign
            </Button>
          )}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredCampaigns.map(campaign => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onDelete={onDeleteCampaign} 
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CampaignList;

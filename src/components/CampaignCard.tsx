
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Link2, ExternalLink, Copy, Trash2 } from 'lucide-react';
import { Campaign, UTMLink } from '@/utils/utmUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface CampaignCardProps {
  campaign: Campaign;
  onDelete: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    }).format(date);
  };

  const handleCopyLink = (link: UTMLink) => {
    navigator.clipboard.writeText(link.utmUrl);
    toast({
      title: "Link Copied",
      description: "UTM link copied to clipboard"
    });
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      onDelete(campaign.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border border-border/40 shadow-subtle hover:shadow-elevated transition-all duration-300">
        <CardHeader className="bg-secondary/30 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-medium">{campaign.name}</CardTitle>
              <CardDescription className="mt-1 flex items-center text-xs text-muted-foreground">
                <Calendar size={14} className="mr-1" />
                {formatDate(campaign.createdAt)}
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDeleteClick} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete campaign</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {campaign.description && (
            <p className="text-sm text-muted-foreground mt-2">{campaign.description}</p>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 py-4 border-t border-border/30">
            <div className="flex flex-col items-center justify-center p-2">
              <div className="flex items-center text-muted-foreground mb-1">
                <Link2 size={14} className="mr-1" />
                <span className="text-xs">Total Links</span>
              </div>
              <span className="text-2xl font-medium">{campaign.links.length}</span>
            </div>
          </div>
          
          {campaign.links.length > 0 && (
            <div className="px-6 pb-4">
              <h4 className="text-sm font-medium mb-2">Recent Links</h4>
              <ul className="space-y-2">
                {campaign.links.slice(0, 2).map(link => (
                  <li key={link.id} className="text-xs bg-secondary/40 rounded-md p-2 flex items-center justify-between">
                    <div className="truncate mr-2 flex-1">
                      <span className="font-medium">{link.source}</span>
                      <span className="text-muted-foreground mx-1">•</span>
                      <span>{link.medium}</span>
                    </div>
                    <div className="flex space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyLink(link)}>
                              <Copy size={12} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy UTM link</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                              <a href={link.utmUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={12} />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Open link</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-border/30 px-6 py-4 bg-secondary/20">
          <Button size="sm" variant="outline" asChild>
            <Link to={`/campaigns/${campaign.id}`}>View Details</Link>
          </Button>
          <Button size="sm" variant="default" asChild>
            <Link to={`/generate?campaign=${campaign.id}`}>
              <Link2 size={14} className="mr-2" />
              Add Link
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CampaignCard;

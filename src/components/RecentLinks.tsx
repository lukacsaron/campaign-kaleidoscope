
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Link2, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { UTMLink } from '@/utils/utmUtils';
import { motion } from 'framer-motion';

interface RecentLinksProps {
  links: UTMLink[];
  onCopyLink?: (link: UTMLink) => void;
}

const RecentLinks: React.FC<RecentLinksProps> = ({ links, onCopyLink }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (link: UTMLink) => {
    navigator.clipboard.writeText(link.utmUrl);
    setCopiedId(link.id);
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
    
    toast({
      title: "Link Copied",
      description: "UTM link copied to clipboard"
    });
    
    if (onCopyLink) {
      onCopyLink(link);
    }
  };

  if (links.length === 0) {
    return (
      <Card className="border border-border/40 shadow-subtle">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center">
            <LinkIcon className="mr-2 h-4 w-4 text-primary/80" />
            Recent Links
          </CardTitle>
          <CardDescription>
            Your recently created UTM links will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No links generated yet</p>
          <Button className="mt-4" size="sm" asChild>
            <Link to="/generate">
              <Link2 size={14} className="mr-2" />
              Create UTM Link
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40 shadow-subtle">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <LinkIcon className="mr-2 h-4 w-4 text-primary/80" />
          Recent Links
        </CardTitle>
        <CardDescription>
          Your recently created UTM links
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="divide-y divide-border/30"
        >
          {links.map((link, index) => (
            <motion.li 
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="grid grid-cols-[1fr,auto] gap-2">
                <div>
                  <h3 className="text-sm font-medium truncate">{new URL(link.url).hostname}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <span className="font-medium">{link.source}</span>
                    <span>•</span>
                    <span>{link.medium}</span>
                    <span>•</span>
                    <span className="truncate">{link.campaign}</span>
                  </div>
                  <div className="mt-1.5">
                    <p className="text-xs text-muted-foreground truncate">{link.utmUrl}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleCopyLink(link)}
                        >
                          <Copy size={14} className={copiedId === link.id ? 'text-primary' : ''} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copiedId === link.id ? 'Copied!' : 'Copy link'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={link.utmUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={14} />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open link</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
};

export default RecentLinks;

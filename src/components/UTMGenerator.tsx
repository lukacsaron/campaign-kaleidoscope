import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Copy, LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { Campaign, MEDIUMS, SOURCES, UTMParams, generateUTMUrl, validateUrl } from '@/utils/utmUtils';
import { motion } from 'framer-motion';

interface UTMGeneratorProps {
  campaigns: Campaign[];
  addLink: (campaignId: string, link: Omit<UTMParams & {utmUrl: string}, 'id' | 'campaignId' | 'createdAt' | 'clicks'>) => void;
}

const UTMGenerator: React.FC<UTMGeneratorProps> = ({ campaigns, addLink }) => {
  const [searchParams] = useSearchParams();
  const campaignIdFromUrl = searchParams.get('campaign');
  
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [customSource, setCustomSource] = useState('');
  const [customMedium, setCustomMedium] = useState('');
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaignIdFromUrl || '');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [activeTab, setActiveTab] = useState('standard');
  const [urlError, setUrlError] = useState('');
  const [copied, setCopied] = useState(false);

  // Set the selected campaign ID from the URL if provided
  useEffect(() => {
    if (campaignIdFromUrl) {
      setSelectedCampaignId(campaignIdFromUrl);
    }
  }, [campaignIdFromUrl]);

  // Set the campaign name based on the selected campaign's slug
  useEffect(() => {
    if (selectedCampaignId) {
      const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
      if (selectedCampaign) {
        setCampaign(selectedCampaign.slug);
      }
    }
  }, [selectedCampaignId, campaigns]);

  const validateInputs = () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return false;
    }
    
    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL (include http:// or https://)');
      return false;
    }
    
    if (!source) {
      toast({
        title: "Source Required",
        description: "Please select or enter a UTM source",
        variant: "destructive",
      });
      return false;
    }
    
    if (!medium) {
      toast({
        title: "Medium Required",
        description: "Please select or enter a UTM medium",
        variant: "destructive",
      });
      return false;
    }
    
    if (!campaign) {
      toast({
        title: "Campaign Name Required",
        description: "Please enter a campaign name",
        variant: "destructive",
      });
      return false;
    }
    
    if (!selectedCampaignId) {
      toast({
        title: "Campaign Selection Required",
        description: "Please select a campaign to save this link",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSourceChange = (value: string) => {
    if (value === 'custom') {
      setSource(customSource);
    } else {
      setSource(value);
      setCustomSource('');
    }
  };

  const handleMediumChange = (value: string) => {
    if (value === 'custom') {
      setMedium(customMedium);
    } else {
      setMedium(value);
      setCustomMedium('');
    }
  };

  const handleCustomSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSource(e.target.value);
    setSource(e.target.value);
  };

  const handleCustomMediumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMedium(e.target.value);
    setMedium(e.target.value);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (urlError && validateUrl(e.target.value)) {
      setUrlError('');
    }
  };

  const handleAdvancedTabChange = (value: string) => {
    setActiveTab(value);
  };

  const generateLink = () => {
    if (!validateInputs()) return;
    
    try {
      const utmParams: UTMParams = {
        url,
        source,
        medium,
        campaign,
        term: term || undefined,
        content: content || undefined,
      };
      
      const utmUrl = generateUTMUrl(utmParams);
      setGeneratedUrl(utmUrl);
      
      toast({
        title: "UTM Link Generated",
        description: "Your UTM link has been created successfully",
      });
    } catch (error) {
      console.error("Error generating UTM link:", error);
      toast({
        title: "Error",
        description: "Failed to generate UTM link. Please check your inputs.",
        variant: "destructive",
      });
    }
  };

  const saveLink = () => {
    if (!generatedUrl || !selectedCampaignId) return;
    
    const newLink = {
      url,
      source,
      medium,
      campaign,
      term: term || undefined,
      content: content || undefined,
      utmUrl: generatedUrl,
    };
    
    addLink(selectedCampaignId, newLink);
  };

  const copyToClipboard = () => {
    if (!generatedUrl) return;
    
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    
    toast({
      title: "Copied to Clipboard",
      description: "UTM link has been copied to your clipboard",
    });
  };

  const resetForm = () => {
    setUrl('');
    setSource('');
    setMedium('');
    setCampaign('');
    setTerm('');
    setContent('');
    setCustomSource('');
    setCustomMedium('');
    setGeneratedUrl('');
    setUrlError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="border border-border/40 shadow-subtle">
        <CardHeader className="bg-gradient-to-br from-secondary/50 to-secondary/10">
          <CardTitle className="text-2xl font-medium flex items-center">
            <LinkIcon className="mr-2 h-6 w-6 text-primary/80" />
            UTM Link Generator
          </CardTitle>
          <CardDescription>
            Create and save UTM links for your marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={(e) => { e.preventDefault(); generateLink(); }}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">Destination URL</Label>
                <Input 
                  id="url" 
                  placeholder="https://yourwebsite.com/landing-page" 
                  value={url}
                  onChange={handleUrlChange}
                  className={urlError ? 'border-destructive' : ''}
                />
                {urlError && (
                  <p className="text-sm text-destructive">{urlError}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-selector">Campaign</Label>
                <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                  <SelectTrigger id="campaign-selector">
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.length > 0 ? (
                      campaigns.map(camp => (
                        <SelectItem key={camp.id} value={camp.id}>
                          {camp.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        No campaigns available. Create one first.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">UTM Source</Label>
                  <Select value={source === customSource && !SOURCES.includes(source) ? 'custom' : source} onValueChange={handleSourceChange}>
                    <SelectTrigger id="source">
                      <SelectValue placeholder="Select a source" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOURCES.map(src => (
                        <SelectItem key={src} value={src}>{src}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom source</SelectItem>
                    </SelectContent>
                  </Select>
                  {source === customSource && !SOURCES.includes(source) && (
                    <Input 
                      placeholder="Enter custom source" 
                      value={customSource}
                      onChange={handleCustomSourceChange}
                      className="mt-2"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medium">UTM Medium</Label>
                  <Select value={medium === customMedium && !MEDIUMS.includes(medium) ? 'custom' : medium} onValueChange={handleMediumChange}>
                    <SelectTrigger id="medium">
                      <SelectValue placeholder="Select a medium" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDIUMS.map(med => (
                        <SelectItem key={med} value={med}>{med}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom medium</SelectItem>
                    </SelectContent>
                  </Select>
                  {medium === customMedium && !MEDIUMS.includes(medium) && (
                    <Input 
                      placeholder="Enter custom medium" 
                      value={customMedium}
                      onChange={handleCustomMediumChange}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input 
                  id="campaign-name" 
                  placeholder="summer-sale" 
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use kebab-case (lower-case with hyphens) for best results
                </p>
              </div>
              
              <Tabs value={activeTab} onValueChange={handleAdvancedTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="standard">
                  <div className="h-[20px]"></div>
                </TabsContent>
                <TabsContent value="advanced">
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="term">UTM Term (optional)</Label>
                      <Input 
                        id="term" 
                        placeholder="paid-search-terms" 
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        For paid search campaigns, this identifies the keywords
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="content">UTM Content (optional)</Label>
                      <Input 
                        id="content" 
                        placeholder="top-banner" 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Used for A/B testing and differentiation of ads
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-3 pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
                <Button type="submit">Generate Link</Button>
              </div>
              
              {generatedUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert className="mt-4 glass-effect">
                    <AlertDescription className="break-all font-mono text-sm pt-2 pb-1">
                      {generatedUrl}
                    </AlertDescription>
                    <div className="flex justify-end space-x-3 mt-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={copyToClipboard}
                        className="flex items-center"
                      >
                        {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
                        {copied ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={saveLink}
                      >
                        Save Link
                      </Button>
                    </div>
                  </Alert>
                </motion.div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="bg-secondary/20 border-t border-border/30 px-6 py-4 flex justify-between">
          <div className="text-xs text-muted-foreground">
            UTM parameters help track the effectiveness of your marketing campaigns
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default UTMGenerator;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, FolderIcon, LinkIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import RecentLinks from '@/components/RecentLinks';
import { useCampaigns } from '@/hooks/useCampaigns';
import { motion } from 'framer-motion';

const Index = () => {
  const { campaigns, isLoading, getRecentLinks } = useCampaigns();
  const recentLinks = getRecentLinks(5);
  
  const handleLinkCopy = (link: any) => {
    // No longer incrementing clicks as we've removed tracking
    // Just a placeholder for the copy event
    console.log('Link copied:', link.utmUrl);
  };

  const statsItems = [
    {
      title: 'Total Campaigns',
      value: campaigns.length,
      icon: FolderIcon,
      color: 'bg-blue-50 text-blue-600',
      link: '/campaigns'
    },
    {
      title: 'Total Links',
      value: campaigns.reduce((sum, campaign) => sum + campaign.links.length, 0),
      icon: LinkIcon,
      color: 'bg-purple-50 text-purple-600',
      link: '/campaigns'
    },
    {
      title: 'Campaign Types',
      value: [...new Set(campaigns.map(c => c.slug.split('-')[0]))].length,
      icon: BarChart2,
      color: 'bg-green-50 text-green-600',
      link: '/campaigns'
    }
  ];

  const staggerAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + index * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    })
  };

  return (
    <Layout>
      <section className="space-y-6">
        <div className="text-center max-w-3xl mx-auto py-12">
          <motion.h1 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            UTM Campaign Manager
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create, organize, and track your marketing campaign links
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button size="lg" asChild>
              <Link to="/generate">
                <LinkIcon size={18} className="mr-2" />
                Generate UTM Link
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/campaigns">
                <FolderIcon size={18} className="mr-2" />
                View Campaigns
              </Link>
            </Button>
          </motion.div>
        </div>

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {statsItems.map((item, index) => (
              <motion.div
                key={item.title}
                custom={index}
                variants={staggerAnimation}
                initial="initial"
                animate="animate"
              >
                <Card className="border border-border/40 shadow-subtle hover:shadow-elevated transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <div className={`mr-2 p-2 rounded-full ${item.color}`}>
                        <item.icon size={16} />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-semibold">{item.value}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="ml-auto" asChild>
                      <Link to={item.link}>
                        View
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border border-border/40 shadow-subtle h-full">
              <CardHeader>
                <CardTitle className="text-xl font-medium flex items-center">
                  <FolderIcon className="mr-2 h-5 w-5 text-primary/80" /> 
                  Recent Campaigns
                </CardTitle>
                <CardDescription>
                  Your most recently created campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No campaigns yet</p>
                    <Button className="mt-2" asChild>
                      <Link to="/campaigns">
                        <PlusCircle size={16} className="mr-2" />
                        Create Campaign
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    {campaigns
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .slice(0, 5)
                      .map((campaign, index) => (
                        <motion.div 
                          key={campaign.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="p-4 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-md font-medium">{campaign.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {campaign.links.length} links
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/campaigns/${campaign.id}`}>
                                View
                                <ArrowRight size={14} className="ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-border/30 p-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/campaigns">View All Campaigns</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <RecentLinks links={recentLinks} onCopyLink={handleLinkCopy} />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

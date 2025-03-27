
import React from 'react';
import Layout from '@/components/Layout';
import UTMGenerator from '@/components/UTMGenerator';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';

const GenerateUTM = () => {
  const { campaigns, isLoading, addLink } = useCampaigns();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-pulse h-8 w-48 bg-secondary rounded-md mx-auto mb-4"></div>
            <div className="animate-pulse h-64 w-full max-w-2xl bg-secondary rounded-md"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="mb-8">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Generate UTM Link
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Create UTM links for your marketing campaigns
          </motion.p>
        </section>

        <UTMGenerator 
          campaigns={campaigns}
          addLink={addLink}
        />
      </motion.div>
      <Toaster />
    </Layout>
  );
};

export default GenerateUTM;

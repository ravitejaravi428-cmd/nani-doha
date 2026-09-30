import React, { useEffect } from "react";
import { HeroBanner } from "../components/home/HeroBanner";
import { HostSpotlightSection } from "../components/home/HostSpotlightSection";
import { FestiveSareeShowcase } from "../components/home/FestiveSareeShowcase";
import { NaniSpecialItemsShowcase } from "../components/home/NaniSpecialItemsShowcase";
import { CategoriesSection } from "../components/home/CategoriesSection";
import { BestSellersSection } from "../components/home/BestSellersSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { NewsletterSection } from "../components/home/NewsletterSection";

export const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-wrapper" id="home-page">
      <HeroBanner />
      <HostSpotlightSection />
      <FestiveSareeShowcase />
      <NaniSpecialItemsShowcase />
      <CategoriesSection />
      <BestSellersSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};

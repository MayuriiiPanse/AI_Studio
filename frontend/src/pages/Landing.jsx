import PublicHeader from "../components/layout/PublicHeader";
import Footer from "../components/layout/Footer";
import Hero from "../components/marketing/Hero";
import FeatureGrid from "../components/marketing/FeatureGrid";
import Workflow from "../components/marketing/Workflow";
import PricingSection from "../components/marketing/PricingSection";
import ScrollProgress from "../components/marketing/ScrollProgress";

export default function Landing() {
  return (
    <div>
      <ScrollProgress />
      <PublicHeader />
      <main>
        <Hero />
        <FeatureGrid />
        <Workflow />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

import CTA from '../components/CTA';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar copy';
import Pricing from '../components/Pricing';

const Landing = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Pricing />
      <Features />
      <CTA />
      <Footer />
    </>
  );
};

export default Landing;
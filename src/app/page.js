import BambooProduct from "@/component/core/pages/Home/bambooProduct/bambooProduct";
import BestProduct from "@/component/core/pages/Home/bestProduct/bestProduct";
import ClayProduct from "@/component/core/pages/Home/clayProduct/clayProduct";
import GlassProducts from "@/component/core/pages/Home/glassProduct/glassProduct";
import HeroSection from "@/component/core/pages/Home/heroSection/heroSection";
import NewsletterSection from "@/component/core/pages/Home/newsletterSection/newsletterSection";
import OffersSection from "@/component/core/pages/Home/offersSection/offersSection";

const Home = () => {
  return (
    <>
      <HeroSection/>
      <OffersSection/>
      <GlassProducts/>
      <ClayProduct/>
      <BambooProduct/>
      <BestProduct/>
      <NewsletterSection/>
    </>
  );
};

export default Home;

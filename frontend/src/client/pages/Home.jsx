import HeroSection from "../components/HeroSection";
import ProductShowcase from "../components/ProductShowcase";
import YearNavigation from "../components/YearNavigation";


const Home = () => {
  return (
    <div>
      <YearNavigation/>
      <HeroSection/>
      <ProductShowcase/>
    </div>
  );
};

export default Home;

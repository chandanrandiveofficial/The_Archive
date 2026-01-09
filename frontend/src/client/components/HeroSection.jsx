import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreCategories = () => {
    navigate('/category');
  };

  return (
    <section className="min-h-screen bg-white flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* Established Tag */}
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-[#333333]"></div>
              <span className="text-xs text-[#8E8E8E] tracking-[0.2em] uppercase font-medium">
                Established 2020
              </span>
            </div>

            {/* Main Heading */}
            <div>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-black leading-[1.1] tracking-tight">
                Design
              </h1>
              <h2 className="text-6xl sm:text-7xl lg:text-8xl font-light text-[#8E8E8E] leading-[1.1] tracking-tight">
                Chronicle.
              </h2>
            </div>

            {/* Description */}
            <p className="text-[#333333] text-base sm:text-lg max-w-md leading-relaxed font-normal">
              A curated timeline of the objects that define our eras.
              Explore the intersection of function, form, and history.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExploreCategories}
                className="bg-black text-white px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#333333] transition-colors text-center cursor-pointer"
              >
                Explore Categories
              </button>
              <Link
                to="/latest"
                className="bg-white text-black px-8 py-3.5 text-xs font-bold uppercase tracking-[0.15em] border-2 border-[#333333] hover:bg-[#F4F4F4] transition-colors text-center"
              >
                Latest Drops
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:h-[600px] h-[400px] bg-[#F4F4F4] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#333333] to-black">
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src="/hero.png"
                  alt="Design Chronicle"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent"></div>
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

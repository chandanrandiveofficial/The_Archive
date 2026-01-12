import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HiOutlineHeart, HiHeart } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import { TbTruckDelivery } from 'react-icons/tb';

const ProductDetail = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Default product data if not passed
  const defaultProduct = {
    id: 1,
    name: 'The Eames Lounge Chair',
    price: 5495.00,
    rating: 4.5,
    reviews: 42,
    breadcrumb: ['HOME', 'FURNITURE', 'LOUNGE'],
    designer: 'Charles & Ray Eames',
    material: 'Molded Plywood, Leather',
    dimensions: '32.75" H x 32.75" W',
    warranty: '5-Year Standard',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    badge: '',
    buyLink: 'https://www.example.com/buy/eames-lounge-chair', // Add buy link here
    description: `The lounge chair is a culmination of the designers' efforts to create a club chair using the molded plywood technology that they pioneered in the '40s. The vision was a chair with the "warm, receptive look of a well-used first baseman's mitt."

It stands as one of the most significant designs of the 20th century. Instantly recognizable and enduringly fresh, this piece seamlessly blends comfort with modern aesthetic principles. The materials and craftsmanship speak completely.`,
    keyFeatures: [
      'Molded plywood shell construction',
      'Premium leather upholstery',
      'Iconic mid-century modern design',
      'Handcrafted by skilled artisans'
    ],
    specifications: {
      'Overall Dimensions': '32.75" H x 32.75" W x 33" D',
      'Seat Height': '15.75"',
      'Seat Depth': '20.5"',
      'Weight': '85 lbs',
      'Material': 'Molded Plywood, Premium Leather',
      'Origin': 'Made in USA'
    },
    shipping: {
      estimated: '5-7 business days',
      returns: '30-day return policy'
    }
  };

  const productData = product || defaultProduct;

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#8E8E8E] mb-1 uppercase tracking-wide">
          {productData.breadcrumb.map((crumb, index) => (
            <React.Fragment key={index}>
              <Link to="/" className="hover:text-black transition-colors">
                {crumb}
              </Link>
              {index < productData.breadcrumb.length - 1 && (
                <span className="text-[#8E8E8E]">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          
          {/* Left: Product Info - NOW VERTICALLY CENTERED */}
          <div className="order-2 lg:order-1 space-y-16">
            {/* Product Title and Price */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                {productData.name}
              </h1>

              {/* Price and Rating */}
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-black">
                  ${productData.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(productData.rating)
                            ? 'text-black'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#8E8E8E] underline cursor-pointer hover:text-black transition-colors">
                    {productData.reviews} Reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Product Specs with more spacing */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h3 className="text-xs text-[#8E8E8E] uppercase tracking-wide mb-2">
                  Designer
                </h3>
                <p className="text-sm font-medium text-black">
                  {productData.designer}
                </p>
              </div>
              <div>
                <h3 className="text-xs text-[#8E8E8E] uppercase tracking-wide mb-2">
                  Material
                </h3>
                <p className="text-sm font-medium text-black">
                  {productData.material}
                </p>
              </div>
              <div>
                <h3 className="text-xs text-[#8E8E8E] uppercase tracking-wide mb-2">
                  Dimensions
                </h3>
                <p className="text-sm font-medium text-black">
                  {productData.dimensions}
                </p>
              </div>
              <div>
                <h3 className="text-xs text-[#8E8E8E] uppercase tracking-wide mb-2">
                  Warranty
                </h3>
                <p className="text-sm font-medium text-black">
                  {productData.warranty}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <a 
                  href={productData.buyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    className="w-full bg-black text-white hover:bg-[#333333] h-14 text-sm font-bold uppercase tracking-wide"
                  >
                    Click here to buy
                    <IoIosArrowForward className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 border-2 border-black hover:bg-gray-100"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? (
                    <HiHeart className="w-5 h-5 text-black" />
                  ) : (
                    <HiOutlineHeart className="w-5 h-5 text-black" />
                  )}
                </Button>
              </div>

              {/* Shipping Info */}
              <div className="flex items-center gap-2 text-sm text-[#8E8E8E]">
                <span>{productData.shipping.standard}</span>
              </div>
            </div>
          </div>

          {/* Right: Product Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-[3/4] bg-[#F4F4F4] overflow-hidden relative">
              <img
                src={productData.image}
                alt={productData.name}
                className="w-full h-full object-cover"
              />
              {productData.badge && (
                <Badge className="absolute bottom-6 left-6 bg-[#FFD93D] text-black hover:bg-[#FFD93D] font-medium px-4 py-2">
                  {productData.badge}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Design Story Section with Tabs */}
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-black mb-8">Design Story</h2>
          
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent h-auto p-0 gap-8">
              <TabsTrigger
                value="description"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent pb-3 px-0 font-medium text-[#8E8E8E] data-[state=active]:text-black"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none bg-transparent pb-3 px-0 font-medium text-[#8E8E8E] data-[state=active]:text-black"
              >
                Specifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none">
                <p className="text-[#333333] leading-relaxed mb-4 whitespace-pre-line">
                  {productData.description}
                </p>
                
                <h3 className="text-lg font-bold text-black mt-8 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {productData.keyFeatures.map((feature, index) => (
                    <li key={index} className="text-[#333333] flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(productData.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b border-gray-200 pb-3">
                    <span className="text-sm text-[#8E8E8E]">{key}</span>
                    <span className="text-sm font-medium text-black">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-black mb-2">Standard Shipping</h4>
                  <p className="text-sm text-[#333333]">{productData.shipping.standard}</p>
                  <p className="text-sm text-[#8E8E8E] mt-1">
                    Estimated delivery: {productData.shipping.estimated}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black mb-2">Returns</h4>
                  <p className="text-sm text-[#333333]">{productData.shipping.returns}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

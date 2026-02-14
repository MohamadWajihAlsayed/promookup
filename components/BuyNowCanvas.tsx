import React from 'react';
import { ProductConfig } from '../types';
import { CheckIcon } from './Icon';

interface BuyNowCanvasProps {
  config: ProductConfig;
  id: string;
}

export const BuyNowCanvas: React.FC<BuyNowCanvasProps> = ({ config, id }) => {
  return (
    <div 
      id={id}
      className="relative flex flex-col justify-between overflow-hidden bg-[#0c2c3e] text-white"
      dir="rtl"
      style={{ 
        width: '1080px', 
        height: '1080px',
        minWidth: '1080px',
        minHeight: '1080px',
      }}
    >
      {/* Spacer for vertical centering logic */}
      <div className="flex-1 flex flex-col items-center justify-center pb-20">
        
        {/* Headlines */}
        <div className="text-center space-y-8 px-12 mb-20">
          <h1 className="text-7xl font-bold leading-tight drop-shadow-lg">
            {config.buyNowHeadline}
          </h1>
          <p className="text-5xl font-medium text-gray-200 opacity-90">
            {config.buyNowSubHeadline}
          </p>
        </div>

        {/* CTA Button */}
        <div className="bg-white text-[#0c2c3e] px-24 py-10 rounded-full text-7xl font-black shadow-2xl transform hover:scale-105 transition-transform">
          {config.buyNowCtaText}
        </div>

      </div>

      {/* Footer Features */}
      <div className="flex justify-around items-center px-12 pb-24 w-full">
         {config.buyNowFooterFeatures.map((feature, index) => (
           <div key={index} className="flex items-center gap-4">
             {/* Check Icon */}
             <div className="flex-shrink-0">
                <CheckIcon className="w-12 h-12 text-white stroke-[3px]" />
             </div>
             {/* Feature Text */}
             <span className="text-3xl font-bold">{feature}</span>
           </div>
         ))}
      </div>
    </div>
  );
};
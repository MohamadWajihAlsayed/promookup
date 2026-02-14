import React from 'react';
import { ProductConfig } from '../types';
import { StarIcon, ImageIconIcon } from './Icon';

interface PreviewCanvasProps {
  config: ProductConfig;
  id: string;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ config, id }) => {
  return (
    <div 
      id={id}
      className="relative flex flex-col overflow-hidden shadow-2xl"
      dir="rtl"
      style={{ 
        width: '1080px', 
        height: '1080px',
        minWidth: '1080px',
        minHeight: '1080px',
      }}
    >
      {/* Top Section - Dark Blue */}
      <div className="flex-1 bg-[#0c2c3e] flex p-8 relative">
        
        {/* Right Side - Text Content */}
        <div className="w-1/2 flex flex-col items-center text-center justify-center px-4 z-10">
          <h1 className="text-white text-5xl font-bold mb-8 leading-tight drop-shadow-md">
            {config.headline || 'عنوان المنتج هنا'}
          </h1>
          
          <p className="text-gray-200 text-2xl leading-relaxed mb-12 opacity-90 whitespace-pre-wrap">
            {config.description || 'وصف المنتج يظهر هنا...'}
          </p>

          <div className="mt-auto">
             <div className="inline-block bg-white text-[#0c2c3e] text-4xl font-black py-5 px-16 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-default">
              {config.ctaText || 'اطلب الآن'}
            </div>
          </div>
        </div>

        {/* Left Side - Product Image */}
        <div className="w-1/2 flex items-center justify-center px-4 relative">
           {/* Decorative Background Blob behind image */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[100px] opacity-20"></div>

           <div className="relative z-10 bg-white p-6 rounded-[3rem] shadow-2xl transform rotate-[-2deg] w-full max-w-[450px] aspect-square flex items-center justify-center overflow-hidden">
              {config.image ? (
                <img 
                  src={config.image} 
                  alt="Product" 
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-300">
                  <ImageIconIcon className="w-24 h-24 mb-4" />
                  <span className="text-2xl font-semibold">صورة المنتج</span>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Bottom Section - Grey Bar */}
      <div className="h-[240px] bg-[#ecf0f1] flex items-center justify-between px-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20">
        
        {/* Sold Count */}
        <div className="flex flex-col items-center justify-center flex-1 border-l-2 border-gray-300/50">
          <span className="text-[#0c2c3e] text-6xl font-black mb-2">{config.soldCount}</span>
          <span className="text-gray-600 text-xl font-medium">نسخة تم بيعها عالمياً</span>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-center justify-center flex-1 border-l-2 border-gray-300/50">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[#0c2c3e] text-6xl font-black">{config.rating}</span>
            <StarIcon className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
          </div>
          <span className="text-gray-600 text-xl font-medium">{config.ratingCount}</span>
        </div>

        {/* Stock */}
        <div className="flex flex-col items-center justify-center flex-1">
          <span className="text-[#0c2c3e] text-6xl font-black mb-2">{config.stockText.replace(/\D/g,'')}</span>
          <span className="text-gray-600 text-xl font-medium">{config.stockText.replace(/[0-9]/g, '') || 'المخزون المتبقي'}</span>
        </div>

      </div>
    </div>
  );
};
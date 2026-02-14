import React from 'react';
import { ProductConfig } from '../types';
import { ImageIconIcon } from './Icon';

interface WhyChooseCanvasProps {
  config: ProductConfig;
  id: string;
}

export const WhyChooseCanvas: React.FC<WhyChooseCanvasProps> = ({ config, id }) => {
  return (
    <div 
      id={id}
      className="relative flex flex-col overflow-hidden shadow-2xl bg-[#e9eff3]"
      dir="rtl"
      style={{ 
        width: '1080px', 
        height: '1080px',
        minWidth: '1080px',
        minHeight: '1080px',
      }}
    >
      {/* Header */}
      <div className="pt-20 pb-10 px-12 text-center">
        <h2 className="text-[#0c2c3e] text-6xl font-black mb-6 leading-tight">{config.whyChooseTitle}</h2>
        <div className="flex items-center justify-center">
           <p className="text-gray-500 text-3xl font-light px-8 py-2 relative inline-block">
             {config.whyChooseSubtitle}
           </p>
        </div>
      </div>

      {/* Content Area - 3 Columns */}
      <div className="flex-1 px-12 pb-20 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 w-full h-full max-h-[750px]">
          {config.reasons.slice(0, 3).map((reason, index) => (
            <div 
              key={reason.id} 
              className="bg-white rounded-[2.5rem] p-6 flex flex-col items-center text-center shadow-lg h-full border border-white"
            >
              {/* Image Top */}
              <div className="w-full aspect-[4/3] bg-gray-50 rounded-[2rem] overflow-hidden mb-8 border-4 border-[#e9eff3] flex items-center justify-center relative group p-4">
                {reason.image ? (
                  <img 
                    src={reason.image} 
                    alt={reason.title} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <ImageIconIcon className="w-16 h-16 mb-2" />
                    <span className="text-lg font-semibold">صورة</span>
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 flex flex-col px-2">
                <h3 className="text-[#0c2c3e] text-3xl font-bold mb-6 leading-snug">
                  {reason.title}
                </h3>
                <p className="text-gray-600 text-xl leading-9 font-medium opacity-90">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
          
          {/* Fillers if less than 3 reasons */}
          {Array.from({ length: Math.max(0, 3 - config.reasons.length) }).map((_, i) => (
             <div key={`empty-${i}`} className="border-4 border-dashed border-gray-300 rounded-[2.5rem] flex items-center justify-center opacity-30">
               <span className="text-2xl text-gray-400 font-bold">مكان لسبب إضافي</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
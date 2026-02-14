import React from 'react';
import { ProductConfig } from '../types';

interface FaqCanvasProps {
  config: ProductConfig;
  id: string;
}

export const FaqCanvas: React.FC<FaqCanvasProps> = ({ config, id }) => {
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
      {/* Header Section */}
      <div className="pt-20 pb-10 px-12 text-center">
        <h2 className="text-[#0c2c3e] text-7xl font-black mb-6 leading-tight">{config.faqTitle}</h2>
        <p className="text-gray-600 text-3xl font-light">
          {config.faqSubtitle}
        </p>
      </div>

      {/* FAQ List */}
      <div className="flex-1 px-16 pb-16 overflow-hidden flex flex-col justify-center">
        <div className="flex flex-col gap-6 w-full">
          {config.faqs.slice(0, 5).map((faq) => (
            <div 
              key={faq.id} 
              className="bg-white rounded-2xl p-7 shadow-sm border-r-[10px]"
              style={{ borderRightColor: '#959caf' }} 
            >
              <h3 className="text-[#0c2c3e] text-2xl font-black mb-3 text-right">
                {faq.question}
              </h3>
              <p className="text-gray-500 text-xl font-medium leading-relaxed text-right">
                {faq.answer}
              </p>
            </div>
          ))}
          
          {config.faqs.length === 0 && (
            <div className="p-20 text-center text-gray-400 text-2xl">
                أضف أسئلة شائعة
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
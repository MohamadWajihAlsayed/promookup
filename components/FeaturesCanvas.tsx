import React from 'react';
import { ProductConfig, Feature } from '../types';
import { ImageIconIcon } from './Icon';

interface FeaturesCanvasProps {
  config: ProductConfig;
  pageIndex: number; // 0 for items 0-1, 1 for items 2-3, etc.
  id: string;
}

export const FeaturesCanvas: React.FC<FeaturesCanvasProps> = ({ config, pageIndex, id }) => {
  const itemsPerPage = 2;
  const startIndex = pageIndex * itemsPerPage;
  const featuresToShow = config.features.slice(startIndex, startIndex + itemsPerPage);

  // Helper to highlight text between asterisks
  const renderDescription = (text: string) => {
    const parts = text.split('*');
    return (
      <p className="text-gray-700 text-xl leading-relaxed">
        {parts.map((part, index) => {
          // Even indices are normal text, Odd indices are highlighted
          if (index % 2 === 1) {
            return (
              <span key={index} className="bg-[#0c2c3e] text-white px-2 py-0.5 rounded mx-1 box-decoration-clone">
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  return (
    <div 
      id={id}
      className="relative flex flex-col overflow-hidden shadow-2xl bg-white"
      dir="rtl"
      style={{ 
        width: '1080px', 
        height: '1080px',
        minWidth: '1080px',
        minHeight: '1080px',
      }}
    >
      {/* Header */}
      <div className="pt-16 pb-8 px-12 text-center">
        <h2 className="text-[#0c2c3e] text-5xl font-bold mb-4">{config.featuresTitle}</h2>
        <p className="text-gray-500 text-2xl font-light opacity-90">{config.featuresSubtitle}</p>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-16 pb-16 flex flex-col gap-10 justify-center">
        {featuresToShow.map((feature, index) => {
          // Alternate layout: Even index (0) = Standard (Text Right, Image Left in RTL)
          // Odd index (1) = Reversed (Text Left, Image Right in RTL)
          const isReversed = index % 2 !== 0;

          return (
            <div 
              key={feature.id} 
              className={`bg-[#f9f9f9] rounded-[2.5rem] p-6 flex items-center shadow-lg h-[380px] ${isReversed ? 'flex-row-reverse' : ''}`}
            >
              
              {/* Text Section */}
              <div className="flex-1 px-8 flex flex-col justify-center">
                <h3 className="text-[#0c2c3e] text-3xl font-bold mb-5 text-center">{feature.title}</h3>
                <div className="text-right">
                  {renderDescription(feature.description)}
                </div>
              </div>

              {/* Image Section */}
              <div className="h-full aspect-square bg-white rounded-[2rem] overflow-hidden flex-shrink-0 border-4 border-white shadow-sm flex items-center justify-center relative p-4">
                 {feature.image ? (
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-300">
                    <ImageIconIcon className="w-16 h-16 mb-2" />
                    <span className="text-lg font-semibold">صورة</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {/* Placeholder if only 1 item on the page to keep layout balanced */}
        {featuresToShow.length === 1 && (
           <div className="h-[380px] flex items-center justify-center opacity-30 border-4 border-dashed border-gray-300 rounded-[2.5rem]">
             <span className="text-gray-400 text-3xl">مساحة لميزة إضافية</span>
           </div>
        )}
      </div>

      {/* Page Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
        {Array.from({ length: Math.ceil(config.features.length / itemsPerPage) }).map((_, i) => (
          <div 
            key={i} 
            className={`w-3 h-3 rounded-full ${i === pageIndex ? 'bg-[#0c2c3e]' : 'bg-gray-300'}`} 
          />
        ))}
      </div>
    </div>
  );
};
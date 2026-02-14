import React from 'react';
import { ProductConfig } from '../types';
import { PackageIcon } from './Icon';

interface BoxContentsCanvasProps {
  config: ProductConfig;
  id: string;
}

export const BoxContentsCanvas: React.FC<BoxContentsCanvasProps> = ({ config, id }) => {
  const itemCount = config.boxContentsItems.length;

  // Dynamic sizing to ensure items always fit within the 1080px height
  const getScale = () => {
    if (itemCount <= 4) {
      return { 
        gap: 'gap-10', 
        text: 'text-5xl', 
        count: 'text-5xl',
        img: 'w-40 h-40',
        padding: 'py-8',
        containerP: 'px-24'
      };
    } else if (itemCount <= 6) {
      return { 
        gap: 'gap-6', 
        text: 'text-4xl', 
        count: 'text-4xl',
        img: 'w-28 h-28',
        padding: 'py-5',
        containerP: 'px-20'
      };
    } else if (itemCount <= 9) {
      return { 
        gap: 'gap-4', 
        text: 'text-3xl', 
        count: 'text-3xl',
        img: 'w-20 h-20',
        padding: 'py-3',
        containerP: 'px-16'
      };
    } else {
       // Very high density (10+ items)
       return { 
        gap: 'gap-2', 
        text: 'text-2xl', 
        count: 'text-2xl',
        img: 'w-16 h-16',
        padding: 'py-2',
        containerP: 'px-16'
      };
    }
  };

  const scale = getScale();

  return (
    <div 
      id={id}
      className="relative flex flex-col overflow-hidden bg-white"
      dir="rtl"
      style={{ 
        width: '1080px', 
        height: '1080px',
        minWidth: '1080px',
        minHeight: '1080px',
      }}
    >
      {/* Header Section */}
      <div className="pt-24 pb-8 px-12 text-center">
        <h2 className="text-[#0c2c3e] text-7xl font-black mb-6">{config.boxContentsTitle}</h2>
      </div>

      {/* Content List */}
      <div className={`flex-1 flex flex-col justify-center pb-20 ${scale.containerP}`}>
        <div className={`flex flex-col ${scale.gap} w-full`}>
          {config.boxContentsItems.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center justify-between border-b border-gray-100 ${scale.padding} last:border-0`}
            >
              {/* Text Side (Right in RTL) */}
              <div className="flex items-center gap-6 flex-1 ml-8">
                 <span className={`${scale.count} font-black text-[#0c2c3e]`}>{item.count}</span>
                 <span className={`${scale.text} font-bold text-slate-800`}>{item.text}</span>
              </div>

              {/* Image Side (Left in RTL) */}
              <div className={`${scale.img} rounded-full border-4 border-[#0c2c3e] flex items-center justify-center overflow-hidden bg-white p-2 shrink-0`}>
                {item.image ? (
                  <img src={item.image} alt={item.text} className="w-full h-full object-contain" />
                ) : (
                  <PackageIcon className="w-1/2 h-1/2 text-gray-300" />
                )}
              </div>
            </div>
          ))}

          {config.boxContentsItems.length === 0 && (
            <div className="p-20 text-center text-gray-400 text-3xl border-4 border-dashed border-gray-100 rounded-3xl">
                أضف محتويات الصندوق
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
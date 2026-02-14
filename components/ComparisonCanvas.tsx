import React from 'react';
import { ProductConfig } from '../types';
import { CheckIcon } from './Icon';

interface ComparisonCanvasProps {
  config: ProductConfig;
  id: string;
}

export const ComparisonCanvas: React.FC<ComparisonCanvasProps> = ({ config, id }) => {
  const rowCount = config.comparisonRows.length;

  // Dynamic layout configuration based on number of rows to fit vertically
  const getLayoutConfig = () => {
    if (rowCount <= 4) {
      return { 
        headerPy: 'py-6', 
        rowH: 'min-h-[140px]', 
        text: 'text-2xl', 
        valueText: 'text-3xl',
        icon: 'w-9 h-9',
        iconContainer: 'p-1.5',
        cellPadding: 'p-6'
      };
    } else if (rowCount <= 6) {
       return { 
        headerPy: 'py-5', 
        rowH: 'min-h-[110px]', 
        text: 'text-xl', 
        valueText: 'text-2xl',
        icon: 'w-7 h-7',
        iconContainer: 'p-1',
        cellPadding: 'p-4'
      };
    } else if (rowCount <= 8) {
       return { 
        headerPy: 'py-4', 
        rowH: 'min-h-[90px]', 
        text: 'text-lg', 
        valueText: 'text-xl',
        icon: 'w-6 h-6',
        iconContainer: 'p-1',
        cellPadding: 'p-3'
      };
    } else {
       // High density
       return { 
        headerPy: 'py-3', 
        rowH: 'min-h-[70px]', 
        text: 'text-base', 
        valueText: 'text-lg',
        icon: 'w-5 h-5',
        iconContainer: 'p-0.5',
        cellPadding: 'p-2'
      };
    }
  };

  const layout = getLayoutConfig();

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
      <div className="pt-24 pb-8 px-12 text-center flex-shrink-0">
        <h2 className="text-[#0c2c3e] text-7xl font-black mb-4 leading-tight">{config.comparisonTitle}</h2>
        <p className="text-gray-600 text-3xl font-light">
          {config.comparisonSubtitle}
        </p>
      </div>

      {/* Comparison Table */}
      <div className="flex-1 px-16 pb-16 flex items-center justify-center overflow-hidden">
        <div className="w-full bg-white rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col max-h-full">
          
          {/* Table Header */}
          <div className={`bg-[#0c2c3e] text-white flex text-center ${layout.headerPy} flex-shrink-0`}>
            <div className={`w-[20%] ${layout.text} font-bold px-4 border-l border-[#1a4055] flex items-center justify-center`}>
              الميزة
            </div>
            <div className={`w-[40%] ${layout.text} font-bold px-4 border-l border-[#1a4055] flex items-center justify-center`}>
              {config.comparisonProductName}
            </div>
            <div className={`w-[40%] ${layout.text} font-bold px-4 flex items-center justify-center`}>
              {config.comparisonCompetitorName}
            </div>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {config.comparisonRows.map((row, index) => (
              <div 
                key={row.id} 
                className={`flex items-stretch ${layout.rowH} ${index !== config.comparisonRows.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                {/* Feature Name */}
                <div className={`w-[20%] flex items-center justify-center ${layout.cellPadding} bg-gray-50 text-[#0c2c3e] ${layout.text} font-bold border-l border-gray-200`}>
                  {row.featureName}
                </div>

                {/* Product Value (Winner) */}
                <div className="w-[40%] flex items-center border-l border-gray-200 relative bg-green-50/10">
                   {/* Checkmark Column - Fixed width relative to font size */}
                   <div className="w-20 flex-shrink-0 flex items-center justify-center self-stretch">
                      <div className={`bg-green-100 ${layout.iconContainer} rounded-full`}>
                         <CheckIcon className={`${layout.icon} text-green-600 stroke-[3px]`} />
                      </div>
                   </div>
                   
                   {/* Text Content */}
                   <div className={`flex-1 flex items-center ${layout.cellPadding} pl-6 pr-0`}>
                      <span className={`text-[#0c2c3e] ${layout.valueText} font-bold leading-normal text-right`}>
                        {row.productValue}
                      </span>
                   </div>
                </div>

                {/* Competitor Value */}
                <div className={`w-[40%] flex items-center justify-center ${layout.cellPadding} text-gray-500 ${layout.text} font-medium text-center leading-normal`}>
                  {row.competitorValue}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State / Fillers if needed */}
          {config.comparisonRows.length === 0 && (
             <div className="p-20 text-center text-gray-400 text-2xl">
                أضف مواصفات للمقارنة
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
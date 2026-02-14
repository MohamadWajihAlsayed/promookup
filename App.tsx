import React, { useState } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { PreviewCanvas } from './components/PreviewCanvas';
import { FeaturesCanvas } from './components/FeaturesCanvas';
import { WhyChooseCanvas } from './components/WhyChooseCanvas';
import { ComparisonCanvas } from './components/ComparisonCanvas';
import { FaqCanvas } from './components/FaqCanvas';
import { BoxContentsCanvas } from './components/BoxContentsCanvas';
import { BuyNowCanvas } from './components/BuyNowCanvas';
import { WizardModal } from './components/WizardModal';
import { ProductConfig, DEFAULT_CONFIG } from './types';
import { downloadImage, downloadAllImages } from './utils/download';
import { DownloadIcon, PackageIcon } from './components/Icon'; // Assuming PackageIcon can be used or just reuse generic

const App: React.FC = () => {
  const [config, setConfig] = useState<ProductConfig>(DEFAULT_CONFIG);
  const [currentView, setCurrentView] = useState<number>(0); // 0 = Main, 1...N = Features, Last = Why Choose
  const [isDownloading, setIsDownloading] = useState(false);
  const [showWizard, setShowWizard] = useState(true);

  // Scaling factor for the preview to fit in viewport
  const previewScale = 0.5; 

  // Calculate total feature pages (2 items per page)
  const featuresPageCount = Math.ceil(config.features.length / 2);
  
  // View Indices
  const whyChoosePageIndex = featuresPageCount + 1;
  const comparisonPageIndex = featuresPageCount + 2;
  const faqPageIndex = featuresPageCount + 3;
  const boxContentsPageIndex = featuresPageCount + 4;
  const buyNowPageIndex = featuresPageCount + 5;

  const handleConfigChange = (key: keyof ProductConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    if(window.confirm('هل تريد البدء من جديد باستخدام المعالج الذكي؟')) {
      setShowWizard(true);
      setConfig(DEFAULT_CONFIG);
    } else {
      setConfig(DEFAULT_CONFIG);
    }
    setCurrentView(0);
  };

  const handleWizardComplete = (newConfig: ProductConfig) => {
    setConfig(newConfig);
    setShowWizard(false);
  };

  const handleDownloadCurrent = async () => {
    setIsDownloading(true);
    setTimeout(async () => {
      let elementId = '';
      let fileName = '';

      if (currentView === 0) {
        elementId = 'mockup-canvas';
        fileName = `product-main-${Date.now()}.png`;
      } else if (currentView <= featuresPageCount) {
        elementId = `features-canvas-${currentView}`;
        fileName = `product-features-${currentView}-${Date.now()}.png`;
      } else if (currentView === whyChoosePageIndex) {
        elementId = 'why-choose-canvas';
        fileName = `product-why-choose-${Date.now()}.png`;
      } else if (currentView === comparisonPageIndex) {
        elementId = 'comparison-canvas';
        fileName = `product-comparison-${Date.now()}.png`;
      } else if (currentView === faqPageIndex) {
        elementId = 'faq-canvas';
        fileName = `product-faq-${Date.now()}.png`;
      } else if (currentView === boxContentsPageIndex) {
        elementId = 'box-contents-canvas';
        fileName = `product-contents-${Date.now()}.png`;
      } else {
        elementId = 'buy-now-canvas';
        fileName = `product-buy-now-${Date.now()}.png`;
      }
        
      await downloadImage(elementId, fileName);
      setIsDownloading(false);
    }, 100);
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    const timestamp = Date.now();
    const downloadQueue = [];

    // Main
    downloadQueue.push({ id: 'mockup-canvas-hidden', name: `01-Main-${timestamp}.png` });

    // Features
    for (let i = 1; i <= featuresPageCount; i++) {
       downloadQueue.push({ id: `features-canvas-hidden-${i}`, name: `02-Feature-${i}-${timestamp}.png` });
    }

    // Why Choose
    downloadQueue.push({ id: 'why-choose-canvas-hidden', name: `03-WhyChoose-${timestamp}.png` });
    
    // Comparison
    downloadQueue.push({ id: 'comparison-canvas-hidden', name: `04-Comparison-${timestamp}.png` });

    // FAQ
    downloadQueue.push({ id: 'faq-canvas-hidden', name: `05-FAQ-${timestamp}.png` });

    // Box Contents
    downloadQueue.push({ id: 'box-contents-canvas-hidden', name: `06-Contents-${timestamp}.png` });

    // Buy Now
    downloadQueue.push({ id: 'buy-now-canvas-hidden', name: `07-BuyNow-${timestamp}.png` });

    // Wait a tick for rendering stability then download
    setTimeout(async () => {
      await downloadAllImages(downloadQueue);
      setIsDownloading(false);
    }, 500);
  };

  // Helper to render the correct canvas based on currentView for display
  const renderCurrentCanvas = () => {
    if (currentView === 0) {
      return <PreviewCanvas config={config} id="mockup-canvas" />;
    } 
    if (currentView <= featuresPageCount) {
      return (
        <FeaturesCanvas 
          config={config} 
          pageIndex={currentView - 1} 
          id={`features-canvas-${currentView}`} 
        />
      );
    }
    if (currentView === whyChoosePageIndex) {
       return <WhyChooseCanvas config={config} id="why-choose-canvas" />;
    }
    if (currentView === comparisonPageIndex) {
       return <ComparisonCanvas config={config} id="comparison-canvas" />;
    }
    if (currentView === faqPageIndex) {
       return <FaqCanvas config={config} id="faq-canvas" />;
    }
    if (currentView === boxContentsPageIndex) {
      return <BoxContentsCanvas config={config} id="box-contents-canvas" />;
    }
    return <BuyNowCanvas config={config} id="buy-now-canvas" />;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900 font-sans flex flex-col md:flex-row h-screen overflow-hidden">
      
      {showWizard && (
        <WizardModal 
          onComplete={handleWizardComplete} 
          onCancel={() => setShowWizard(false)} 
        />
      )}

      {/* Sidebar / Editor */}
      <div className="w-full md:w-[420px] h-full border-l border-gray-200 flex-shrink-0 z-20 shadow-xl flex flex-col bg-white">
        <EditorPanel 
          config={config} 
          onChange={handleConfigChange} 
          onImageUpload={handleImageUpload}
          onReset={handleReset}
        />
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 h-full bg-slate-200 relative overflow-hidden flex flex-col">
        
        {/* Header/Toolbar */}
        <div className="bg-white p-4 shadow-sm flex justify-between items-center z-10 px-8">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-black text-[#0c2c3e]">ProMockup</h1>
             
             {/* View Switcher */}
             <div className="flex bg-gray-100 rounded-lg p-1 gap-1 overflow-x-auto no-scrollbar max-w-[600px]">
                <button
                  onClick={() => setCurrentView(0)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                    currentView === 0 
                    ? 'bg-white shadow text-[#0c2c3e]' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  الرئيسية
                </button>
                {Array.from({ length: featuresPageCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentView(i + 1)}
                    className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                      currentView === i + 1
                      ? 'bg-white shadow text-[#0c2c3e]' 
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    ميزات {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentView(whyChoosePageIndex)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                    currentView === whyChoosePageIndex
                    ? 'bg-white shadow text-[#0c2c3e]' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  لماذا تختارنا
                </button>
                 <button
                  onClick={() => setCurrentView(comparisonPageIndex)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                    currentView === comparisonPageIndex
                    ? 'bg-white shadow text-[#0c2c3e]' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  مقارنة
                </button>
                 <button
                  onClick={() => setCurrentView(faqPageIndex)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                    currentView === faqPageIndex
                    ? 'bg-white shadow text-[#0c2c3e]' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  الأسئلة
                </button>
                 <button
                  onClick={() => setCurrentView(boxContentsPageIndex)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                    currentView === boxContentsPageIndex
                    ? 'bg-white shadow text-[#0c2c3e]' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  الصندوق
                </button>
                 <button
                  onClick={() => setCurrentView(buyNowPageIndex)}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                    currentView === buyNowPageIndex
                    ? 'bg-white shadow text-[#0c2c3e]' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  طلب الشراء
                </button>
             </div>
          </div>

          <div className="flex gap-3">
             <button 
                onClick={() => setShowWizard(true)}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg font-bold transition-all"
                title="فتح المساعد الذكي"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                <span className="hidden lg:inline">مساعد AI</span>
             </button>

             {/* Download Single */}
             <button 
              onClick={handleDownloadCurrent}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
            >
              {isDownloading ? (
                <span>...</span>
              ) : (
                <DownloadIcon className="w-5 h-5" />
              )}
            </button>

            {/* Download All */}
            <button 
              onClick={handleDownloadAll}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-[#0c2c3e] hover:bg-[#163a50] text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform active:scale-95 whitespace-nowrap"
            >
              {isDownloading ? (
                <span>جاري التحميل...</span>
              ) : (
                <>
                  <span>تحميل الكل</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-slate-200/50">
          <div 
            className="relative shadow-2xl rounded-sm transition-all duration-300"
            style={{
               width: '1080px',
               height: '1080px',
               transform: `scale(${previewScale})`,
               transformOrigin: 'center center',
            }}
          >
             {renderCurrentCanvas()}
          </div>
        </div>
      </div>

      {/* Hidden Render Area for Bulk Download */}
      <div 
        className="fixed top-0 left-0 opacity-0 pointer-events-none" 
        style={{ width: '1080px', height: '1080px', overflow: 'hidden', zIndex: -1 }}
      >
         <PreviewCanvas config={config} id="mockup-canvas-hidden" />
         {Array.from({ length: featuresPageCount }).map((_, i) => (
             <FeaturesCanvas key={i} config={config} pageIndex={i} id={`features-canvas-hidden-${i+1}`} />
         ))}
         <WhyChooseCanvas config={config} id="why-choose-canvas-hidden" />
         <ComparisonCanvas config={config} id="comparison-canvas-hidden" />
         <FaqCanvas config={config} id="faq-canvas-hidden" />
         <BoxContentsCanvas config={config} id="box-contents-canvas-hidden" />
         <BuyNowCanvas config={config} id="buy-now-canvas-hidden" />
      </div>

    </div>
  );
};

export default App;
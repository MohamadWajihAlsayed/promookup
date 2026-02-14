import React, { useState } from 'react';
import { ProductConfig, Feature, ComparisonRow, FaqItem, BoxContentItem } from '../types';
import { UploadIcon, ResetIcon, ImageIconIcon, PlusIcon, TrashIcon, LayoutIcon } from './Icon';

interface EditorPanelProps {
  config: ProductConfig;
  onChange: (key: keyof ProductConfig, value: any) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ config, onChange, onImageUpload, onReset }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'features' | 'whyChoose' | 'comparison' | 'faq' | 'contents' | 'buyNow'>('main');

  // Generic handler for list items (Features or Reasons)
  const handleListChange = (listKey: 'features' | 'reasons', id: string, key: keyof Feature, value: string) => {
    const list = config[listKey] as Feature[];
    const updatedList = list.map(item => 
      item.id === id ? { ...item, [key]: value } : item
    );
    onChange(listKey, updatedList);
  };

  const handleComparisonChange = (id: string, key: keyof ComparisonRow, value: string) => {
    const updatedRows = config.comparisonRows.map(row => 
      row.id === id ? { ...row, [key]: value } : row
    );
    onChange('comparisonRows', updatedRows);
  };

  const handleFaqChange = (id: string, key: keyof FaqItem, value: string) => {
     const updatedFaqs = config.faqs.map(faq =>
        faq.id === id ? { ...faq, [key]: value } : faq
     );
     onChange('faqs', updatedFaqs);
  };

  const handleBoxContentChange = (id: string, key: keyof BoxContentItem, value: string) => {
     const updatedItems = config.boxContentsItems.map(item =>
        item.id === id ? { ...item, [key]: value } : item
     );
     onChange('boxContentsItems', updatedItems);
  };

  const handleBoxContentImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
         handleBoxContentChange(id, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListImageUpload = (listKey: 'features' | 'reasons', id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleListChange(listKey, id, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBuyNowFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...config.buyNowFooterFeatures];
    updatedFeatures[index] = value;
    onChange('buyNowFooterFeatures', updatedFeatures);
  };

  const addListItem = (listKey: 'features' | 'reasons') => {
    const newItem: Feature = {
      id: Date.now().toString(),
      title: 'عنوان جديد',
      description: 'الوصف هنا...',
      image: null
    };
    onChange(listKey, [...config[listKey], newItem]);
  };

  const addComparisonRow = () => {
    const newRow: ComparisonRow = {
      id: Date.now().toString(),
      featureName: "الميزة",
      productValue: "القيمة لدينا",
      competitorValue: "القيمة لديهم"
    };
    onChange('comparisonRows', [...config.comparisonRows, newRow]);
  };

  const addFaqItem = () => {
    const newItem: FaqItem = {
      id: Date.now().toString(),
      question: "سؤال جديد؟",
      answer: "الإجابة هنا"
    };
    onChange('faqs', [...config.faqs, newItem]);
  };

  const addBoxContentItem = () => {
    const newItem: BoxContentItem = {
      id: Date.now().toString(),
      text: "عنصر جديد",
      count: "1x",
      image: null
    };
    onChange('boxContentsItems', [...config.boxContentsItems, newItem]);
  };

  const removeListItem = (listKey: 'features' | 'reasons', id: string) => {
    onChange(listKey, config[listKey].filter(item => item.id !== id));
  };

  const removeComparisonRow = (id: string) => {
     onChange('comparisonRows', config.comparisonRows.filter(row => row.id !== id));
  };
  
  const removeFaqItem = (id: string) => {
     onChange('faqs', config.faqs.filter(faq => faq.id !== id));
  };

  const removeBoxContentItem = (id: string) => {
    onChange('boxContentsItems', config.boxContentsItems.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white flex flex-col h-full shadow-sm" dir="rtl">
      
      {/* Header & Tabs */}
      <div className="p-6 pb-0 border-b border-gray-100 bg-white z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">بيانات التصميم</h2>
          <button 
            onClick={onReset}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            title="إعادة تعيين"
          >
            <ResetIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveTab('main')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'main' 
                ? 'border-[#0c2c3e] text-[#0c2c3e]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'features'
                ? 'border-[#0c2c3e] text-[#0c2c3e]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            المميزات
          </button>
           <button
            onClick={() => setActiveTab('whyChoose')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'whyChoose'
                ? 'border-[#0c2c3e] text-[#0c2c3e]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            لماذا تختارنا
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'border-[#0c2c3e] text-[#0c2c3e]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            مقارنة
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'faq'
                ? 'border-[#0c2c3e] text-[#0c2c3e]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الأسئلة
          </button>
           <button
            onClick={() => setActiveTab('contents')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'contents'
                ? 'border-[#0c2c3e] text-[#0c2c3e]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الصندوق
          </button>
          <button
            onClick={() => setActiveTab('buyNow')}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'buyNow'
                ? 'border-[#0c2c3e] text-[#0c2c3e]' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الشراء
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'main' && (
          <div className="space-y-6">
            {/* Main Page Inputs */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">عنوان المنتج</span>
                <input
                  type="text"
                  value={config.headline}
                  onChange={(e) => onChange('headline', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                  placeholder="مثال: ايفون 15 برو ماكس"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">وصف المنتج</span>
                <textarea
                  value={config.description}
                  onChange={(e) => onChange('description', e.target.value)}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">نص زر الدعوة (CTA)</span>
                <input
                  type="text"
                  value={config.ctaText}
                  onChange={(e) => onChange('ctaText', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>

              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-700">صورة المنتج الرئيسية</span>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    <UploadIcon className="w-6 h-6 mb-1 text-slate-400" />
                    <p className="text-xs text-slate-500">رفع صورة</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
                </label>
                {config.image && (
                   <div className="relative w-full h-16 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center border border-slate-200">
                     <img src={config.image} alt="Preview" className="h-full object-contain" />
                     <button 
                       onClick={() => onChange('image', '')}
                       className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                     >
                       <TrashIcon className="w-3 h-3" />
                     </button>
                   </div>
                )}
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">عدد المباع</span>
                <input
                  type="text"
                  value={config.soldCount}
                  onChange={(e) => onChange('soldCount', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">التقييم (الرقم)</span>
                <input
                  type="text"
                  value={config.rating}
                  onChange={(e) => onChange('rating', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
               <label className="block">
                <span className="text-sm font-medium text-slate-700">نص التقييم</span>
                <input
                  type="text"
                  value={config.ratingCount}
                  onChange={(e) => onChange('ratingCount', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">المخزون</span>
                <input
                  type="text"
                  value={config.stockText}
                  onChange={(e) => onChange('stockText', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">عنوان صفحة المميزات</span>
                <input
                  type="text"
                  value={config.featuresTitle}
                  onChange={(e) => onChange('featuresTitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
               <label className="block">
                <span className="text-sm font-medium text-slate-700">وصف قصير</span>
                <input
                  type="text"
                  value={config.featuresSubtitle}
                  onChange={(e) => onChange('featuresSubtitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
            </div>
            <hr className="border-slate-200" />
            <div className="space-y-6">
              {config.features.map((feature, index) => (
                <div key={feature.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-bold">ميزة {index + 1}</span>
                    <button 
                      onClick={() => removeListItem('features', feature.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="حذف"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleListChange('features', feature.id, 'title', e.target.value)}
                      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                      placeholder="العنوان"
                    />
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleListChange('features', feature.id, 'description', e.target.value)}
                      rows={3}
                      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                      placeholder="الوصف (*نص مميز*)"
                    />
                    <div className="flex items-center gap-3">
                       <label className="flex-1 flex items-center justify-center h-10 border border-dashed border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <UploadIcon className="w-3 h-3" /> رفع صورة
                          </span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleListImageUpload('features', feature.id, e)} />
                        </label>
                        {feature.image && (
                          <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden bg-white">
                            <img src={feature.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addListItem('features')}
                className="w-full py-3 border-2 border-dashed border-[#0c2c3e] text-[#0c2c3e] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0c2c3e]/5 transition-colors"
              >
                <PlusIcon className="w-5 h-5" /> إضافة ميزة
              </button>
            </div>
          </div>
        )}

        {activeTab === 'whyChoose' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">عنوان الصفحة</span>
                <input
                  type="text"
                  value={config.whyChooseTitle}
                  onChange={(e) => onChange('whyChooseTitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
               <label className="block">
                <span className="text-sm font-medium text-slate-700">نص فرعي (تحت العنوان)</span>
                <input
                  type="text"
                  value={config.whyChooseSubtitle}
                  onChange={(e) => onChange('whyChooseSubtitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
            </div>
            <hr className="border-slate-200" />
            <div className="space-y-6">
              {config.reasons.map((reason, index) => (
                <div key={reason.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-bold">سبب {index + 1}</span>
                    <button 
                      onClick={() => removeListItem('reasons', reason.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="حذف"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={reason.title}
                      onChange={(e) => handleListChange('reasons', reason.id, 'title', e.target.value)}
                      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                      placeholder="العنوان"
                    />
                    <textarea
                      value={reason.description}
                      onChange={(e) => handleListChange('reasons', reason.id, 'description', e.target.value)}
                      rows={3}
                      className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                      placeholder="الوصف"
                    />
                    <div className="flex items-center gap-3">
                       <label className="flex-1 flex items-center justify-center h-10 border border-dashed border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <UploadIcon className="w-3 h-3" /> رفع صورة
                          </span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleListImageUpload('reasons', reason.id, e)} />
                        </label>
                        {reason.image && (
                          <div className="w-10 h-10 rounded border border-slate-200 overflow-hidden bg-white">
                            <img src={reason.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addListItem('reasons')}
                className="w-full py-3 border-2 border-dashed border-[#0c2c3e] text-[#0c2c3e] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0c2c3e]/5 transition-colors"
              >
                <PlusIcon className="w-5 h-5" /> إضافة سبب
              </button>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-8">
             <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">عنوان المقارنة</span>
                <input
                  type="text"
                  value={config.comparisonTitle}
                  onChange={(e) => onChange('comparisonTitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
              
               <label className="block">
                <span className="text-sm font-medium text-slate-700">النص الفرعي (تحت العنوان)</span>
                <input
                  type="text"
                  value={config.comparisonSubtitle}
                  onChange={(e) => onChange('comparisonSubtitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>

               <label className="block">
                <span className="text-sm font-medium text-slate-700">اسم المنتج (في الجدول)</span>
                <input
                  type="text"
                  value={config.comparisonProductName}
                  onChange={(e) => onChange('comparisonProductName', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">اسم المنتج المنافس</span>
                <input
                  type="text"
                  value={config.comparisonCompetitorName}
                  onChange={(e) => onChange('comparisonCompetitorName', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
            </div>
            <hr className="border-slate-200" />
            <div className="space-y-6">
               {config.comparisonRows.map((row, index) => (
                 <div key={row.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative">
                   <div className="flex justify-between items-start mb-3">
                      <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-bold">مواصفة {index + 1}</span>
                      <button 
                        onClick={() => removeComparisonRow(row.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="حذف"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                       <input
                        type="text"
                        value={row.featureName}
                        onChange={(e) => handleComparisonChange(row.id, 'featureName', e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                        placeholder="اسم الميزة (مثلاً: الشاشة)"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-slate-500 mb-1 block">منتجك</label>
                          <textarea
                            value={row.productValue}
                            onChange={(e) => handleComparisonChange(row.id, 'productValue', e.target.value)}
                            rows={2}
                            className="block w-full px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="القيمة"
                          />
                        </div>
                        <div>
                           <label className="text-xs text-slate-500 mb-1 block">المنافس</label>
                           <textarea
                            value={row.competitorValue}
                            onChange={(e) => handleComparisonChange(row.id, 'competitorValue', e.target.value)}
                            rows={2}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                            placeholder="القيمة"
                          />
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
               <button
                onClick={addComparisonRow}
                className="w-full py-3 border-2 border-dashed border-[#0c2c3e] text-[#0c2c3e] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0c2c3e]/5 transition-colors"
              >
                <PlusIcon className="w-5 h-5" /> إضافة مقارنة
              </button>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
           <div className="space-y-8">
             <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">عنوان الصفحة</span>
                <input
                  type="text"
                  value={config.faqTitle}
                  onChange={(e) => onChange('faqTitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
              
               <label className="block">
                <span className="text-sm font-medium text-slate-700">النص الفرعي</span>
                <input
                  type="text"
                  value={config.faqSubtitle}
                  onChange={(e) => onChange('faqSubtitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
             </div>
             <hr className="border-slate-200" />
             <div className="space-y-6">
                {config.faqs.map((faq, index) => (
                  <div key={faq.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative">
                     <div className="flex justify-between items-start mb-3">
                      <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-bold">سؤال {index + 1}</span>
                      <button 
                        onClick={() => removeFaqItem(faq.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="حذف"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                       <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                        placeholder="السؤال"
                      />
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
                        rows={3}
                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                        placeholder="الإجابة"
                      />
                    </div>
                  </div>
                ))}
                <button
                onClick={addFaqItem}
                className="w-full py-3 border-2 border-dashed border-[#0c2c3e] text-[#0c2c3e] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0c2c3e]/5 transition-colors"
              >
                <PlusIcon className="w-5 h-5" /> إضافة سؤال
              </button>
             </div>
           </div>
        )}

        {activeTab === 'contents' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">عنوان الصفحة</span>
                <input
                  type="text"
                  value={config.boxContentsTitle}
                  onChange={(e) => onChange('boxContentsTitle', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
            </div>
            <hr className="border-slate-200" />
            <div className="space-y-6">
              {config.boxContentsItems.map((item, index) => (
                 <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative">
                   <div className="flex justify-between items-start mb-3">
                      <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded font-bold">عنصر {index + 1}</span>
                      <button 
                        onClick={() => removeBoxContentItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="حذف"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex-1 space-y-3">
                         <div className="flex gap-2">
                           <input
                              type="text"
                              value={item.count}
                              onChange={(e) => handleBoxContentChange(item.id, 'count', e.target.value)}
                              className="w-20 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                              placeholder="العدد (1x)"
                            />
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => handleBoxContentChange(item.id, 'text', e.target.value)}
                              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                              placeholder="اسم العنصر"
                            />
                         </div>
                       </div>
                       <div>
                         <label className="w-16 h-16 border border-dashed border-slate-300 rounded-lg cursor-pointer bg-white hover:bg-slate-50 transition-colors flex flex-col items-center justify-center overflow-hidden relative">
                            {item.image ? (
                               <img src={item.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                               <UploadIcon className="w-4 h-4 text-slate-400" />
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBoxContentImageUpload(item.id, e)} />
                         </label>
                       </div>
                    </div>
                 </div>
              ))}
               <button
                onClick={addBoxContentItem}
                className="w-full py-3 border-2 border-dashed border-[#0c2c3e] text-[#0c2c3e] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0c2c3e]/5 transition-colors"
              >
                <PlusIcon className="w-5 h-5" /> إضافة محتوى
              </button>
            </div>
          </div>
        )}

        {activeTab === 'buyNow' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">العنوان الرئيسي</span>
                <input
                  type="text"
                  value={config.buyNowHeadline}
                  onChange={(e) => onChange('buyNowHeadline', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>

               <label className="block">
                <span className="text-sm font-medium text-slate-700">النص الفرعي</span>
                <input
                  type="text"
                  value={config.buyNowSubHeadline}
                  onChange={(e) => onChange('buyNowSubHeadline', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">نص الزر (CTA)</span>
                <input
                  type="text"
                  value={config.buyNowCtaText}
                  onChange={(e) => onChange('buyNowCtaText', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                />
              </label>
            </div>
            
            <hr className="border-slate-200" />
            
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-slate-800">مميزات الفوتر (تظهر بأسفل الصفحة)</h3>
               {config.buyNowFooterFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                     <span className="flex items-center justify-center bg-slate-100 text-slate-500 rounded px-2 text-xs font-bold">
                       {index + 1}
                     </span>
                     <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleBuyNowFeatureChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2c3e]"
                      />
                  </div>
               ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
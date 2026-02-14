import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ProductConfig, DEFAULT_CONFIG } from '../types';
import { UploadIcon } from './Icon';

interface WizardModalProps {
  onComplete: (config: ProductConfig) => void;
  onCancel: () => void;
}

export const WizardModal: React.FC<WizardModalProps> = ({ onComplete, onCancel }) => {
  const [productName, setProductName] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImages(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Helper to generate (EDIT) an image. We pass the user's image as reference to keep the product exact.
  const generateAiImage = async (ai: GoogleGenAI, prompt: string, referenceImageBase64: string): Promise<string | null> => {
    try {
      // Parse base64
      const base64Data = referenceImageBase64.split(',')[1];
      const mimeType = referenceImageBase64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/png';

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            { text: prompt }
          ]
        },
        config: {
           // We rely on the model to understand this is an edit request due to Image + Text input
        }
      });

      // Extract image from response
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (e) {
      console.error("Failed to generate/edit image:", e);
      return null;
    }
  };

  const generateContent = async () => {
    if (!productName || !productDetails) {
      alert('يرجى إدخال اسم المنتج وتفاصيله');
      return;
    }

    if (images.length === 0) {
       alert('يرجى رفع صورة واحدة على الأقل للمنتج لضمان دقة التوليد.');
       return;
    }

    setIsLoading(true);
    setLoadingStep('جاري تحليل الصور والنصوص بالذكاء الاصطناعي...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare uploaded images for the model (stripped base64)
      const imageParts = images.map(img => {
        const base64Data = img.split(',')[1];
        const mimeType = img.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1] || 'image/jpeg';
        
        return {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        };
      });

      const promptText = `
        أنت خبير تسويق (Copywriter) محترف ومصمم منتجات عالمي.
        المهمة: إنشاء محتوى تسويقي كامل وجذاب لمنتج بناءً على البيانات المقدمة فقط.

        اسم المنتج: "${productName}"
        تفاصيل المنتج الخام: "${productDetails}"

        **القواعد الصارمة للمحتوى (Strict Content Rules):**
        1. **الجودة والإقناع:** يجب أن يكون المحتوى باللغة العربية الفصحى، بأسلوب تسويقي جذاب، مقنع، واحترافي. تجنب الجمل الركيكة أو الترجمة الحرفية. ركز على "الفوائد" (Benefits) التي يجنيها العميل وليس فقط "المواصفات" (Features).
        2. **الالتزام بالمصدر:** استخرج المعلومات *حصرياً* من تفاصيل المنتج المقدمة ومن الصور المرفقة. لا تقم بتأليف مواصفات تقنية غير موجودة (Hallucination). إذا كانت المعلومات شحيحة، قم بصياغة الموجود بأسلوب إبداعي دون إضافة أكاذيب.
        3. **التنسيق:** استخدم كلمات قوية ومؤثرة في العناوين (Power Words).

        **تعليمات الصور (Image Instructions):**
        - لديك ${images.length} صور مرفقة للمنتج.
        - لكل قسم، حاول اختيار أفضل صورة "upload" من الصور المرفقة.
        - إذا كان القسم يتطلب صورة معبرة غير موجودة، سنقوم بتوليدها عبر "تعديل" صورة المنتج الأصلية.
        - في حقل "generationPrompt" (بالإنجليزي): اكتب وصفاً دقيقاً لإضافة عنصر مرئي بجانب المنتج *دون* تغيير المنتج نفسه.
          مثال: "Keep the product exactly as is. Add a lightning bolt icon next to it to symbolize fast charging."

        المطلوب إخراج JSON يحتوي على الهيكل التالي بدقة:
        - headlines & descriptions: نصوص عربية جذابة.
        - features: قائمة بأهم المميزات المستخلصة (title, description).
        - reasons: أسباب مقنعة للشراء.
        - comparisonRows: مقارنة مع المنافسين (كن واقعياً بناءً على ميزات المنتج).
        - faqs: أسئلة شائعة منطقية.
        - boxContentsItems: محتويات الصندوق المتوقعة أو المذكورة.
      `;

      const contents = [
        ...imageParts, // Send images first so model "sees" them
        { text: promptText }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: contents as any },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              description: { type: Type.STRING },
              ctaText: { type: Type.STRING },
              soldCount: { type: Type.STRING },
              rating: { type: Type.STRING },
              ratingCount: { type: Type.STRING },
              stockText: { type: Type.STRING },
              featuresTitle: { type: Type.STRING },
              featuresSubtitle: { type: Type.STRING },
              features: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    imageSource: { type: Type.STRING, enum: ["upload", "generate"] },
                    userImageIndex: { type: Type.INTEGER },
                    generationPrompt: { type: Type.STRING }
                  }
                }
              },
              whyChooseTitle: { type: Type.STRING },
              whyChooseSubtitle: { type: Type.STRING },
              reasons: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    imageSource: { type: Type.STRING, enum: ["upload", "generate"] },
                    userImageIndex: { type: Type.INTEGER },
                    generationPrompt: { type: Type.STRING }
                  }
                }
              },
              comparisonTitle: { type: Type.STRING },
              comparisonSubtitle: { type: Type.STRING },
              comparisonProductName: { type: Type.STRING },
              comparisonCompetitorName: { type: Type.STRING },
              comparisonRows: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    featureName: { type: Type.STRING },
                    productValue: { type: Type.STRING },
                    competitorValue: { type: Type.STRING }
                  }
                }
              },
              faqTitle: { type: Type.STRING },
              faqSubtitle: { type: Type.STRING },
              faqs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  }
                }
              },
              boxContentsTitle: { type: Type.STRING },
              boxContentsItems: {
                 type: Type.ARRAY,
                 items: {
                   type: Type.OBJECT,
                   properties: {
                     text: { type: Type.STRING },
                     count: { type: Type.STRING },
                     imageSource: { type: Type.STRING, enum: ["upload", "generate"] },
                     userImageIndex: { type: Type.INTEGER },
                     generationPrompt: { type: Type.STRING }
                   }
                 }
              },
              buyNowHeadline: { type: Type.STRING },
              buyNowSubHeadline: { type: Type.STRING },
              buyNowCtaText: { type: Type.STRING },
              buyNowFooterFeatures: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      const generatedData = JSON.parse(response.text || '{}');
      
      setLoadingStep('جاري دمج صور المنتج الأصلي مع التصاميم...');

      // Helper to process list (Features/Reasons/BoxContents) and resolve images
      const processListWithImages = async (list: any[]) => {
        return Promise.all(list.map(async (item: any, i: number) => {
          let finalImage = null;
          
          if (item.imageSource === 'upload' && item.userImageIndex !== undefined && images[item.userImageIndex]) {
             finalImage = images[item.userImageIndex];
          } else if (item.imageSource === 'generate' && item.generationPrompt) {
             // CRITICAL: We pass an existing image to the generator to EDIT it, ensuring the product stays the same.
             // We use the specified userImageIndex if provided by the model (as a base), or default to the first image.
             const baseImageIndex = (item.userImageIndex !== undefined && images[item.userImageIndex]) ? item.userImageIndex : 0;
             const baseImage = images[baseImageIndex];
             
             // Append specific instructions to ensure product preservation
             const strictPrompt = `${item.generationPrompt}. Maintain the main object in the image exactly as it is. Do not transform or replace the product. High quality, photorealistic, cinematic lighting.`;
             
             finalImage = await generateAiImage(ai, strictPrompt, baseImage);
          }

          // Fallback
          if (!finalImage && images.length > 0) {
             // For Box contents, if we failed to generate, maybe it's better to show a generic icon? 
             // But user asked for product images. Let's fallback to main product if it's a feature, 
             // or null if it's a generic box item to show icon.
             if (item.text === undefined) { // It is a feature/reason
                finalImage = images[i % images.length];
             }
          }

          return {
            id: `item-${Date.now()}-${i}`,
            title: item.title,
            description: item.description,
            text: item.text,
            count: item.count || '1x',
            image: finalImage
          };
        }));
      };

      const finalFeatures = await processListWithImages(generatedData.features || []);
      const finalReasons = await processListWithImages(generatedData.reasons || []);
      const finalBoxContents = await processListWithImages(generatedData.boxContentsItems || []);

      const newConfig: ProductConfig = {
        ...DEFAULT_CONFIG,
        ...generatedData,
        image: images.length > 0 ? images[0] : null,
        features: finalFeatures,
        reasons: finalReasons,
        boxContentsItems: finalBoxContents,
        comparisonRows: (generatedData.comparisonRows || []).map((c: any, i: number) => ({
          id: `c-${Date.now()}-${i}`,
          featureName: c.featureName,
          productValue: c.productValue,
          competitorValue: c.competitorValue
        })),
        faqs: (generatedData.faqs || []).map((q: any, i: number) => ({
          id: `q-${Date.now()}-${i}`,
          question: q.question,
          answer: q.answer
        })),
        buyNowFooterFeatures: generatedData.buyNowFooterFeatures || DEFAULT_CONFIG.buyNowFooterFeatures
      };

      onComplete(newConfig);

    } catch (error) {
      console.error("Error generating content:", error);
      alert("حدث خطأ أثناء المعالجة. يرجى التأكد من المفتاح ومحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-4">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-[#0c2c3e] rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-bold text-[#0c2c3e] mb-2 text-center animate-pulse">جاري العمل بالسحر...</h2>
        <p className="text-gray-500 text-xl">{loadingStep}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0c2c3e] p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h2 className="text-4xl font-black mb-2 relative z-10">مساعد التصميم الذكي</h2>
          <p className="text-blue-200 text-lg relative z-10">أدخل معلومات منتجك ودع الذكاء الاصطناعي يبني لك الصفحات بالكامل</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8" dir="rtl">
          
          {/* Step 1: Info */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-xl font-bold text-slate-800 mb-2 block">1. ما هو اسم المنتج؟</span>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full text-lg px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0c2c3e] transition-colors"
                placeholder="مثال: سماعة رأس بلوتوث عازلة للضوضاء"
              />
            </label>

            <label className="block">
              <span className="text-xl font-bold text-slate-800 mb-2 block">2. أخبرنا عن التفاصيل والمميزات (كل ما لديك)</span>
              <textarea
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
                rows={5}
                className="w-full text-lg px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0c2c3e] transition-colors"
                placeholder="الصق هنا أي معلومات عن المنتج، مواصفات، مميزات، نقاط القوة، محتويات العلبة... لا تقلق بشأن الترتيب."
              />
            </label>
          </div>

          <hr className="border-gray-100" />

          {/* Step 2: Images */}
          <div>
            <span className="text-xl font-bold text-slate-800 mb-4 block">3. ارفع صور المنتج (للتوزيع الذكي)</span>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={img} alt={`uploaded-${idx}`} className="w-full h-full object-contain" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                  <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                     Img {idx}
                  </div>
                </div>
              ))}
              
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0c2c3e] hover:bg-blue-50 transition-all flex flex-col items-center justify-center text-gray-400 hover:text-[#0c2c3e]">
                <UploadIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-bold">إضافة صور</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <p className="text-sm text-gray-500">
               * سيتم استخدام هذه الصور كأساس لجميع التصاميم للحفاظ على شكل المنتج بدقة تامة.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center" dir="rtl">
          <button 
            onClick={onCancel}
            className="text-gray-500 font-bold hover:text-gray-800 px-6 py-3 transition-colors"
          >
            تخطي واستخدام المحرر اليدوي
          </button>
          
          <button 
            onClick={generateContent}
            disabled={!productName || !productDetails}
            className="bg-[#0c2c3e] text-white text-xl font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-[#153e55] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/></svg>
             <span>بدء المعالجة الذكية</span>
          </button>
        </div>

      </div>
    </div>
  );
};
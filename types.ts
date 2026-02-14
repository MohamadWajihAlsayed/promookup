
export interface Feature {
  id: string;
  title: string;
  description: string;
  image: string | null;
}

export interface ComparisonRow {
  id: string;
  featureName: string;
  productValue: string;
  competitorValue: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BoxContentItem {
  id: string;
  text: string;
  count: string;
  image: string | null;
}

export interface ProductConfig {
  // Main Page Config
  headline: string;
  description: string;
  ctaText: string;
  image: string | null;
  soldCount: string;
  rating: string;
  ratingCount: string;
  stockText: string;

  // Features Page Config
  featuresTitle: string;
  featuresSubtitle: string;
  features: Feature[];

  // Why Choose Page Config
  whyChooseTitle: string;
  whyChooseSubtitle: string;
  reasons: Feature[];

  // Comparison Page Config
  comparisonTitle: string;
  comparisonSubtitle: string;
  comparisonProductName: string;
  comparisonCompetitorName: string;
  comparisonRows: ComparisonRow[];

  // FAQ Page Config
  faqTitle: string;
  faqSubtitle: string;
  faqs: FaqItem[];

  // Box Contents Page Config
  boxContentsTitle: string;
  boxContentsItems: BoxContentItem[];

  // Buy Now Page Config
  buyNowHeadline: string;
  buyNowSubHeadline: string;
  buyNowCtaText: string;
  buyNowFooterFeatures: string[];
}

export const DEFAULT_CONFIG: ProductConfig = {
  headline: "تابلت Telzeal P600 للأطفال",
  description: "تابلت Telzeal P600 مصمم ليجمع بين التعلم والمتعة في جهاز واحد يناسب الأطفال. شاشة 7 بوصة HD تمنح صورة واضحة. يعمل بنظام Android لسهولة الاستخدام.",
  ctaText: "تعلّم مرح وآمن",
  image: null,
  soldCount: "+40K",
  rating: "5.0",
  ratingCount: "55 تقييم",
  stockText: "7 المخزون المتبقي",
  
  featuresTitle: "أبرز مميزات المنتج",
  featuresSubtitle: "تقنية متطورة لراحة طفلك",
  features: [
    {
      id: '1',
      title: "شاشة حماية للعين",
      description: "تتميز الشاشة بتقنية *حماية العين* من الأشعة الزرقاء، مما يضمن *تجربة مشاهدة آمنة* لطفلك حتى عند الاستخدام لفترات طويلة.",
      image: null
    },
    {
      id: '2',
      title: "نظام رقابة أبوية",
      description: "يتيح لك *التحكم الكامل* في المحتوى الذي يشاهده طفلك، مع إمكانية *تحديد وقت الاستخدام* اليومي لضمان توازن صحي.",
      image: null
    }
  ],

  whyChooseTitle: "لماذا تختارين هذه الساعة؟",
  whyChooseSubtitle: "ثلاثة أسباب تجعل هذه الساعة خيارك الأفضل",
  reasons: [
    {
      id: 'r1',
      title: "أمان رقمي وتحكم أبوي مطمئن",
      description: "ميزات التحكم الأبوي تساعدك على تحديد وقت الشاشة، وإدارة التطبيقات المسموح بها، وتقليل الوصول لمحتوى غير مناسب.",
      image: null
    },
    {
      id: 'r2',
      title: "حماية وتحمل للاستخدام اليومي",
      description: "التابلت مصمم للأطفال بجراب مقاوم للصدمات وحواف ناعمة تقلل أثر السقوط والخبطات اليومية.",
      image: null
    },
    {
      id: 'r3',
      title: "أداء وسلاسة تناسب الطفل",
      description: "يأتي بذاكرة RAM قوية وتخزين مناسب لتشغيل التطبيقات التعليمية والترفيهية بسلاسة وتقليل التهنيج.",
      image: null
    }
  ],

  comparisonTitle: "لماذا هي الأفضل لك ؟",
  comparisonSubtitle: "Telzeal P600 مقابل تابلت أطفال منافس 7 بوصة",
  comparisonProductName: "Telzeal P600",
  comparisonCompetitorName: "تابلت أطفال منافس",
  comparisonRows: [
    {
      id: 'c1',
      featureName: "الشاشة",
      productValue: "7 بوصة HD + تقليل إجهاد العين",
      competitorValue: "7 بوصة HD (بدون ذكر حماية عين غالباً)"
    },
    {
      id: 'c2',
      featureName: "النظام",
      productValue: "Android 10.1",
      competitorValue: "إصدار أقدم أو واجهة مخصصة محدودة"
    },
    {
      id: 'c3',
      featureName: "الذاكرة RAM",
      productValue: "6GB",
      competitorValue: "غالباً 2GB-4GB"
    },
    {
      id: 'c4',
      featureName: "التخزين",
      productValue: "128GB",
      competitorValue: "غالباً 32GB-64GB"
    }
  ],

  faqTitle: "الأسئلة الشائعة",
  faqSubtitle: "كل ماتريد معرفته عن التابلت",
  faqs: [
    {
      id: 'q1',
      question: "هل الجهاز مناسب لأي عمر؟",
      answer: "مناسب غالباً للأطفال في مرحلة الروضة والابتدائية، ويُفضّل ضبطه حسب عمر الطفل عبر التحكم الأبوي."
    },
    {
      id: 'q2',
      question: "هل يدعم تحميل تطبيقات جديدة؟",
      answer: "نعم، لأنه يعمل بنظام Android ويمكن تنزيل تطبيقات تعليمية وترفيهية."
    },
    {
      id: 'q3',
      question: "هل يتحمل السقوط؟",
      answer: "الجراب المصمم للصدمات يساعد كثيراً، لكن يبقى السقوط القاسي ممكن يسبب ضرراً مثل أي جهاز."
    },
    {
      id: 'q4',
      question: "هل الشاشة مناسبة للعين؟",
      answer: "مذكور وجود تقنية حماية/تقليل إجهاد العين، ومع ذلك يُنصح بفترات راحة منتظمة."
    },
    {
      id: 'q5',
      question: "هل الكاميرا جيدة؟",
      answer: "مناسبة لاحتياجات الأطفال الأساسية مثل صور بسيطة ومكالمات فيديو خفيفة."
    }
  ],

  boxContentsTitle: "محتويات البكج",
  boxContentsItems: [
    {
      id: 'b1',
      text: "تابلت Telzeal P600",
      count: "1x",
      image: null
    },
    {
      id: 'b2',
      text: "كابل شحن",
      count: "1x",
      image: null
    },
    {
      id: 'b3',
      text: "دليل استخدام",
      count: "1x",
      image: null
    }
  ],

  buyNowHeadline: "احصل الان على تابلت Telzeal P600",
  buyNowSubHeadline: "بسعر خاص لفترة محدودة!",
  buyNowCtaText: "اطلبيه الان",
  buyNowFooterFeatures: ["توصيل مجاني", "ضمان لمدة عامين", "ضمان الاسترجاع والاستبدال"]
};

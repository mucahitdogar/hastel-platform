'use client';

import { useState } from 'react';

const BASE_PRICE_USD = 30.0;
const EUR_USD_RATE = 1.08;
const VAT_RATE = 0.2;

interface LocaleData {
  lang: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  currency: string;
  hero: string;
  sub: string;
  recommendedMaterial: string;
  productTitle: string;
  productDesc: string;
  ctaText: string;
  calcHeader: string;
  calcWidth: string;
  calcHeight: string;
  calcResult: string;
  vatInfo: string;
}

const LOCALE_DATA: Record<string, LocaleData> = {
  Turkey: {
    lang: 'Turkish',
    flag: '🇹🇷',
    dir: 'ltr',
    currency: '₺',
    hero: 'Endüstriyel Güvenlikte HASTEL Standartı',
    sub: 'Yüksek mukavemetli, uzun ömürlü sınır ve çevre güvenlik sistemleri.',
    recommendedMaterial:
      'Tavsiye Edilen: Sıcak Daldırma Galvaniz + RAL 6005 Yeşil Elektrostatik Boya',
    productTitle: 'HASTEL Panel Çit Sistemi',
    productDesc:
      '2.5m x 1.5m standart ölçülerde, UV dayanımlı ve paslanmaz çelik bağlantılı profesyonel set.',
    ctaText: 'WhatsApp ile Hemen Teklif Al',
    calcHeader: 'Anlık Proje Maliyet Hesaplayıcı',
    calcWidth: 'Genişlik (Metre)',
    calcHeight: 'Yükseklik (Metre)',
    calcResult: 'Tahmini Proje Bedeli',
    vatInfo: '+ %20 KDV Dahil',
  },
  'France/North Africa': {
    lang: 'French',
    flag: '🇫🇷',
    dir: 'ltr',
    currency: '€',
    hero: 'Excellence en Clôture Industrielle par HASTEL',
    sub: 'Solutions de haute sécurité conformes aux normes européennes les plus strictes.',
    recommendedMaterial:
      'Recommandé : Revêtement Galfan anti-corrosion pour zones côtières/humides',
    productTitle: 'Système de Panneaux Rigides HASTEL',
    productDesc:
      'Kit 2.5m x 1.5m, haute résistance mécanique, traitement anti-UV longue durée.',
    ctaText: 'Obtenir un Devis Rapide (WhatsApp)',
    calcHeader: 'Calculateur de Projet Instantané',
    calcWidth: 'Largeur (Mètres)',
    calcHeight: 'Hauteur (Mètres)',
    calcResult: 'Coût Estimé du Projet',
    vatInfo: 'TVA incluse',
  },
  'Germany/Europe': {
    lang: 'German',
    flag: '🇩🇪',
    dir: 'ltr',
    currency: '€',
    hero: 'HASTEL Industrielle Zaunsysteme',
    sub: 'Zertifizierte Sicherheit und Langlebigkeit für gewerbliche Projekte.',
    recommendedMaterial:
      'Empfohlen: Doppelstabmatte (Double Panel) RAL 7016 Anthrazit',
    productTitle: 'HASTEL Gittermattenzaun Komplex',
    productDesc:
      '2.5m x 1.5m, pulverbeschichtet nach RAL-Standards, maximale Stabilität.',
    ctaText: 'Angebot per WhatsApp Anfordern',
    calcHeader: 'Sofortiger Projektkalkulator',
    calcWidth: 'Breite (Meter)',
    calcHeight: 'Höhe (Meter)',
    calcResult: 'Geschätzte Gesamtkosten',
    vatInfo: 'inkl. MwSt.',
  },
  'Middle East': {
    lang: 'Arabic',
    flag: '🇦🇪',
    dir: 'rtl',
    currency: '$',
    hero: 'أنظمة حماية الحدود المتطورة من HASTEL',
    sub: 'حلول أمنية صناعية مصممة خصيصاً لمقاومة الظروف المناخية القاسية.',
    recommendedMaterial:
      'الموصى به: طلاء حراري مقاوم درجات الحرارة العالية مع أسلاك شائكة',
    productTitle: 'نظام السياج المعدني الصناعي HASTEL',
    productDesc: 'قياس ٢.٥م × ١.٥م، طلاء مضاد للأشعة فوق البنفسجية والأكسدة.',
    ctaText: 'احصل على عرض السعر عبر الواتساب',
    calcHeader: 'حاسبة تكلفة المشروع الفورية',
    calcWidth: 'العرض (متر)',
    calcHeight: 'الارتفاع (متر)',
    calcResult: 'تكلفة المشروع التقديرية',
    vatInfo: 'شامل رسوم التصدير',
  },
};

export default function Home() {
  const [vpnLocation, setVpnLocation] = useState('Germany/Europe');
  const [exchangeRate] = useState(46.4);
  const [width, setWidth] = useState(25);
  const [height, setHeight] = useState(2.0);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const locale = LOCALE_DATA[vpnLocation] || LOCALE_DATA['Germany/Europe'];

  const totalSqm = width * height;
  let pricePerSqm = BASE_PRICE_USD;
  let totalCost = 0;
  let priceDisplay = '';

  if (vpnLocation === 'Turkey') {
    pricePerSqm = BASE_PRICE_USD * exchangeRate * (1 + VAT_RATE);
    totalCost = totalSqm * pricePerSqm;
    priceDisplay = `${totalCost.toLocaleString('tr-TR', {
      maximumFractionDigits: 0,
    })} ${locale.currency}`;
  } else if (
    vpnLocation === 'Germany/Europe' ||
    vpnLocation === 'France/North Africa'
  ) {
    pricePerSqm = BASE_PRICE_USD / EUR_USD_RATE;
    totalCost = totalSqm * pricePerSqm;
    priceDisplay = `${totalCost.toLocaleString('de-DE', {
      maximumFractionDigits: 0,
    })} ${locale.currency}`;
  } else {
    pricePerSqm = BASE_PRICE_USD;
    totalCost = totalSqm * pricePerSqm;
    priceDisplay = `${locale.currency}${totalCost.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <header className="bg-slate-900 border-b border-slate-800 py-3 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-black tracking-wider text-emerald-400 text-sm">
            HASTEL®
          </span>
          <span className="text-slate-400">
            İhracat Odaklı Akıllı Platform v3.0
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">🌎 Bölgesel AI Simülatörü:</span>
          <select
            value={vpnLocation}
            onChange={(e) => setVpnLocation(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="Turkey">Türkiye (TR) 🇹🇷</option>
            <option value="Germany/Europe">Almanya / Avrupa (DE/EU) 🇩🇪</option>
            <option value="France/North Africa">
              Fransa / Kuzey Afrika (FR) 🇫🇷
            </option>
            <option value="Middle East">Ortadoğu / Körfez (MENA) 🇦🇪</option>
          </select>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full px-6 py-12 flex flex-col items-center">
        <div dir={locale.dir} className="text-center max-w-2xl mb-12">
          <span className="inline-block bg-emerald-950 text-emerald-400 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-emerald-800/50 mb-4">
            {locale.recommendedMaterial}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-50 tracking-tight leading-tight">
            {locale.hero}
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-4">
            {locale.sub}
          </p>
        </div>

        <div
          dir={locale.dir}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
                B2B Standart Ürün
              </span>
              <h2 className="text-2xl font-black text-slate-100 mt-2">
                {locale.productTitle}
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                {locale.productDesc}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>
                  {showTechnicalDetails
                    ? '▲ Teknik Detayları Gizle'
                    : '▼ Mühendislik ve Kalite Argümanları (Tıklayın)'}
                </span>
              </button>

              {showTechnicalDetails && (
                <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p>
                    • <strong>Kaplama Kalınlığı:</strong> Min. 80 mikron
                    elektrostatik toz boya.
                  </p>
                  <p>
                    • <strong>Mukavemet Testi:</strong> ISO 9001 ve TSE EN 10223
                    standartlarına tam uyum.
                  </p>
                  <p>
                    • <strong>Rüzgar Dayanımı:</strong> 120 km/saat rüzgar yükü
                    test raporu mevcut.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-6">
                <span>📊</span> {locale.calcHeader}
              </h3>

              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>{locale.calcWidth}</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {width} m
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>{locale.calcHeight}</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {height} m
                  </span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.5"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-900 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    {locale.calcResult} ({totalSqm} m²)
                  </span>
                  <span className="text-2xl md:text-3xl font-black font-mono text-emerald-400 mt-1 block">
                    {priceDisplay}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono text-right">
                  {locale.vatInfo}
                </span>
              </div>

              <button
                type="button"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <span>{locale.ctaText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        © 2026 HASTEL A.Ş. Tüm hakları saklıdır. Minimalist ve Güvenli B2B Dış
        Ticaret Altyapısı.
      </footer>
    </main>
  );
}
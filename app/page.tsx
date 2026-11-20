'use client';

import { useState } from 'react';
import {
  PRODUCTS_CATALOG,
  ALL_HT_IMAGES,
  type ProductItem,
  type ProductOption,
} from '../data/catalog';

const WHATSAPP_NUMBER = '905366299127';
const DISPLAY_PHONE_NUMBER = '+90 (536) 629 91 27';
const BASE_PRICE_USD = 30.0;
const EUR_USD_RATE = 1.08;
const VAT_RATE = 0.2;

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  showDirectContact?: boolean;
}

const LOCALE_DATA: Record<
  string,
  {
    dir: 'ltr' | 'rtl';
    currency: string;
    hero: string;
    sub: string;
    recommendedMaterial: string;
    ctaText: string;
    calcHeader: string;
    calcWidth: string;
    calcHeight: string;
    calcResult: string;
    vatInfo: string;
  }
> = {
  Turkey: {
    dir: 'ltr',
    currency: '₺',
    hero: 'Endüstriyel Güvenlikte HASTEL Standartı',
    sub: 'Yüksek mukavemetli, uzun ömürlü sınır, çevre güvenlik ve saha sistemleri.',
    recommendedMaterial:
      'Tavsiye Edilen: Sıcak Daldırma Galvaniz + RAL 6005 Yeşil Elektrostatik Boya',
    ctaText: 'WhatsApp ile Hemen Teklif Al',
    calcHeader: 'Anlık Proje Maliyet Hesaplayıcı',
    calcWidth: 'Genişlik (Metre)',
    calcHeight: 'Yükseklik (Metre)',
    calcResult: 'Tahmini Proje Bedeli',
    vatInfo: '+ %20 KDV Dahil',
  },
  'France/North Africa': {
    dir: 'ltr',
    currency: '€',
    hero: 'Excellence en Clôture Industrielle par HASTEL',
    sub: 'Solutions de haute sécurité conformes aux normes européennes.',
    recommendedMaterial:
      'Recommandé : Revêtement Galfan anti-corrosion',
    ctaText: 'Obtenir un Devis Rapide (WhatsApp)',
    calcHeader: 'Calculateur de Projet Instantané',
    calcWidth: 'Largeur (Mètres)',
    calcHeight: 'Hauteur (Mètres)',
    calcResult: 'Coût Estimé du Projet',
    vatInfo: 'TVA incluse',
  },
  'Germany/Europe': {
    dir: 'ltr',
    currency: '€',
    hero: 'HASTEL Industrielle Zaunsysteme',
    sub: 'Zertifizierte Sicherheit und Langlebigkeit für gewerbliche Projekte.',
    recommendedMaterial: 'Empfohlen: Doppelstabmatte RAL 7016 Anthrazit',
    ctaText: 'Angebot per WhatsApp Anfordern',
    calcHeader: 'Sofortiger Projektkalkulator',
    calcWidth: 'Breite (Meter)',
    calcHeight: 'Höhe (Meter)',
    calcResult: 'Geschätzte Gesamtkosten',
    vatInfo: 'inkl. MwSt.',
  },
  'Middle East': {
    dir: 'rtl',
    currency: '$',
    hero: 'HASTEL Endüstriyel Güvenlik Sistemleri',
    sub: 'Zorlu iklim şartları için yüksek dayanıklı çevre güvenliği.',
    recommendedMaterial:
      'Önerilen: Yüksek Sıcaklık Dayanıklı Kaplama ve Güvenlik Teli',
    ctaText: 'WhatsApp ile Teklif Al',
    calcHeader: 'Anlık Proje Maliyet Hesaplayıcı',
    calcWidth: 'Genişlik (Metre)',
    calcHeight: 'Yükseklik (Metre)',
    calcResult: 'Tahmini Proje Bedeli',
    vatInfo: 'İhracat Dahil',
  },
};

type RibbonTab = 'usage' | 'specs' | 'options';

export default function Home() {
  const [vpnLocation, setVpnLocation] = useState('Germany/Europe');
  const [exchangeRate] = useState(46.4);
  const [width, setWidth] = useState(25);
  const [height, setHeight] = useState(2.0);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(
    PRODUCTS_CATALOG[0]
  );
  const [activeTab, setActiveTab] = useState<RibbonTab>('usage');
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState<string>(
    PRODUCTS_CATALOG[0].featuredImages[0] || ALL_HT_IMAGES[0]
  );
  const [optionRequestOpen, setOptionRequestOpen] = useState(false);
  const [optionNote, setOptionNote] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const [assistantOpen, setAssistantOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Merhaba, HASTEL AI Teklif Asistanı aktif. WhatsApp girişi yapmadan buradan ölçü, kaplama/opsiyon veya ihracat hakkında yazabilir; isterseniz doğrudan satış hattımıza geçebilirsiniz.',
      showDirectContact: true,
    },
  ]);

  const locale = LOCALE_DATA[vpnLocation] || LOCALE_DATA['Germany/Europe'];

  const handleSelectProduct = (
    product: ProductItem,
    tab: RibbonTab = 'usage'
  ) => {
    setSelectedProduct(product);
    setActiveTab(tab);
    setActiveImage(product.featuredImages[0] || ALL_HT_IMAGES[0]);
    setRequestSent(false);
    if (tab === 'options') setOptionRequestOpen(true);
  };

  const toggleOption = (optionId: string) => {
    setRequestSent(false);
    setSelectedOptionIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const selectedOptions: ProductOption[] = selectedProduct.options.filter(
    (opt) => selectedOptionIds.includes(opt.id)
  );

  const optionMultiplier = selectedOptions.reduce(
    (acc, opt) => acc * (opt.multiplierOrAdd > 0 ? opt.multiplierOrAdd : 1),
    1
  );

  const totalSqm = width * height;
  let totalCost = 0;
  if (vpnLocation === 'Turkey') {
    totalCost =
      totalSqm *
      BASE_PRICE_USD *
      exchangeRate *
      (1 + VAT_RATE) *
      optionMultiplier;
  } else if (
    vpnLocation === 'Germany/Europe' ||
    vpnLocation === 'France/North Africa'
  ) {
    totalCost =
      totalSqm * (BASE_PRICE_USD / EUR_USD_RATE) * optionMultiplier;
  } else {
    totalCost = totalSqm * BASE_PRICE_USD * optionMultiplier;
  }

  const priceDisplay = `${Math.round(totalCost).toLocaleString('tr-TR')} ${locale.currency}`;

  const buildWhatsAppUrl = (extraText = '') => {
    const optionLines =
      selectedOptions.length > 0
        ? selectedOptions.map((o) => `- ${o.label}`).join('\n')
        : '- Standart Konfigürasyon';

    const lines = [
      'Merhaba HASTEL Ekibi, proje teklifi / opsiyon talebi iletmek istiyorum:',
      `• Bölge: ${vpnLocation}`,
      `• Ürün: ${selectedProduct.title}`,
      `• Ölçüler: ${width} m x ${height} m (${totalSqm} m²)`,
      `• Tahmini Tutar: ${priceDisplay}`,
      '• Seçili Opsiyonlar:',
      optionLines,
    ];

    if (extraText.trim()) {
      lines.push(`• Not / Mesaj: ${extraText.trim()}`);
    }

    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  };

  const generateAssistantReply = (rawText: string): ChatMessage => {
    const q = rawText.toLowerCase();
    const optSummary =
      selectedOptions.length > 0
        ? selectedOptions.map((o) => o.label).join(', ')
        : 'standart konfigürasyon';

    if (
      q.includes('numara') ||
      q.includes('telefon') ||
      q.includes('iletişim') ||
      q.includes('iletisim') ||
      q.includes('ara') ||
      q.includes('whatsapp') ||
      q.includes('wp')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `${selectedProduct.title} (${width}m x ${height}m, ${totalSqm} m², tahmini ${priceDisplay}) için doğrudan satış/teklif iletişim hattımız aşağıdadır. Dilerseniz numarayı kopyalayabilir veya WhatsApp üzerinden hazır özet gönderebilirsiniz.`,
        showDirectContact: true,
      };
    }

    if (
      q.includes('fiyat') ||
      q.includes('maliyet') ||
      q.includes('teklif') ||
      q.includes('ölçü') ||
      q.includes('olcu') ||
      q.includes('opsiyon')
    ) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `Şu an ${vpnLocation} bölgesi için "${selectedProduct.title}" seçili. ${width}m x ${height}m (${totalSqm} m²) ve ${optSummary} ile tahmini bedel ${priceDisplay} görünüyor. Kesin proje fiyatı ve özel opsiyon için doğrudan iletişim numaramızı kullanabilirsiniz.`,
        showDirectContact: true,
      };
    }

    return {
      id: `bot-${Date.now()}`,
      sender: 'assistant',
      text: `Mesajınızı aldım ("${rawText.trim()}"). ${selectedProduct.title} sisteminde ${width}m x ${height}m (${totalSqm} m²) için tahmini tutar ${priceDisplay}. Detaylı görüşme veya doğrudan numara bilgisi isterseniz satış hattımızı aşağıdan görebilirsiniz.`,
      showDirectContact: true,
    };
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: chatInput.trim(),
    };
    const replyMsg = generateAssistantReply(chatInput);
    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setChatInput('');
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(DISPLAY_PHONE_NUMBER);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    } catch {
      setCopiedPhone(false);
    }
  };

  const handleOptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    const noteText = optionNote.trim()
      ? `Opsiyon notu kaydedildi: "${optionNote.trim()}"`
      : `Opsiyon talebi (${selectedOptions.length} opsiyon) hazırlandı.`;
    setMessages((prev) => [
      ...prev,
      {
        id: `opt-${Date.now()}`,
        sender: 'assistant',
        text: `${noteText} İsterseniz doğrudan iletişim numaramız üzerinden bize ulaşabilir veya WhatsApp ile özet gönderebilirsiniz.`,
        showDirectContact: true,
      },
    ]);
    setAssistantOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <header className="bg-slate-900 border-b border-slate-800 py-3 px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-black tracking-wider text-emerald-400 text-sm">
            HASTEL
          </span>
          <span className="text-slate-400">
            İhracat Odaklı Akıllı Platform v3.1
          </span>
        </div>
        <select
          value={vpnLocation}
          onChange={(e) => setVpnLocation(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
        >
          <option value="Turkey">Türkiye (TR)</option>
          <option value="Germany/Europe">Almanya / Avrupa (DE/EU)</option>
          <option value="France/North Africa">
            Fransa / Kuzey Afrika (FR)
          </option>
          <option value="Middle East">Ortadoğu / Körfez (MENA)</option>
        </select>
      </header>

      <div className="max-w-6xl mx-auto w-full px-6 py-10 flex flex-col gap-10">
        <section dir={locale.dir} className="text-center max-w-3xl mx-auto">
          <span className="inline-block bg-emerald-950 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-800/50 mb-4">
            {locale.recommendedMaterial}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-50">
            {locale.hero}
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-3">
            {locale.sub}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
            Ürün Sistemleri ve Ribbon Hızlı Erişim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PRODUCTS_CATALOG.map((product) => {
              const isSelected = selectedProduct.id === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product, activeTab)}
                  className={`group rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 mb-4">
                      <img
                        src={product.featuredImages[0] || ALL_HT_IMAGES[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mt-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2">
                      {product.summary}
                    </p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-1.5 opacity-85 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(product, 'usage')}
                      className="flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 group-hover:border-emerald-500/50 cursor-pointer"
                    >
                      Kullanım
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(product, 'specs')}
                      className="flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold bg-slate-950 text-slate-300 border border-slate-800 group-hover:border-emerald-500/50 cursor-pointer"
                    >
                      Teknik
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(product, 'options')}
                      className="flex-1 py-2 px-2 rounded-lg text-[11px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-700/60 group-hover:bg-emerald-500 group-hover:text-slate-950 cursor-pointer"
                    >
                      Opsiyon İste
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-2xl font-black text-slate-100">
                {selectedProduct.title}
              </h2>
              <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('usage')}
                  className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                    activeTab === 'usage'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400'
                  }`}
                >
                  Kullanım Alanları
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                    activeTab === 'specs'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400'
                  }`}
                >
                  Teknik Özellikler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('options');
                    setOptionRequestOpen(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                    activeTab === 'options'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-400'
                  }`}
                >
                  Opsiyonlar
                </button>
              </div>
            </div>

            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
              <img
                src={activeImage}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {selectedProduct.featuredImages.map((imgSrc) => (
                <button
                  key={imgSrc}
                  type="button"
                  onClick={() => setActiveImage(imgSrc)}
                  className={`w-16 h-12 shrink-0 rounded-lg overflow-hidden border cursor-pointer ${
                    activeImage === imgSrc
                      ? 'border-emerald-400'
                      : 'border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {activeTab === 'usage' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-2">
                {selectedProduct.usageAreas.map((area) => (
                  <span
                    key={area}
                    className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-300">
                {selectedProduct.specs.map((spec) => (
                  <p key={spec}>{spec}</p>
                ))}
              </div>
            )}

            {activeTab === 'options' && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                {selectedProduct.options.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedOptionIds.includes(opt.id)}
                        onChange={() => toggleOption(opt.id)}
                        className="accent-emerald-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-100">
                          {opt.label}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {opt.note}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      x{opt.multiplierOrAdd.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-5">
                {locale.calcHeader}
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
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
              <div className="mb-5">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
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
              <div className="pt-4 border-t border-slate-900 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">
                    {locale.calcResult} ({totalSqm} m²)
                  </span>
                  <span className="text-2xl md:text-3xl font-black font-mono text-emerald-400 mt-1 block">
                    {priceDisplay}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {locale.vatInfo}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setAssistantOpen(true);
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `cta-${Date.now()}`,
                      sender: 'assistant',
                      text: `WhatsApp girişine takılmadan buradan devam edebilirsiniz. Doğrudan iletişim hattımız: ${DISPLAY_PHONE_NUMBER}. Dilerseniz aşağıdan doğrudan arayabilir, numarayı kopyalayabilir veya WhatsApp penceresini açabilirsiniz.`,
                      showDirectContact: true,
                    },
                  ]);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 px-5 rounded-xl cursor-pointer text-sm"
              >
                {locale.ctaText}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOptionRequestOpen(!optionRequestOpen);
                  setRequestSent(false);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-700/60 font-semibold py-2.5 px-5 rounded-xl cursor-pointer text-xs"
              >
                {optionRequestOpen
                  ? 'Opsiyon Talebi Formunu Kapat'
                  : 'Özel Opsiyon İste / Not Bırak'}
              </button>

              {optionRequestOpen && (
                <form
                  onSubmit={handleOptionSubmit}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs"
                >
                  <textarea
                    rows={2}
                    value={optionNote}
                    onChange={(e) => setOptionNote(e.target.value)}
                    placeholder="Özel ölçü, kapı veya kaplama notunuz..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg cursor-pointer"
                  >
                    Opsiyon Talebini Hazırla
                  </button>
                  {requestSent && (
                    <div className="space-y-2">
                      <p className="text-emerald-400 font-medium">
                        Opsiyon talebiniz ({selectedOptions.length} seçili
                        opsiyon) hazırlandı. Doğrudan hat: {DISPLAY_PHONE_NUMBER}
                      </p>
                      <a
                        href={buildWhatsAppUrl(optionNote)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-lg"
                      >
                        İsteğe Bağlı WhatsApp&apos;ta Aç
                      </a>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Giriş Gerektirmeyen AI Asistan & Doğrudan İletişim Kutusu */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase text-emerald-400">
                Giriş Gerektirmez • Anlık Yanıt + İletişim Yönlendirme
              </span>
              <h2 className="text-lg font-bold text-slate-100">
                HASTEL AI Asistan &amp; Doğrudan İletişim
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setAssistantOpen(!assistantOpen)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer"
            >
              {assistantOpen ? 'Asistanı Gizle' : 'Asistanı Aç'}
            </button>
          </div>

          {assistantOpen && (
            <div className="space-y-4">
              <div className="max-h-64 overflow-y-auto space-y-2.5 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-xl p-3 space-y-2 ${
                      m.sender === 'assistant'
                        ? 'bg-slate-900 border border-slate-800 text-slate-200'
                        : 'bg-emerald-950/40 border border-emerald-700/40 text-emerald-100 ml-auto max-w-md'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                    {m.showDirectContact && (
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <span className="font-mono text-emerald-400 font-bold">
                          Doğrudan Hat: {DISPLAY_PHONE_NUMBER}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={handleCopyPhone}
                            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold cursor-pointer"
                          >
                            {copiedPhone ? 'Numara Kopyalandı' : 'Numarayı Kopyala'}
                          </button>
                          <a
                            href={`tel:${WHATSAPP_NUMBER}`}
                            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold"
                          >
                            Ara
                          </a>
                          <a
                            href={buildWhatsAppUrl(chatInput)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                          >
                            WhatsApp&apos;a Aktar
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleChatSend} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Örn: 100m panel çit için doğrudan iletişim numarası ve fiyat bilgisi alabilir miyim?"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Gönder
                </button>
              </form>
            </div>
          )}
        </section>
      </div>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        HASTEL B2B İhracat Altyapısı • İletişim: {DISPLAY_PHONE_NUMBER}
      </footer>
    </main>
  );
}
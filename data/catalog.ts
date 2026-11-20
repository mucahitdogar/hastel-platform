export interface ProductOption {
  id: string;
  label: string;
  multiplierOrAdd: number;
  note: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  usageAreas: string[];
  specs: string[];
  featuredImages: string[];
  options: ProductOption[];
}

export const ALL_HT_IMAGES: string[] = Array.from({ length: 52 }, (_, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  return `/images/ht/ht${num}.jpg`;
});

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'panel-cit',
    title: 'HASTEL Panel Cit Sistemi',
    category: 'Cevre Guvenligi',
    summary: '2.5m x 1.5m standart olculerde, UV dayanimi yuksek profesyonel panel cit sistemi.',
    usageAreas: ['Sanayi Tesisleri & OSB', 'Lojistik & Depolama Sahalari', 'Konut & Site Cevreleri'],
    specs: ['Kaplama Kalinligi: Min. 80 mikron elektrostatik toz boya.', 'Standart Uyumu: ISO 9001 ve TSE EN 10223.', 'Ruzgar Dayanimi: 120 km/saat test raporu.'],
    featuredImages: ALL_HT_IMAGES.slice(0, 12),
    options: [
      { id: 'galfan', label: 'Galfan Korozyon Kaplama', multiplierOrAdd: 1.15, note: 'Nemli ve kiyi bolgeleri icin' },
      { id: 'barbed', label: 'Jiletli / Dikenli Tel Ust Hat', multiplierOrAdd: 1.2, note: 'Yuksek guvenlikli hatlar icin' }
    ]
  },
  {
    id: 'tel-cit-orgu',
    title: 'HASTEL Tel Cit & Rulo Sistemler',
    category: 'Genis Alan & Tarim',
    summary: 'Genis arazi, tarim, sera ve altyapi hatlari icin ekonomik ve esnek tel orgu cozumleri.',
    usageAreas: ['Tarim, Sera & Arazi Sinirlari', 'Altyapi & Enerji Hatlari', 'Buyuk Metrajli Saha Cevreleme'],
    specs: ['Goz araligi ve tel kalinligi sahaya gore ayarlanabilir.', 'Galvaniz ve PVC kaplama secenekleri.', 'Hizli montaj ve genis metraj avantaji.'],
    featuredImages: ALL_HT_IMAGES.slice(12, 32),
    options: [
      { id: 'heavy-wire', label: 'Kalin Tel & Sik Goz', multiplierOrAdd: 1.18, note: 'Daha yuksek darbe dayanimi' },
      { id: 'tension-kit', label: 'Gergi Teli & Aksesuar Seti', multiplierOrAdd: 1.08, note: 'Uzun hatlarda gerginlik destegi' }
    ]
  },
  {
    id: 'ozel-cozumler',
    title: 'Ozel Proje, Kapi & Saha Uygulamalari',
    category: 'Kurumsal & Ihracat',
    summary: 'Projeye ozel olcu, gecis kapisi, bariyer ve ihracat paketleme cozumleri.',
    usageAreas: ['Fabrika Giris & Guvenlik Noktalari', 'Kamu & Ozel Tesisler', 'Ihracat Proje Paketleri'],
    specs: ['Bolgesel sartnamelere uygun uretim.', 'Konteyner ve tir yuklemeye uygun paketleme.', 'Opsiyon bazli ozel teklif hazirligi.'],
    featuredImages: ALL_HT_IMAGES.slice(32, 52),
    options: [
      { id: 'gate', label: 'Gecis Kapisi Opsiyonu', multiplierOrAdd: 1.25, note: 'Saha hattina entegre gecis cozumu' },
      { id: 'export-pack', label: 'Ihracat Standart Paketleme', multiplierOrAdd: 1.12, note: 'Uzun yol sevkiyat korumasi' }
    ]
  }
];

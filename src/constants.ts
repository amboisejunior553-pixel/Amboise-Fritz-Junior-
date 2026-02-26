import { Service, OrderOption } from './types';

export const SERVICES: Service[] = [
  {
    id: 'logo',
    title: 'LOGO DESIGN',
    description: 'Créez une identité visuelle mémorable.',
    packages: [
      { id: 'logo-basic', name: 'Logo Basic', priceUSD: 30, priceHTG: 4000, features: ['1 Concept', 'Fichiers JPG/PNG', '2 Révisions'] },
      { id: 'logo-pro', name: 'Logo Pro', priceUSD: 80, priceHTG: 10500, features: ['3 Concepts', 'Fichiers Source', 'Révisions illimitées', 'Social Media Kit'] },
      { id: 'logo-premium', name: 'Logo Premium', priceUSD: 150, priceHTG: 20000, features: ['5 Concepts', 'Brand Guidelines', 'Stationery Design', 'Support Prioritaire'] },
    ]
  },
  {
    id: 'flyers',
    title: 'FLYERS & VISUELS',
    description: 'Des visuels percutants pour vos événements et réseaux sociaux.',
    packages: [
      { id: 'flyer-simple', name: 'Flyer Simple', priceUSD: 25, priceHTG: 3500, features: ['1 Design', 'Format Web', '2 Révisions'] },
      { id: 'flyer-premium', name: 'Flyer Premium', priceUSD: 60, priceHTG: 8000, features: ['Design Haute Qualité', 'Format Impression', 'Révisions illimitées'] },
      { id: 'social-pack', name: 'Pack 5 Visuels', priceUSD: 90, priceHTG: 12000, features: ['5 Designs Cohérents', 'Optimisé Réseaux Sociaux', 'Fichiers Source'] },
    ]
  },
  {
    id: 'branding',
    title: 'BRANDING COMPLET',
    description: 'Une image de marque professionnelle de A à Z.',
    packages: [
      { id: 'branding-starter', name: 'Branding Starter', priceUSD: 180, priceHTG: 24000, features: ['Logo Pro', 'Palette Couleurs', 'Typographie'] },
      { id: 'branding-business', name: 'Branding Business', priceUSD: 350, priceHTG: 47000, features: ['Logo Premium', 'Brand Book', 'Stationery', 'Social Media Kit'] },
      { id: 'branding-elite', name: 'Branding Elite', priceUSD: 600, priceHTG: 80000, features: ['Branding Complet', 'Stratégie de Marque', 'Site Web Vitrine', 'Accompagnement 1 mois'] },
    ]
  },
  {
    id: 'video',
    title: 'MONTAGE VIDÉO',
    description: 'Donnez vie à vos idées avec des vidéos professionnelles.',
    packages: [
      { id: 'video-simple', name: 'Montage Simple', priceUSD: 40, priceHTG: 5500, features: ['Coupe & Assemblage', 'Musique Libre de Droit', 'Max 1 min'] },
      { id: 'video-ads', name: 'Vidéo Publicitaire', priceUSD: 120, priceHTG: 16000, features: ['Motion Graphics', 'Voice Over', 'Optimisé Ads'] },
      { id: 'video-premium', name: 'Vidéo Premium', priceUSD: 250, priceHTG: 33000, features: ['Production Haute Qualité', 'Storytelling', 'Effets Spéciaux'] },
    ]
  }
];

export const UPSELLS: OrderOption[] = [
  { id: 'express', name: 'Livraison Express', priceUSD: 20, priceHTG: 2600 },
  { id: 'unlimited', name: 'Révisions Illimitées', priceUSD: 15, priceHTG: 2000 },
  { id: 'source', name: 'Fichiers Source', priceUSD: 25, priceHTG: 3300 },
  { id: 'social', name: 'Pack Réseaux Sociaux', priceUSD: 40, priceHTG: 5300 },
  { id: 'logo-animated', name: 'Logo Animé', priceUSD: 50, priceHTG: 6500 },
];

export const TRANSLATIONS = {
  fr: {
    hero_title: "Passez au NEXT LEVEL avec une image de marque qui vend pour vous.",
    hero_subtitle: "Des designs premium qui font paraître votre business plus grand, plus sérieux et plus rentable.",
    cta_order: "COMMANDER MAINTENANT",
    step_1: "Choix du service",
    step_2: "Options & Upsells",
    step_3: "Brief Client",
    step_4: "Paiement",
    step_5: "Confirmation",
    payment_local: "Paiement Local (Haïti)",
    payment_intl: "Paiement International",
    moncash: "MonCash",
    natcash: "NatCash",
    transaction_id: "ID Transaction",
    upload_proof: "Preuve de paiement",
    submit_order: "Valider la commande",
  },
  en: {
    hero_title: "Go to the NEXT LEVEL with a brand image that sells for you.",
    hero_subtitle: "Premium designs that make your business look bigger, more serious, and more profitable.",
    cta_order: "ORDER NOW",
    step_1: "Choose Service",
    step_2: "Options & Upsells",
    step_3: "Client Brief",
    step_4: "Payment",
    step_5: "Confirmation",
    payment_local: "Local Payment (Haiti)",
    payment_intl: "International Payment",
    moncash: "MonCash",
    natcash: "NatCash",
    transaction_id: "Transaction ID",
    upload_proof: "Payment Proof",
    submit_order: "Submit Order",
  },
  ht: {
    hero_title: "Pase nan NEXT LEVEL ak yon imaj mak k ap vann pou ou.",
    hero_subtitle: "Design premium ki fè biznis ou parèt pi gwo, pi serye ak pi pwofitab.",
    cta_order: "KÒMANDE KOUNYE A",
    step_1: "Chwazi sèvis",
    step_2: "Opsyon & Upsells",
    step_3: "Brief Kliyan",
    step_4: "Peman",
    step_5: "Konfimasyon",
    payment_local: "Peman Lokal (Ayiti)",
    payment_intl: "Peman Entènasyonal",
    moncash: "MonCash",
    natcash: "NatCash",
    transaction_id: "ID Tranzaksyon",
    upload_proof: "Prèv peman",
    submit_order: "Konfime kòmand lan",
  }
};

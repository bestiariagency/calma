import { whatsappUrl } from '../lib/contact.js'

// Fuente única de contacto e identidad. WHATSAPP_URL y los enlaces tel:/mailto: se derivan de aquí.
export const COMPANY = {
  name:             'CALMA',
  tagline:          'TINAJAS DE CONCRETO ARTESANAL',
  logo:             { src: '/images/logos/logo-blanco-calma.svg', alt: 'CALMA' },
  email:            'info@calma.es', // provisional (dummy)
  phone:            '+56 9 2253 8166',
  whatsapp:         '+56922538166',
  whatsapp_message: 'Hola, me interesa una tinaja CALMA',
  // Bloque de contacto del footer: solo se pinta lo que tenga dato (editables desde el panel)
  address:          '',
  city:             '',
  region:           '',
  maps_url:         '',
  opening_hours:    '',
  social: { instagram: '', facebook: '', tiktok: '', youtube: '' },
}

export const WHATSAPP_URL = whatsappUrl(COMPANY.whatsapp, COMPANY.whatsapp_message)

export const NAV_LINKS = [
  { label: 'Inicio',   href: '#inicio' },
  { label: 'Producto', href: '#producto' },
  { label: 'Galería',  href: '#galeria' },
  { label: 'Contacto', href: WHATSAPP_URL, cta: true },
]

export const MOBILE_MENU_LINKS = [
  { label: 'INICIO',             href: '#inicio' },
  { label: 'QUÉ ES',             href: '#producto' },
  { label: 'POR QUÉ HORMIGÓN',   href: '#por-que-hormigon' },
  { label: 'PROCESO',            href: '#proceso' },
  { label: 'GALERÍA',            href: '#galeria' },
  { label: 'HABLEMOS',           href: WHATSAPP_URL, accent: true },
]

export const HERO = {
  image: { src: '/images/hero-dia.webp', width: 1853, height: 1034, alt: 'Tinaja artesanal de hormigón en jardín' },
  tag: '— TINAJAS DE CONCRETO —',
  titleDesktop: 'Tinajas artesanales de hormigón',
  titleMobile:  'Tinajas\nartesanales\nde hormigón',
  subtitle:     'Diseñadas a mano. Pensadas para durar.',
  subtitleMobile: 'Diseñadas a mano.\nPensadas para durar.',
  cta: 'Consulta por tu tinaja',
}

export const QUE_ES = {
  image: { src: '/images/drones.webp', width: 1449, height: 1086, alt: 'Vista aérea de tinaja de hormigón' },
  label: 'QUÉ ES',
  title: 'Una tinaja es más que un baño',
  paragraphs: [
    'Nuestras tinajas artesanales de hormigón de alta resistencia, diseñadas para durar y adaptarse naturalmente a cualquier entorno. Cada pieza es única y combina robustez con una estética moderna e industrial.',
    'A diferencia de la madera, requieren mínima mantención y no se deterioran con el tiempo. Funcionan a leña, ofreciendo una experiencia auténtica conectada con los elementos naturales.',
  ],
}

export const POR_QUE = {
  imageTop:    { src: '/images/hormigon.webp', width: 1408, height: 768, alt: 'Textura de hormigón artesanal' },
  imageBottom: { src: '/images/hormigon.webp', width: 1408, height: 768, alt: 'Textura de hormigón' },
  label: 'POR QUÉ HORMIGÓN',
  title: 'Material que\nmejora con\nel tiempo.',
  features: [
    { number: '01', marker: '—', title: 'Retención de calor',  description: 'El hormigón guarda el calor más que cualquier otro material.' },
    { number: '02', marker: '—', title: 'Durabilidad extrema', description: 'Construida para resistir la intemperie y el tiempo sin deteriorarse.' },
    { number: '03', marker: '—', title: 'Material natural',    description: 'Sin plásticos ni químicos. Concreto, agua y manos artesanas.' },
    { number: '04', marker: '—', title: 'Mantención mínima',   description: 'Sin barniz, sin tratamientos. Solo agua y uso. El concreto no se pudre ni se astilla.' },
  ],
}

export const PROCESO = {
  image: { src: '/images/derecha.webp', width: 1536, height: 1024, alt: 'Tinaja de hormigón instalada' },
  label: 'PROCESO',
  steps: [
    { number: '01  —  VISITAMOS',  title: 'Terreno',                  description: 'Generamos una visita para asegurar que las condiciones sean las óptimas.' },
    { number: '02  —  FABRICAMOS', title: 'A mano, en nuestro taller', description: 'Proceso artesanal de 3 a 4 semanas con seguimiento.' },
    { number: '03  —  INSTALAMOS', title: 'Enciendes el fuego',        description: 'Nuestro equipo instala y pone en marcha. Solo disfrutas.' },
  ],
}

export const GALERIA = {
  label: 'GALERÍA',
  title: 'Cada pieza, una historia',
  disclaimer: '* Imágenes referenciales. Incluye escalera, banca interior y protección de cañerías. Pala y deck se venden por separado.',
  images: [
    { src: '/images/frente-gem-3.webp', width: 1195, height: 896, alt: 'Tinaja de hormigón de frente' },
    { src: '/images/drones.webp', width: 1449, height: 1086,       alt: 'Vista aérea de la tinaja' },
    { src: '/images/close-up.webp', width: 1536, height: 1024,     alt: 'Detalle de hormigón' },
    { src: '/images/parcela.webp', width: 1536, height: 1024,      alt: 'Tinaja en parcela' },
  ],
}

export const CTA = {
  image:    { src: '/images/parcela.webp', width: 1536, height: 1024, alt: 'Jardín con tinaja instalada' },
  label:    'HABLEMOS',
  title:    'Diseñada\npara ti.',
  subtitle: 'Cuéntanos tu espacio. Nosotros hacemos el resto.',
  cta:      'Solicitar consulta →',
}

export const FOOTER = {
  links: [
    { label: 'Producto', href: '#producto' },
    { label: 'Galería',  href: '#galeria' },
    { label: 'Contacto', href: '#contacto' },
  ],
  copyrightName: 'CALMA',
  // Bloque de contacto (aparece solo con datos en COMPANY). Los redacta/revisa Loro-Lola.
  labels: {
    address: 'Dirección',
    hours: 'Horario',
    group: 'Contacto y redes',
    mapsAria: 'Ver {address} en Google Maps (se abre en una pestaña nueva)',
    socialAria: '{network} de {name} (se abre en una pestaña nueva)',
  },
}

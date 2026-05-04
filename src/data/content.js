export const WHATSAPP_URL = 'https://wa.me/56989009814?text=Hola%2C%20me%20interesa%20una%20tinaja%20CALMA'

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
  tag: '— TINAJAS DE CONCRETO —',
  titleDesktop: 'Tinajas artesanales de hormigón',
  titleMobile:  'Tinajas\nartesanales\nde hormigón',
  subtitle:     'Diseñadas a mano. Pensadas para durar.',
  subtitleMobile: 'Diseñadas a mano.\nPensadas para durar.',
  cta: 'Consulta por tu tinaja',
}

export const QUE_ES = {
  label: 'QUÉ ES',
  title: 'Una tinaja es más que un baño',
  paragraphs: [
    'Nuestras tinajas artesanales de hormigón de alta resistencia, diseñadas para durar y adaptarse naturalmente a cualquier entorno. Cada pieza es única y combina robustez con una estética moderna e industrial.',
    'A diferencia de la madera, requieren mínima mantención y no se deterioran con el tiempo. Funcionan a leña, ofreciendo una experiencia auténtica conectada con los elementos naturales.',
  ],
}

export const POR_QUE = {
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
  quote: {
    text:   '"El fuego cruje. El vapor sube. La noche puede esperar."',
    author: '— Cliente CALMA, 2024',
  },
  images: [
    { src: '/images/frente-gem-3.png', alt: 'Tinaja frontal' },
    { src: '/images/drones.png',       alt: 'Vista aérea' },
    { src: '/images/derecha.png',      alt: 'Vista lateral' },
    { src: '/images/parcela.png',      alt: 'Tinaja en parcela' },
  ],
}

export const CTA = {
  label:    'HABLEMOS',
  title:    'Diseñada\npara ti.',
  subtitle: 'Cuéntanos tu espacio. Nosotros hacemos el resto.',
  cta:      'Solicitar consulta →',
  email:    'info@calma.es',
  phone:    '+34 600 000 000',
}

export const FOOTER = {
  logo:      'CALMA',
  links:     ['Producto', 'Galería', 'Contacto'],
  copyright: '© 2025 CALMA',
  agency:    'BLOQUE',
}

// Esquema de contenido editable desde el panel de administración.
// - `path`: ruta dentro del objeto de contenido de la sección (punto = anidación, índice numérico en listas).
// - `type`: text | textarea | image | email | phone | url | e164.
// - `label`: nombre que ve el dueño en el panel (español claro, mayúscula solo inicial).
// - `help`: (opcional) ayuda breve bajo el campo. En `image`, `altLabel`/`altHelp` describen el texto alternativo.
// - `maxLength`: límite de caracteres (≈ 1.5–2× el valor actual) para no romper el diseño.
// - `image`: el campo apunta a { src, alt }; `altMaxLength` limita el alt (path vacío = el propio ítem de lista).
// - Listas de tamaño FIJO (minItems = maxItems = longitud actual): no se añaden, eliminan ni reordenan.
// - Hrefs/anclas, números ordinales y lo comentado en el código (p. ej. textos del Hero) NO son editables.
import { FOOTER, GALERIA, MOBILE_MENU_LINKS, NAV_LINKS, POR_QUE, PROCESO } from './content.js'

const ALT_LABEL = 'Texto alternativo de la imagen'
const ALT_HELP = 'Describe lo que se ve. Lo leen los lectores de pantalla y ayuda a que te encuentren en buscadores.'
const SECTION_LABEL_HELP = 'Texto pequeño que aparece sobre el título de la sección.'
const LINE_BREAK_HELP = 'Cada salto de línea se muestra como un corte de línea en el sitio.'

const withHelp = (base, help) => (help ? { ...base, help } : base)
const field = (type, path, label, maxLength, help) => withHelp({ type, path, label, maxLength }, help)
const text = (path, label, maxLength, help) => field('text', path, label, maxLength, help)
const textarea = (path, label, maxLength, help) => field('textarea', path, label, maxLength, help)
const required = base => ({ ...base, required: true }) // NOT NULL y sin valor vacío en la BD
const image = (path, label, altMaxLength) => ({
  type: 'image',
  path,
  label,
  altLabel: ALT_LABEL,
  altHelp: ALT_HELP,
  altMaxLength,
})
const list = (path, label, size, fields) => ({ type: 'list', path, label, minItems: size, maxItems: size, fields })
const sectionLabel = (maxLength) => text('label', 'Etiqueta de sección', maxLength, SECTION_LABEL_HELP)

export const CONTENT_SCHEMA = {
  nav: {
    label: 'Menú de navegación',
    fields: [list('links', 'Enlaces', NAV_LINKS.length, [text('label', 'Texto del enlace', 20)])],
  },
  mobile_menu: {
    label: 'Menú móvil',
    fields: [list('links', 'Enlaces', MOBILE_MENU_LINKS.length, [text('label', 'Texto del enlace', 30)])],
  },
  hero: {
    label: 'Portada',
    fields: [image('image', 'Imagen de fondo', 70), text('cta', 'Texto del botón', 40)],
  },
  que_es: {
    label: 'Qué es',
    fields: [
      sectionLabel(20),
      text('title', 'Título', 60),
      textarea('paragraphs.0', 'Primer párrafo', 370),
      textarea('paragraphs.1', 'Segundo párrafo', 320),
      image('image', 'Imagen', 60),
    ],
  },
  por_que: {
    label: 'Por qué hormigón',
    fields: [
      sectionLabel(30),
      textarea('title', 'Título', 60, LINE_BREAK_HELP),
      image('imageTop', 'Imagen superior (móvil y tablet)', 60),
      image('imageBottom', 'Imagen inferior (escritorio)', 40),
      list('features', 'Características', POR_QUE.features.length, [
        text('title', 'Título', 40),
        textarea('description', 'Descripción', 150),
      ]),
    ],
  },
  proceso: {
    label: 'Proceso',
    fields: [
      sectionLabel(20),
      image('image', 'Imagen (escritorio)', 50),
      list('steps', 'Pasos', PROCESO.steps.length, [
        text('number', 'Etiqueta del paso', 30, 'Texto corto sobre el título del paso.'),
        text('title', 'Título', 50),
        textarea('description', 'Descripción', 130),
      ]),
    ],
  },
  galeria: {
    label: 'Galería',
    fields: [
      sectionLabel(20),
      text('title', 'Título', 50),
      textarea('disclaimer', 'Aviso bajo la galería', 210, 'Nota breve bajo las fotos, p. ej. si son referenciales.'),
      list('images', 'Imágenes', GALERIA.images.length, [image('', 'Imagen', 40)]),
    ],
  },
  cta: {
    label: 'Sección Hablemos',
    fields: [
      sectionLabel(20),
      textarea('title', 'Título', 30, LINE_BREAK_HELP),
      textarea('subtitle', 'Subtítulo', 90),
      text('cta', 'Texto del botón', 40),
      image('image', 'Imagen de fondo', 50),
    ],
  },
  footer: {
    label: 'Pie de página',
    fields: [
      list('links', 'Enlaces', FOOTER.links.length, [text('label', 'Texto del enlace', 20)]),
      text('copyrightName', 'Nombre junto al ©', 20, 'Aparece al final de la página, junto al año.'),
    ],
  },
  company: {
    label: 'Datos de la empresa',
    fields: [
      required(text('name', 'Nombre de la empresa', 20)),
      text('tagline', 'Lema', 60, 'Se muestra en el menú móvil.'),
      required(field('email', 'email', 'Correo electrónico', 30)),
      required(field('phone', 'phone', 'Teléfono', 30, 'Se muestra tal cual lo escribas, p. ej. +56 9 1234 5678.')),
      required(field('e164', 'whatsapp', 'Número de WhatsApp', 20, 'Número con código de país, p. ej. +56912345678. Los espacios y guiones se quitan solos.')),
      text(
        'whatsapp_message',
        'Mensaje inicial de WhatsApp',
        120,
        'Mensaje que ya viene escrito cuando alguien te contacta por WhatsApp.',
      ),
      text('address', 'Dirección', 120),
      text('city', 'Ciudad', 60),
      text('region', 'Región', 60),
      field('url', 'maps_url', 'Enlace a Google Maps', 300, 'Pega el enlace completo de tu ubicación en Google Maps.'),
      textarea('opening_hours', 'Horario de atención', 200, 'Por ejemplo: lunes a viernes, 9:00 a 18:00.'),
      field('url', 'social.instagram', 'Instagram', 200, 'Enlace completo del perfil, p. ej. https://instagram.com/tu_perfil.'),
      field('url', 'social.facebook', 'Facebook', 200, 'Enlace completo de la página.'),
      field('url', 'social.tiktok', 'TikTok', 200, 'Enlace completo del perfil.'),
      field('url', 'social.youtube', 'YouTube', 200, 'Enlace completo del canal.'),
    ],
  },
}

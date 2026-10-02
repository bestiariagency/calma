import { Clock, Facebook, Instagram, Link, Mail, MapPin, MessageCircle, Music2, Phone, Youtube } from 'lucide-vue-next'

// Icono a la izquierda del label (spec 4.4): por campo (dirección, horario), por red social (`social.*`) o por tipo. Identidad, ciudad y región van sin icono.
const BY_TYPE = { email: Mail, phone: Phone, e164: MessageCircle, url: Link }
const BY_PATH = { address: MapPin, opening_hours: Clock }
const BY_NETWORK = { instagram: Instagram, facebook: Facebook, tiktok: Music2, youtube: Youtube }

export const companyIcon = field => BY_PATH[field.path] ?? BY_NETWORK[field.path.split('.')[1]] ?? BY_TYPE[field.type] ?? null

// Helpers puros para derivar enlaces de contacto desde los datos de COMPANY.

export const telHref = phone => `tel:${phone.replace(/[^\d+]/g, '')}`

export const mailtoHref = email => `mailto:${email}`

export const whatsappUrl = (e164, message) =>
  `https://wa.me/${e164.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

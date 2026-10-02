import { Circle, CircleAlert, CircleCheck, Dot, Info, TriangleAlert } from 'lucide-vue-next'

// Iconos por tipo de estado (Alert, Toast, Badge) — spec §3.7, §3.12, §3.17.
export const STATUS_ICONS = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert, error: CircleAlert }
export const BADGE_ICONS = { neutral: Circle, accent: Dot, ...STATUS_ICONS }

export const BADGE_STYLES = {
  neutral: 'bg-surface-3 text-text-2 border-line',
  accent: 'bg-accent-soft text-accent-text border-accent-line',
  success: 'bg-success-soft text-success border-success-line',
  warning: 'bg-warning-soft text-warning border-warning-line',
  danger: 'bg-danger-soft text-danger border-danger-line',
  info: 'bg-info-soft text-info border-info-line',
}

export const ALERT_STYLES = {
  info: { box: 'bg-info-soft border-info-line', icon: 'text-info', role: 'status' },
  success: { box: 'bg-success-soft border-success-line', icon: 'text-success', role: 'status' },
  warning: { box: 'bg-warning-soft border-warning-line', icon: 'text-warning', role: 'status' },
  danger: { box: 'bg-danger-soft border-danger-line', icon: 'text-danger', role: 'alert' },
}

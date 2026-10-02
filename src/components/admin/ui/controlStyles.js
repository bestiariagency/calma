// Anatomía común de Input/Textarea (spec §3.2). El error se marca con aria-invalid (lo pone Field).
export const CONTROL_BASE = [
  'w-full rounded-md bg-surface-3 text-text border border-line-input px-3 font-sans placeholder:text-text-3',
  'transition-colors duration-(--motion-fast) ease-(--ease-panel) motion-reduce:transition-none',
  'hover:border-text-3',
  'focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
  'aria-invalid:border-danger',
  'read-only:bg-surface-2 read-only:border-line read-only:text-text-2',
  'disabled:bg-surface-2 disabled:border-line disabled:text-text-disabled disabled:cursor-not-allowed',
].join(' ')

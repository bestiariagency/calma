import { inject, provide } from 'vue'

const KEY = Symbol('sectionEditor')

// La vista provee el editor; los campos lo consumen sin prop drilling.
export const provideEditor = editor => provide(KEY, editor)
export const useEditor = () => inject(KEY)

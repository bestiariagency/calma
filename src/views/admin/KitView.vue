<script setup>
// Página de muestra del kit de componentes. SOLO desarrollo (ruta registrada bajo import.meta.env.DEV).
import { ref } from 'vue'
import { Save, Trash2 } from 'lucide-vue-next'
import './adminStyles.js'
import { useToast } from '../../composables/admin/useToast.js'
import { shortcutLabel } from '../../lib/platform.js'
import Alert from '../../components/admin/ui/Alert.vue'
import Avatar from '../../components/admin/ui/Avatar.vue'
import Badge from '../../components/admin/ui/Badge.vue'
import Button from '../../components/admin/ui/Button.vue'
import Card from '../../components/admin/ui/Card.vue'
import Dialog from '../../components/admin/ui/Dialog.vue'
import Field from '../../components/admin/ui/Field.vue'
import Input from '../../components/admin/ui/Input.vue'
import Kbd from '../../components/admin/ui/Kbd.vue'
import Logo from '../../components/admin/ui/Logo.vue'
import SkipLink from '../../components/admin/ui/SkipLink.vue'
import Skeleton from '../../components/admin/ui/Skeleton.vue'
import Spinner from '../../components/admin/ui/Spinner.vue'
import Textarea from '../../components/admin/ui/Textarea.vue'
import ToastHost from '../../components/admin/ui/ToastHost.vue'
import Tooltip from '../../components/admin/ui/Tooltip.vue'

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger']
const BADGES = ['neutral', 'accent', 'success', 'warning', 'danger', 'info']
const ALERTS = ['info', 'success', 'warning', 'danger']

const toast = useToast()
const name = ref('Tinaja Bosque')
const description = ref('Hormigón artesanal pulido a mano.\nSegunda línea.')
const longText = ref('x'.repeat(95))
const overText = ref('x'.repeat(112))
const dialogOpen = ref(false)
const busyDialogOpen = ref(false)
const busy = ref(false)
const alertVisible = ref(true)

function confirmBusy() {
  busy.value = true
  setTimeout(() => {
    busy.value = false
    busyDialogOpen.value = false
    toast.success('Cambios publicados')
  }, 1800)
}
</script>

<template>
  <div class="min-h-screen bg-app-bg font-sans text-text scheme-dark">
    <SkipLink />
    <ToastHost />
    <main id="contenido" tabindex="-1" class="mx-auto flex max-w-(--spacing-content-max) flex-col gap-10 p-8 max-md:p-4">
      <header class="flex items-center justify-between gap-4">
        <h1 class="font-mono text-xl/7 font-bold tracking-title max-md:text-lg/6">Kit de componentes del panel</h1>
        <Logo size="sm" />
      </header>

      <Card title="Button" help="Variantes × estados (default · disabled · loading) y tamaño sm.">
        <div v-for="variant in VARIANTS" :key="variant" class="flex flex-wrap items-center gap-3">
          <span class="w-20 font-mono text-xs text-text-3">{{ variant }}</span>
          <Button :variant="variant">Guardar <Kbd inherit>{{ shortcutLabel('S') }}</Kbd></Button>
          <Button :variant="variant" disabled>Disabled</Button>
          <Button :variant="variant" loading>Guardando</Button>
          <Button :variant="variant" size="sm">Small</Button>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <span class="w-20 font-mono text-xs text-text-3">icon</span>
          <Tooltip v-slot="{ describedby }" text="Guardar" :shortcut="shortcutLabel('S')">
            <Button variant="icon" aria-label="Guardar" :aria-describedby="describedby"><Save :size="20" aria-hidden="true" /></Button>
          </Tooltip>
          <Button variant="icon" aria-label="Eliminar" disabled><Trash2 :size="20" aria-hidden="true" /></Button>
          <Button variant="secondary"><Save :size="16" aria-hidden="true" /> Con icono</Button>
          <Button variant="secondary" loading><Save :size="16" aria-hidden="true" /> Con icono</Button>
        </div>
      </Card>

      <Card title="Spinner, Skeleton, Kbd, Avatar, Logo">
        <div class="flex flex-wrap items-center gap-6">
          <Spinner :size="14" /><Spinner :size="16" /><Spinner :size="24" />
          <Kbd>{{ shortcutLabel('S') }}</Kbd>
          <Avatar name="Ana Pérez" /><Avatar email="dueno@calma.cl" />
          <Logo variant="iso" decorative /><Logo />
        </div>
        <div class="flex flex-col gap-2">
          <Skeleton announce class="h-4 w-32" />
          <Skeleton class="h-10" />
          <Skeleton class="h-24" />
        </div>
      </Card>

      <Card title="Input, Textarea y Field" help="Default · obligatorio con ayuda · contador al 90 % · sobre el límite · error · disabled · readonly.">
        <Field v-slot="{ controlProps }" label="Nombre" required help="Cómo aparece en el catálogo." :count="name.length" :max-length="40">
          <Input v-bind="controlProps" v-model="name" placeholder="Nombre del producto" />
        </Field>
        <Field v-slot="{ controlProps }" label="Descripción" :count="description.length" :max-length="370" help="Los saltos de línea se respetan.">
          <Textarea v-bind="controlProps" v-model="description" />
        </Field>
        <Field v-slot="{ controlProps }" label="Cerca del límite (90 %)" :count="longText.length" :max-length="100">
          <Input v-bind="controlProps" v-model="longText" />
        </Field>
        <Field v-slot="{ controlProps }" label="Sobre el límite" :count="overText.length" :max-length="100">
          <Input v-bind="controlProps" v-model="overText" />
        </Field>
        <Field v-slot="{ controlProps }" label="Correo" error="Escribe un correo válido.">
          <Input v-bind="controlProps" model-value="no-es-correo" type="email" />
        </Field>
        <div class="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          <Field v-slot="{ controlProps }" label="Deshabilitado"><Input v-bind="controlProps" model-value="Valor" disabled /></Field>
          <Field v-slot="{ controlProps }" label="Solo lectura"><Input v-bind="controlProps" model-value="Valor" readonly /></Field>
        </div>
      </Card>

      <Card title="Badge y Alert">
        <div class="flex flex-wrap gap-2">
          <Badge v-for="v in BADGES" :key="v" :variant="v">{{ v }}</Badge>
        </div>
        <Alert v-for="v in ALERTS" :key="v" :variant="v" :title="`Aviso ${v}`">
          Detalle del aviso con texto secundario.
          <template #action><Button variant="secondary" size="sm">Reintentar</Button></template>
        </Alert>
        <Alert v-if="alertVisible" variant="info" dismissible @dismiss="alertVisible = false">Alert descartable.</Alert>
        <Button v-else variant="secondary" size="sm" @click="alertVisible = true">Mostrar de nuevo</Button>
      </Card>

      <Card title="Toast y Dialog" help="Éxito/info 4 s · warning 6 s · error persistente · máx. 3 visibles. Pausa en hover/foco.">
        <div class="flex flex-wrap gap-3">
          <Button variant="secondary" @click="toast.success('Cambios publicados')">Éxito</Button>
          <Button variant="secondary" @click="toast.info('No hay cambios')">Info</Button>
          <Button variant="secondary" @click="toast.warning('Imagen pesada', { detail: 'Pesa 4,8 MB; el máximo es 5 MB.' })">Warning</Button>
          <Button variant="secondary" @click="toast.error('No se pudo guardar', { action: { label: 'Reintentar', onClick: () => toast.info('Reintentando…') } })">Error + acción</Button>
          <Button variant="secondary" @click="dialogOpen = true">Dialog destructivo</Button>
          <Button variant="secondary" @click="busyDialogOpen = true">Dialog con loading</Button>
        </div>
      </Card>
    </main>

    <Dialog v-model="dialogOpen" tone="danger" title="¿Descartar los cambios?" description="Perderás los cambios de 3 campos. Esta acción no se puede deshacer.">
      <template #footer="{ close }">
        <Button variant="secondary" data-autofocus @click="close">Seguir editando</Button>
        <Button variant="danger" @click="close">Descartar</Button>
      </template>
    </Dialog>
    <Dialog v-model="busyDialogOpen" tone="warning" title="¿Publicar ahora?" description="Los cambios se verán en el sitio al instante." :busy="busy">
      <template #footer="{ close }">
        <Button variant="secondary" data-autofocus :disabled="busy" @click="close">Cancelar</Button>
        <Button :loading="busy" @click="confirmBusy">Publicar</Button>
      </template>
    </Dialog>
  </div>
</template>

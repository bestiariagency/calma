// Limpieza de fotos sin uso. Orden obligatorio: PRIMERO el objeto de Storage y DESPUÉS la fila de `media`
// (si el borrado del objeto falla, la fila queda y la foto sigue listada; nunca una fila apuntando a un archivo borrado).

export function summarizeOrphans(items) {
  return { count: items.length, bytes: items.reduce((sum, item) => sum + (Number(item.bytes) || 0), 0) }
}

const failStep = (error, step) => Object.assign(error instanceof Error ? error : new Error(String(error)), { step })

async function cleanOne(item, { removeObject, deleteRecord }) {
  let outcome
  try {
    outcome = await removeObject(item.path) // 'removed' | 'missing' (ya no estaba) | 'blocked' (RLS devolvió [])
  } catch (error) {
    throw failStep(error, 'storage')
  }
  if (outcome === 'blocked') throw failStep(new Error('storage_blocked'), 'storage')
  if (!item.media_id) return
  try {
    await deleteRecord(item.media_id)
  } catch (error) {
    throw failStep(error, 'record')
  }
}

// Secuencial y tolerante a fallos parciales: un error no detiene el resto.
// → { deleted, freedBytes, failed: [{ item, step: 'storage' | 'record', message }] }
export async function cleanOrphans(items, { removeObject, deleteRecord, onProgress = () => {} }) {
  const result = { deleted: 0, freedBytes: 0, failed: [] }
  for (const [index, item] of items.entries()) {
    try {
      await cleanOne(item, { removeObject, deleteRecord })
      result.deleted += 1
      result.freedBytes += Number(item.bytes) || 0
    } catch (error) {
      result.failed.push({ item, step: error.step, message: error.message })
    }
    onProgress({ done: index + 1, total: items.length })
  }
  return result
}

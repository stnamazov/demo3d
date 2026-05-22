const MODEL_ID_PATTERN = /^[a-zA-Z0-9_-]+$/

export function isValidModelId(modelId: string): boolean {
  return MODEL_ID_PATTERN.test(modelId)
}

export function buildModelUrl(baseUrl: string, modelId: string): string {
  const base = baseUrl.replace(/\/$/, '')
  return `${base}/${modelId}.glb`
}

/** Checks that the GLB exists (HEAD, with GET fallback for strict S3 configs). */
export async function checkModelAvailable(url: string): Promise<boolean> {
  try {
    let response = await fetch(url, { method: 'HEAD' })

    if (!response.ok && (response.status === 403 || response.status === 405)) {
      response = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-0' },
      })
    }

    return response.ok
  }
  catch {
    return false
  }
}

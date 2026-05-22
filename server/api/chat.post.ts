export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null) as { message?: unknown } | null
  const raw = body?.message
  const message = typeof raw === 'string' ? raw.trim() : ''

  if (!message) {
    throw createError({ statusCode: 400, statusMessage: 'Пустое сообщение' })
  }

  // Заглушка: здесь будет ваша логика (LLM, БД и т.д.)
  const reply = `Сервер получил: ${message}`

  return { reply }
})

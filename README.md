# Демо — 3D-просмотрщик моделей

Веб-приложение для показа GLB-моделей из Blender. Модель открывается по адресу вида `/имя_файла` (без `.glb`), управление строится из **Custom Properties** в Blender.

**Стек:** [Nuxt 4](https://nuxt.com) · [Vue 3](https://vuejs.org) · [TresJS](https://docs.tresjs.org) · [Three.js](https://threejs.org)

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте в браузере, например:

```
http://localhost:3000/demo_besedka_0001
```

Файл на сервере должен называться `demo_besedka_0001.glb`.

## Откуда берутся модели

По умолчанию модели загружаются с S3:

```
{modelBaseUrl}/{modelId}.glb
```

Пример: `demo_besedka_0001` → `https://s3.twcstorage.ru/namazov-pro/demo_3d/demo_besedka_0001.glb`

Базовый URL можно переопределить:

```bash
NUXT_PUBLIC_MODEL_BASE_URL=https://your-bucket.example.com/path/to/models
```

На бакете нужен **CORS** для домена сайта, иначе браузер не скачает GLB.

Если модели нет — показывается страница ошибки (404).

## Свойства в Blender

При экспорте в GLB custom properties попадают в `userData` объекта. По ним строятся элементы управления внизу экрана:

| Свойство | Поведение |
|----------|-----------|
| `color_toggle` | Группа мешей с одним значением — общий выбор цвета |
| `visible_toggle` | В группе виден только один объект (переключатель) |
| `visible_check` | Несколько объектов можно включать/выключать независимо (по умолчанию все скрыты) |
| `size_toggle` | Масштаб по осям ±20% от исходного (длина / ширина / высота) |
| `info` | Текстовая подсказка над объектом в сцене |

Пустая строка в `color_toggle` — отдельная допустимая группа.

## Сборка

```bash
npm run generate   # статика в .output/public (для S3, nginx и т.п.)
npm run build      # production-сборка (Node-сервер)
npm run preview    # локальный просмотр
```

Статический хостинг: приложение SPA (`ssr: false`). Нужен fallback на `index.html` или `200.html` для путей вроде `/demo_besedka_0001` (иначе хостинг вернёт 404 до загрузки JS).

## Структура проекта (кратко)

```
app/
  pages/[modelId].vue   # страница модели
  composables/          # логика слотов (цвет, видимость, размер…)
  utils/                # разбор GLB и custom properties
components/
  ModelViewer.vue       # canvas, фон «ДЕМО», панель управления
  Scene.vue             # загрузка GLB и сцена Three.js
public/
  favicon.svg
```

## Лицензия

Приватный проект (`private: true` в `package.json`).

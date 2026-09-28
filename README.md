# Ева Дент

Лендинг стоматологии в Копейске. React 19, TypeScript, Vinext/Vite, Tailwind CSS, Radix Accordion, Morphicons.

## Локальный запуск

Требуется Node.js 22.13+.

```powershell
cd D:\Project\Codex\LandingMKZV\eva-dent
npm ci
npm run dev
```

Открыть http://localhost:5173/.

```powershell
npx tsc --noEmit
npm run build
```

## Содержимое

- `app/page.tsx` — разделы, контакты и интерактивные элементы.
- `app/globals.css` — оформление и адаптивные стили.
- `public/images` — фотографии с исходного сайта.
- `app/layout.tsx` — язык и метаданные.

Источники сведений: https://evadent74.ru/ и https://evadent74.ru/sertifikaty/ (28.09.2026). Тексты сокращены и адаптированы. Фото кабинета взято с сайта клиники по запросу заказчика. Специалисты представлены типографическими карточками с именами и квалификацией. Художественный визуал стоматологического зеркала создан встроенным ImageGen; это не фотография оборудования клиники. Morphicons: https://www.morphicons.com/ (MIT); оригинальные линейные иконки передаются в MorphIcon как SVG path.

Запись ведёт к контактам и звонку в клинику. Отправка заявок не подключена. Публикация отложена по просьбе заказчика; конфигурация сервера будет определена после получения доступа. Перед публикацией необходимо согласовать тексты, фотографии и документы с клиникой.


## Визуальная версия 2

Структура переработана по референсам пользователя: сквозная сетка из трёх колонок, круговой первый экран, переключатель направлений, тёмные секции, наклонённые карточки маршрута лечения. Декоративные звёзды удалены. Morphicons анимирует кнопки и раскрытия; IntersectionObserver запускает появление блоков, CSS — движение пунктирных орбит. При `prefers-reduced-motion` движение отключается.

Генерация: встроенный ImageGen. Ассет: `public/images/dental-mirror.png`.

Промпт: «Landscape 3:2 editorial macro photograph of a single polished stainless-steel dental examination mirror, slim knurled handle entering diagonally from lower left, mirror head on right reflecting burnt orange studio light. Matte warm grey background, charcoal shadows, silver metal, orange #EC6426 accents. 100mm macro lens, shallow depth of field, softbox upper right, controlled reflections, left negative space. No people, teeth, typography, UI, stars or logos.»

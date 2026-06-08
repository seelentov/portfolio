# Portfolio — Владислав Комков

Полное портфолио для демонстрации навыков веб- и мобильной разработки.

## Структура

### Сайты (HTML/CSS/JS — для GitHub Pages)

| Папка | Концепт | Тематика |
|---|---|---|
| `site-restaurant/` | **NOIR** | Fine dining ресторан — тёмная палитра, золотые акценты, кастомный курсор, кинематографичная типографика |
| `site-agency/` | **VOLT.studio** | Креативное агентство — бруталистский дизайн, яркие гради­ентные блобы, крупная типографика |
| `site-gadget/` | **AURA X** | Промо беспроводных наушников — высокотех дизайн, 3D-эффекты, неоновые акценты |
| `site-business-card/` | **com.dev** | Визитка с услугами, портфолио и формой связи — главная точка входа |

### Мобильные приложения (Expo + React Native + TypeScript)

| Папка | Имя | Тематика |
|---|---|---|
| `app-fitness/` | **PULSE** | Фитнес-трекер — тёмная тема, неоновые акценты, кольца прогресса, графики |
| `app-meditation/` | **STILL** | Медитация — мягкие пастельные градиенты, breathing animation, библиотека сессий |
| `app-finance/` | **VAULT** | Финансы — карты, аналитика, графики доходов/расходов, savings goal |

## Как запустить

### Сайты
Откройте `index.html` в любой папке `site-*` в браузере, или:
```bash
cd portfolio && npx http-server -p 8080
# Откройте http://localhost:8080/site-business-card/
```

### Мобильные приложения
```bash
cd app-fitness   # или app-meditation, app-finance
npm install      # (если node_modules не настроен)
npx expo start --web   # запуск веб-демо
# или npx expo start для QR-кода под Expo Go
```

## Тестирование

В корне настроен Jest с двумя проектами: **unit-тесты** (валидаторы) и **e2e-тесты** (jsdom — рендер HTML и поведение).

```bash
cd portfolio
npx jest                     # все тесты сайтов (49 тестов)
cd app-fitness && npx jest   # 9 тестов
cd app-meditation && npx jest # 9 тестов
cd app-finance && npx jest   # 11 тестов
```

**Итого: 78 проходящих тестов.**

## Деплой

- **Сайты** публикуются на GitHub Pages — просто запушьте в репозиторий с включённым Pages.
- **Expo-приложения** деплоятся через `npx expo export --platform web` → получаемая папка `dist/` копируется на GitHub Pages.

## Контакты

- Email: komkov222111@gmail.com
- Сайт: см. `site-business-card/index.html`

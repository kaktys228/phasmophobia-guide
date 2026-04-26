# Phasmophobia Guide

Справочник по Phasmophobia с журналом призраков, фильтрами, AI-поиском, механиками, уликами, проклятыми предметами, прогрессом и страницей авторизации.

## Быстрый запуск

Требования:

- Node.js 20+
- npm

Установка:

```bash
npm install
```

Запуск локально:

```bash
npm run dev
```

Адрес локального сайта:

```txt
http://localhost:3000
```

Страница авторизации:

```txt
http://localhost:3000/auth
```

## Переменные окружения

Создайте файл `.env.local` и заполните нужные значения.

Минимально для Supabase Auth:

```env
VITE_SUPABASE_URL="https://aeodtbnqzyflivktsluo.supabase.co"
VITE_SUPABASE_ANON_KEY="ваш_publishable_или_anon_key"
```

Для AI-поиска:

```env
PROXYAPI_OPENAI_API_KEY=""
PROXYAPI_OPENAI_MODEL="gpt-5-nano"
PROXYAPI_OPENAI_BASE_URL="https://api.proxyapi.ru/openai/v1"

GEMINI_API_KEY=""
GEMINI_MODEL="gemini-2.5-flash"
GEMINI_FALLBACK_MODELS="gemini-2.5-flash-lite,gemini-2.0-flash"

GROQ_API_KEY=""
GROQ_MODEL="openai/gpt-oss-20b"
```

Для настоящей CAPTCHA через Cloudflare Turnstile:

```env
VITE_TURNSTILE_SITE_KEY=""
```

Важно: `VITE_` переменные видны в браузере. Не добавляйте в frontend `SUPABASE_SERVICE_ROLE_KEY`, Google client secret, Turnstile secret key или другие server-side секреты.

## Что умеет авторизация

Сейчас реализовано:

- отдельная страница `/auth`;
- вход через логин или почту + пароль;
- регистрация через логин, пароль, почту, имя и фото;
- вход через Google;
- подтверждение почты кодом;
- восстановление пароля кодом из письма;
- CAPTCHA после 7 неудачных попыток входа;
- аватар пользователя в шапке сайта.

Важное ограничение: Supabase Auth нативно входит по email, а не по username. В проекте логин работает через локальное соответствие `логин -> email`, которое сохраняется после регистрации в браузере пользователя. Если пользователь входит с другого устройства, он должен ввести почту вместо логина. Для полноценного глобального входа по логину нужна отдельная таблица `profiles` и серверный endpoint.

## Подробная настройка Supabase

Откройте проект:

```txt
https://supabase.com/dashboard/project/aeodtbnqzyflivktsluo
```

### 1. URL Configuration

Перейдите:

```txt
Authentication -> URL Configuration
```

В `Site URL` укажите production-адрес:

```txt
https://phasmahpobia.vercel.app
```

В `Redirect URLs` добавьте:

```txt
https://phasmahpobia.vercel.app/**
http://localhost:3000/**
```

Сохраните изменения.

### 2. Email/password вход

Перейдите:

```txt
Authentication -> Sign In / Providers
```

Откройте провайдер `Email`.

Включите:

- `Enable Email provider`
- `Confirm email`

Сохраните изменения.

### 3. Google OAuth

В Supabase перейдите:

```txt
Authentication -> Sign In / Providers -> Google
```

Включите:

```txt
Enable Sign in with Google
```

Скопируйте callback URL из Supabase. Для текущего проекта он такой:

```txt
https://aeodtbnqzyflivktsluo.supabase.co/auth/v1/callback
```

Дальше откройте Google Cloud:

```txt
https://console.cloud.google.com/apis/credentials
```

Настройте OAuth consent screen:

- User Type: `External`
- App name: `Phasmophobia Guide`
- User support email: ваша почта
- Developer contact email: ваша почта
- Scopes можно не добавлять

Создайте OAuth Client:

```txt
Create Credentials -> OAuth client ID
```

Настройки:

- Application type: `Web application`
- Name: `Phasmophobia Guide`

Authorized JavaScript origins:

```txt
https://phasmahpobia.vercel.app
http://localhost:3000
```

Authorized redirect URIs:

```txt
https://aeodtbnqzyflivktsluo.supabase.co/auth/v1/callback
```

После создания Google выдаст:

- `Client ID`
- `Client Secret`

Вставьте их в Supabase:

- `Client IDs` = Google `Client ID`
- `Client Secret (for OAuth)` = Google `Client Secret`

Сохраните изменения.

### 4. Email templates с кодами

Перейдите:

```txt
Authentication -> Email -> Templates
```

Откройте `Confirm sign up`.

В `Body` вставьте:

```html
<h2>Подтверждение регистрации</h2>
<p>Ваш код подтверждения:</p>
<h1>{{ .Token }}</h1>
<p>Введите этот код на сайте Phasmophobia Guide.</p>
```

Сохраните.

Откройте `Reset password`.

В `Body` вставьте:

```html
<h2>Восстановление пароля</h2>
<p>Ваш код восстановления:</p>
<h1>{{ .Token }}</h1>
<p>Введите этот код на сайте и задайте новый пароль.</p>
```

Сохраните.

Ключевой момент: в письме обязательно должен быть `{{ .Token }}`. Без него сайту нечего вводить в поле кода.

### 5. Storage для фото профиля

Чтобы загрузка фото при регистрации работала, создайте bucket.

Перейдите:

```txt
Storage -> New bucket
```

Создайте bucket:

```txt
avatars
```

Рекомендуемо включить `Public bucket`, чтобы аватары можно было показывать в интерфейсе.

Затем перейдите:

```txt
Storage -> Policies -> avatars
```

Добавьте политики для authenticated users.

Минимальный вариант через SQL Editor:

```sql
create policy "Users can upload own avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update own avatars"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Avatar files are publicly readable"
on storage.objects
for select
to public
using (bucket_id = 'avatars');
```

Если bucket не создать, регистрация всё равно будет работать, но фото не загрузится.

### 6. CAPTCHA через Cloudflare Turnstile

Без Turnstile сайт использует простую локальную проверку после 7 ошибок входа. Это не полноценная защита от ботов.

Для нормальной CAPTCHA:

1. Откройте Cloudflare Turnstile:

```txt
https://dash.cloudflare.com/?to=/:account/turnstile
```

2. Создайте widget:

- Widget name: `Phasmophobia Guide`
- Hostname: `phasmahpobia.vercel.app`
- Hostname для локалки: `localhost`
- Widget mode: `Managed`

3. Cloudflare выдаст:

- `Site key`
- `Secret key`

4. `Site key` добавьте в `.env.local`:

```env
VITE_TURNSTILE_SITE_KEY="site_key_из_cloudflare"
```

5. `Site key` добавьте в Vercel:

```txt
Vercel -> Project -> Settings -> Environment Variables
```

Name:

```txt
VITE_TURNSTILE_SITE_KEY
```

Environment:

```txt
Production
Development
```

6. `Secret key` добавьте только в Supabase:

```txt
Authentication -> Attack Protection
```

Найдите CAPTCHA / Bot protection, выберите Cloudflare Turnstile и вставьте `Secret key`.

Secret key нельзя добавлять в frontend и нельзя хранить как `VITE_` переменную.

### 7. Vercel env

В Vercel должны быть переменные:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_TURNSTILE_SITE_KEY
```

После изменения env нужно сделать redeploy.

## Деплой

Проект подключён к GitHub и Vercel. После push в `main` Vercel запускает production deploy.

Production URL:

```txt
https://phasmahpobia.vercel.app
```

## Проверка

Проверка TypeScript:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

Локальный preview:

```bash
npm run preview
```

## Частые проблемы

### После нажатия `Войти` пустая страница

Причина была в роутинге React: переход на auth-страницу менял порядок hooks. Исправлено: auth-страница теперь рендерится на уровне корневого router.

Если всё ещё пусто:

- перезапустите dev server;
- откройте `http://localhost:3000/auth`;
- проверьте консоль браузера;
- выполните `npm run build`.

### Google login не работает

Проверьте:

- Google provider включён в Supabase;
- Client ID и Client Secret вставлены в Supabase;
- redirect URI в Google Cloud совпадает с Supabase callback URL;
- в Supabase `URL Configuration` указан правильный `Site URL`.

### Код на почту не приходит

Проверьте:

- `Confirm email` включён;
- в шаблоне есть `{{ .Token }}`;
- письмо не попало в спам;
- встроенная почта Supabase на free plan имеет лимиты.

### Фото профиля не грузится

Проверьте:

- bucket называется строго `avatars`;
- bucket public;
- есть storage policies для upload/select.

## Полезные ссылки

- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Google OAuth: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase Email Templates: https://supabase.com/docs/guides/auth/auth-email-templates
- Supabase CAPTCHA: https://supabase.com/docs/guides/auth/auth-captcha
- Cloudflare Turnstile: https://developers.cloudflare.com/turnstile/
- Vercel Environment Variables: https://vercel.com/docs/environment-variables

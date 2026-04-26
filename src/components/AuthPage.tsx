import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Chrome,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  ShieldCheck,
  Skull,
  User,
  UserPlus,
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { isSupabaseConfigured, supabase, turnstileSiteKey } from '../services/supabaseClient';

type AuthMode = 'login' | 'register' | 'verify-signup' | 'forgot' | 'verify-recovery';

const FAILED_LOGIN_STORAGE_KEY = 'phasmo-auth-failed-login-count';
const USERNAME_INDEX_STORAGE_KEY = 'phasmo-auth-username-index';
const CAPTCHA_AFTER_ATTEMPTS = 7;
const AVATAR_BUCKET = 'avatars';

function readFailedLoginCount() {
  const stored = Number(localStorage.getItem(FAILED_LOGIN_STORAGE_KEY) ?? '0');
  return Number.isFinite(stored) ? stored : 0;
}

function writeFailedLoginCount(value: number) {
  localStorage.setItem(FAILED_LOGIN_STORAGE_KEY, String(value));
}

function readUsernameIndex(): Record<string, string> {
  try {
    const stored = localStorage.getItem(USERNAME_INDEX_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveUsernameEmail(username: string, email: string) {
  const index = readUsernameIndex();
  index[username.trim().toLowerCase()] = email.trim().toLowerCase();
  localStorage.setItem(USERNAME_INDEX_STORAGE_KEY, JSON.stringify(index));
}

function resolveLoginToEmail(login: string) {
  const value = login.trim().toLowerCase();
  if (value.includes('@')) {
    return value;
  }

  return readUsernameIndex()[value] ?? '';
}

function createMathCaptcha() {
  const left = Math.floor(Math.random() * 8) + 2;
  const right = Math.floor(Math.random() * 7) + 3;

  return {
    question: `${left} + ${right}`,
    answer: String(left + right),
  };
}

function goHome() {
  window.history.pushState({}, '', '/');
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function AuthPage() {
  const { user, signOut } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedLoginCount, setFailedLoginCount] = useState(() => readFailedLoginCount());
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [mathCaptcha, setMathCaptcha] = useState(() => createMathCaptcha());
  const [mathCaptchaValue, setMathCaptchaValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasTurnstile = Boolean(turnstileSiteKey);
  const needsLoginCaptcha = failedLoginCount >= CAPTCHA_AFTER_ATTEMPTS;
  const shouldShowTurnstile =
    hasTurnstile && (needsLoginCaptcha || mode === 'register' || mode === 'forgot');
  const shouldShowMathCaptcha = !hasTurnstile && mode === 'login' && needsLoginCaptcha;

  const modeTitle = useMemo(() => {
    if (mode === 'register') return 'Регистрация';
    if (mode === 'forgot') return 'Восстановление пароля';
    if (mode === 'verify-signup') return 'Подтверждение почты';
    if (mode === 'verify-recovery') return 'Новый пароль';
    return 'Авторизация';
  }, [mode]);

  const modeDescription = useMemo(() => {
    if (mode === 'register') return 'Создайте профиль исследователя: логин, пароль, почта, имя и фото.';
    if (mode === 'forgot') return 'Введите почту, чтобы получить код восстановления пароля.';
    if (mode === 'verify-signup') return 'Введите код из письма, чтобы активировать аккаунт.';
    if (mode === 'verify-recovery') return 'Введите код из письма и задайте новый пароль.';
    return 'Введите логин и пароль. Если входите с другого устройства, можно ввести почту вместо логина.';
  }, [mode]);

  const resetStatus = () => {
    setError(null);
    setMessage(null);
  };

  const switchMode = (nextMode: AuthMode) => {
    resetStatus();
    setMode(nextMode);
    setCode('');
    setNewPassword('');
    setTurnstileToken(null);
    setMathCaptcha(createMathCaptcha());
    setMathCaptchaValue('');
  };

  const ensureCaptchaReady = () => {
    if (shouldShowTurnstile && !turnstileToken) {
      setError('Подтвердите CAPTCHA перед отправкой формы.');
      return false;
    }

    if (shouldShowMathCaptcha && mathCaptchaValue.trim() !== mathCaptcha.answer) {
      setError('CAPTCHA решена неверно. Попробуйте ещё раз.');
      setMathCaptcha(createMathCaptcha());
      setMathCaptchaValue('');
      return false;
    }

    return true;
  };

  const buildCaptchaOptions = () => (turnstileToken ? { captchaToken: turnstileToken } : undefined);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAvatarFile(file);
    setAvatarPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const uploadAvatar = async () => {
    if (!supabase || !avatarFile) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const extension = avatarFile.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
    const path = `${userId}/${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, avatarFile, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      setMessage('Аккаунт создан. Фото не загрузилось: в Supabase Storage нужен public bucket `avatars` с upload policy.');
      return;
    }

    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
    await supabase.auth.updateUser({
      data: {
        avatar_url: data.publicUrl,
        picture: data.publicUrl,
      },
    });
  };

  const handleLogin = async () => {
    if (!supabase || !ensureCaptchaReady()) return;

    const resolvedEmail = resolveLoginToEmail(login);
    if (!resolvedEmail) {
      throw new Error('Логин не найден на этом устройстве. Введите почту вместо логина или зарегистрируйтесь.');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password,
      options: buildCaptchaOptions(),
    });

    if (signInError) {
      const nextCount = failedLoginCount + 1;
      setFailedLoginCount(nextCount);
      writeFailedLoginCount(nextCount);
      setTurnstileToken(null);
      setMathCaptcha(createMathCaptcha());
      setMathCaptchaValue('');
      throw signInError;
    }

    setFailedLoginCount(0);
    writeFailedLoginCount(0);
    goHome();
  };

  const handleRegister = async () => {
    if (!supabase || !ensureCaptchaReady()) return;

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    saveUsernameEmail(cleanUsername, cleanEmail);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          username: cleanUsername,
          full_name: name.trim(),
          name: name.trim(),
        },
        emailRedirectTo: window.location.origin,
        ...buildCaptchaOptions(),
      },
    });

    if (signUpError) {
      setTurnstileToken(null);
      throw signUpError;
    }

    if (data.session) {
      await uploadAvatar();
      goHome();
      return;
    }

    setMessage('Код подтверждения отправлен на почту. Введите его ниже.');
    setMode('verify-signup');
    setTurnstileToken(null);
  };

  const handleVerifySignup = async () => {
    if (!supabase) return;

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: 'signup',
    });

    if (verifyError) throw verifyError;

    await uploadAvatar();
    setMessage('Почта подтверждена. Аккаунт активирован.');
    setTimeout(goHome, 700);
  };

  const handleForgot = async () => {
    if (!supabase || !ensureCaptchaReady()) return;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: window.location.origin,
      captchaToken: turnstileToken ?? undefined,
    });

    if (resetError) {
      setTurnstileToken(null);
      throw resetError;
    }

    setMessage('Код восстановления отправлен на почту.');
    setMode('verify-recovery');
    setTurnstileToken(null);
  };

  const handleVerifyRecovery = async () => {
    if (!supabase) return;

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: 'recovery',
    });

    if (verifyError) throw verifyError;

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) throw updateError;

    setMessage('Пароль обновлён. Вход выполнен.');
    setTimeout(goHome, 700);
  };

  const handleGoogle = async () => {
    if (!supabase) return;

    resetStatus();
    setIsLoading(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    setIsLoading(false);

    if (oauthError) setError(oauthError.message);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetStatus();
    setIsLoading(true);

    try {
      if (mode === 'login') await handleLogin();
      else if (mode === 'register') await handleRegister();
      else if (mode === 'verify-signup') await handleVerifySignup();
      else if (mode === 'forgot') await handleForgot();
      else await handleVerifyRecovery();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось выполнить действие.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitLabel =
    mode === 'register'
      ? 'Создать аккаунт'
      : mode === 'verify-signup'
        ? 'Подтвердить почту'
        : mode === 'forgot'
          ? 'Отправить код'
          : mode === 'verify-recovery'
            ? 'Обновить пароль'
            : 'Войти';

  return (
    <div className="min-h-screen journal-paper px-4 py-6 text-white selection:bg-white/20 selection:text-white md:px-8">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <button
          type="button"
          onClick={goHome}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </button>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
            <Skull className="h-5 w-5 text-white/88" />
          </span>
          <div>
            <div className="font-journal text-2xl uppercase tracking-[0.12em] spooky-text">PHASMOPHOBIA</div>
            <div className="text-[8px] uppercase tracking-[0.32em] text-white/36">Справочник исследователя</div>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-10 grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(185,163,255,0.13),rgba(255,255,255,0.035)_42%,rgba(0,0,0,0.34))] p-8 shadow-[0_35px_120px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(245,158,11,0.12),transparent_30%)]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/78">
              <ShieldCheck className="h-4 w-4" />
              Безопасный вход
            </div>
            <h1 className="mt-7 max-w-xl font-journal text-5xl leading-tight text-white md:text-6xl">
              Личный профиль охотника
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">
              Отдельная страница авторизации без перекрытия журнала. Регистрация хранит логин, имя и фото в профиле Supabase.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-300/16 bg-emerald-400/8 p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] text-emerald-100/58">Google</div>
                <div className="mt-2 text-2xl font-semibold">OAuth</div>
              </div>
              <div className="rounded-2xl border border-[#b9a3ff]/18 bg-[#b9a3ff]/8 p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#d7ccff]/58">Email</div>
                <div className="mt-2 text-2xl font-semibold">Коды</div>
              </div>
              <div className="rounded-2xl border border-amber-300/18 bg-amber-300/8 p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] text-amber-100/58">CAPTCHA</div>
                <div className="mt-2 text-2xl font-semibold">{hasTurnstile ? 'Turnstile' : 'Local'}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[34px] border border-white/10 bg-[#101014]/96 shadow-[0_35px_120px_rgba(0,0,0,0.55)]">
          <div className="border-b border-white/10 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
                  Аккаунт исследователя
                </div>
                <h2 className="mt-2 font-journal text-4xl text-white">{modeTitle}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">{modeDescription}</p>
              </div>
              {user ? (
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="rounded-full border border-red-300/20 bg-red-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-50/78"
                >
                  Выйти
                </button>
              ) : null}
            </div>
          </div>

          {!isSupabaseConfigured ? (
            <div className="p-6 sm:p-8">
              <div className="rounded-[24px] border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-sm leading-7 text-amber-50/80">
                <div className="mb-2 flex items-center gap-2 font-semibold text-amber-50">
                  <AlertTriangle className="h-4 w-4" />
                  Supabase не настроен
                </div>
                Нужны `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
              {mode === 'login' ? (
                <>
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={isLoading}
                    className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/82 transition-colors hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-60"
                  >
                    <Chrome className="h-4 w-4" />
                    Войти через Google
                  </button>

                  <label className="block space-y-2">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/42">Логин</span>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                      <input
                        value={login}
                        onChange={(event) => setLogin(event.target.value)}
                        required
                        className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                        placeholder="Логин или почта"
                      />
                    </div>
                  </label>
                </>
              ) : null}

              {mode === 'register' ? (
                <div className="grid gap-4 lg:grid-cols-[1fr_170px]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/42">Логин</span>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                        <input
                          value={username}
                          onChange={(event) => setUsername(event.target.value)}
                          required
                          minLength={3}
                          pattern="[A-Za-z0-9_.-]+"
                          className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                          placeholder="hunter_01"
                        />
                      </div>
                    </label>

                    <label className="block space-y-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/42">Имя</span>
                      <div className="relative">
                        <UserPlus className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                        <input
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          required
                          minLength={2}
                          className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                          placeholder="Имя"
                        />
                      </div>
                    </label>

                    <label className="block space-y-2 sm:col-span-2">
                      <span className="text-xs uppercase tracking-[0.2em] text-white/42">Почта</span>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                        <input
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          required
                          className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                          placeholder="you@example.com"
                        />
                      </div>
                    </label>
                  </div>

                  <label className="group flex min-h-[168px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[28px] border border-dashed border-white/14 bg-white/[0.035] p-4 text-center transition-colors hover:border-[#b9a3ff]/45 hover:bg-[#b9a3ff]/8">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Предпросмотр фото"
                        className="h-20 w-20 rounded-3xl object-cover ring-1 ring-white/15"
                      />
                    ) : (
                      <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-black/25">
                        <Camera className="h-6 w-6 text-white/45" />
                      </span>
                    )}
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/58">
                      Фото профиля
                    </span>
                    <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                </div>
              ) : null}

              {mode === 'forgot' ? (
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/42">Почта</span>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                      placeholder="you@example.com"
                    />
                  </div>
                </label>
              ) : null}

              {(mode === 'login' || mode === 'register') ? (
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/42">Пароль</span>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                      className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-12 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                      placeholder="Минимум 6 символов"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/38 transition-colors hover:text-white/80"
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>
              ) : null}

              {(mode === 'verify-signup' || mode === 'verify-recovery') ? (
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/42">Код из письма</span>
                  <div className="relative">
                    <MailCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                    <input
                      inputMode="numeric"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      required
                      className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                      placeholder="6 цифр"
                    />
                  </div>
                </label>
              ) : null}

              {mode === 'verify-recovery' ? (
                <label className="block space-y-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/42">Новый пароль</span>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      required
                      minLength={6}
                      className="h-[52px] w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                      placeholder="Новый пароль"
                    />
                  </div>
                </label>
              ) : null}

              {(mode === 'login' || mode === 'register' || mode === 'forgot') ? (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/42">
                    <ShieldCheck className="h-4 w-4 text-emerald-200/80" />
                    Защита входа
                  </div>
                  <p className="text-xs leading-5 text-white/46">
                    {hasTurnstile
                      ? 'После 7 ошибок включается Cloudflare Turnstile. Для регистрации и восстановления она включена сразу.'
                      : 'После 7 ошибок включится локальная проверка. Для настоящей CAPTCHA добавьте Cloudflare Turnstile key.'}
                  </p>
                  {shouldShowTurnstile ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
                      <Turnstile
                        siteKey={turnstileSiteKey!}
                        onSuccess={setTurnstileToken}
                        onError={() => setTurnstileToken(null)}
                        onExpire={() => setTurnstileToken(null)}
                      />
                    </div>
                  ) : null}
                  {shouldShowMathCaptcha ? (
                    <input
                      value={mathCaptchaValue}
                      onChange={(event) => setMathCaptchaValue(event.target.value)}
                      required
                      className="mt-4 h-12 w-full rounded-2xl border border-amber-300/16 bg-black/20 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                      placeholder={`${mathCaptcha.question} = ?`}
                    />
                  ) : null}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-50/82">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-50/82">
                  <div className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-white/88 disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {submitLabel}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/55">
                {mode !== 'login' ? (
                  <button type="button" onClick={() => switchMode('login')} className="transition-colors hover:text-white">
                    Войти
                  </button>
                ) : null}
                {mode !== 'register' ? (
                  <button type="button" onClick={() => switchMode('register')} className="transition-colors hover:text-white">
                    Зарегистрироваться
                  </button>
                ) : null}
                {mode !== 'forgot' && mode !== 'verify-recovery' ? (
                  <button type="button" onClick={() => switchMode('forgot')} className="transition-colors hover:text-white">
                    Забыли пароль?
                  </button>
                ) : null}
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}


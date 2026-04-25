import { FormEvent, useMemo, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import {
  AlertTriangle,
  CheckCircle2,
  Chrome,
  KeyRound,
  Loader2,
  Lock,
  LogIn,
  Mail,
  MailCheck,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import { isSupabaseConfigured, supabase, turnstileSiteKey } from '../services/supabaseClient';

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AuthMode = 'login' | 'register' | 'verify-signup' | 'forgot' | 'verify-recovery';

const FAILED_LOGIN_STORAGE_KEY = 'phasmo-auth-failed-login-count';
const CAPTCHA_AFTER_ATTEMPTS = 7;

function readFailedLoginCount() {
  const stored = Number(localStorage.getItem(FAILED_LOGIN_STORAGE_KEY) ?? '0');
  return Number.isFinite(stored) ? stored : 0;
}

function writeFailedLoginCount(value: number) {
  localStorage.setItem(FAILED_LOGIN_STORAGE_KEY, String(value));
}

function createMathCaptcha() {
  const left = Math.floor(Math.random() * 8) + 2;
  const right = Math.floor(Math.random() * 7) + 3;

  return {
    question: `${left} + ${right}`,
    answer: String(left + right),
  };
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failedLoginCount, setFailedLoginCount] = useState(() => readFailedLoginCount());
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [mathCaptcha, setMathCaptcha] = useState(() => createMathCaptcha());
  const [mathCaptchaValue, setMathCaptchaValue] = useState('');

  const needsLoginCaptcha = failedLoginCount >= CAPTCHA_AFTER_ATTEMPTS;
  const shouldShowTurnstile =
    Boolean(turnstileSiteKey) && (needsLoginCaptcha || mode === 'register' || mode === 'forgot');
  const shouldShowMathCaptcha = !turnstileSiteKey && mode === 'login' && needsLoginCaptcha;

  const title = useMemo(() => {
    switch (mode) {
      case 'register':
        return 'Регистрация';
      case 'verify-signup':
        return 'Подтверждение почты';
      case 'forgot':
        return 'Восстановление пароля';
      case 'verify-recovery':
        return 'Новый пароль';
      default:
        return 'Вход в аккаунт';
    }
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

  const buildCaptchaOptions = () => {
    if (!turnstileToken) {
      return undefined;
    }

    return { captchaToken: turnstileToken };
  };

  const handleLogin = async () => {
    if (!supabase || !ensureCaptchaReady()) {
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
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
    onOpenChange(false);
  };

  const handleRegister = async () => {
    if (!supabase || !ensureCaptchaReady()) {
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: window.location.origin,
        ...buildCaptchaOptions(),
      },
    });

    if (signUpError) {
      setTurnstileToken(null);
      throw signUpError;
    }

    if (data.session) {
      onOpenChange(false);
      return;
    }

    setMessage('Мы отправили код на почту. Введите его здесь, чтобы подтвердить аккаунт.');
    setMode('verify-signup');
    setTurnstileToken(null);
  };

  const handleVerifySignup = async () => {
    if (!supabase) {
      return;
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'signup',
    });

    if (verifyError) {
      throw verifyError;
    }

    setMessage('Почта подтверждена. Вход выполнен.');
    setTimeout(() => onOpenChange(false), 450);
  };

  const handleForgot = async () => {
    if (!supabase || !ensureCaptchaReady()) {
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
      captchaToken: turnstileToken ?? undefined,
    });

    if (resetError) {
      setTurnstileToken(null);
      throw resetError;
    }

    setMessage('Мы отправили код восстановления на почту. Введите код и новый пароль.');
    setMode('verify-recovery');
    setTurnstileToken(null);
  };

  const handleVerifyRecovery = async () => {
    if (!supabase) {
      return;
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'recovery',
    });

    if (verifyError) {
      throw verifyError;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      throw updateError;
    }

    setMessage('Пароль обновлён. Вход выполнен.');
    setTimeout(() => onOpenChange(false), 450);
  };

  const handleGoogle = async () => {
    if (!supabase) {
      return;
    }

    resetStatus();
    setIsLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    setIsLoading(false);

    if (oauthError) {
      setError(oauthError.message);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetStatus();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await handleLogin();
      } else if (mode === 'register') {
        await handleRegister();
      } else if (mode === 'verify-signup') {
        await handleVerifySignup();
      } else if (mode === 'forgot') {
        await handleForgot();
      } else {
        await handleVerifyRecovery();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось выполнить действие.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) {
    return null;
  }

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
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/72 px-4 py-8 backdrop-blur-md">
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-[30px] border border-white/10 bg-[#101014] shadow-[0_40px_140px_rgba(0,0,0,0.7)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_20%_0%,rgba(185,163,255,0.18),transparent_38%),radial-gradient(circle_at_90%_12%,rgba(34,211,238,0.10),transparent_34%)]" />

        <div className="relative border-b border-white/10 px-6 py-5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/55 transition-colors hover:text-white"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4 pr-12">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
              {mode === 'register' ? (
                <UserPlus className="h-5 w-5 text-[#b9a3ff]" />
              ) : mode === 'forgot' || mode === 'verify-recovery' ? (
                <KeyRound className="h-5 w-5 text-amber-200" />
              ) : mode === 'verify-signup' ? (
                <MailCheck className="h-5 w-5 text-emerald-200" />
              ) : (
                <LogIn className="h-5 w-5 text-[#b9a3ff]" />
              )}
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
                Аккаунт исследователя
              </div>
              <h2 className="mt-2 text-3xl font-journal text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Google OAuth, парольный вход и почтовые коды работают через Supabase Auth.
              </p>
            </div>
          </div>
        </div>

        {!isSupabaseConfigured ? (
          <div className="relative space-y-4 p-6">
            <div className="rounded-[24px] border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-sm leading-7 text-amber-50/80">
              <div className="mb-2 flex items-center gap-2 font-semibold text-amber-50">
                <AlertTriangle className="h-4 w-4" />
                Supabase ещё не настроен
              </div>
              Добавьте `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` в `.env.local` и в переменные Vercel.
              После этого регистрация, вход, Google и восстановление пароля начнут работать.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative space-y-5 p-6">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={handleGoogle}
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/82 transition-colors hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-60"
              >
                <Chrome className="h-4 w-4" />
                Войти через Google
              </button>
            ) : null}

            {mode === 'register' ? (
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/42">Имя</span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    minLength={2}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                    placeholder="Имя исследователя"
                  />
                </div>
              </label>
            ) : null}

            {mode !== 'verify-signup' && mode !== 'verify-recovery' ? (
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/42">Почта</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                    placeholder="you@example.com"
                  />
                </div>
              </label>
            ) : null}

            {mode === 'login' || mode === 'register' ? (
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/42">Пароль</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={6}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                    placeholder="Минимум 6 символов"
                  />
                </div>
              </label>
            ) : null}

            {mode === 'verify-signup' || mode === 'verify-recovery' ? (
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/42">Код из письма</span>
                <div className="relative">
                  <MailCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/32" />
                  <input
                    inputMode="numeric"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    required
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
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
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                    placeholder="Минимум 6 символов"
                  />
                </div>
              </label>
            ) : null}

            {shouldShowTurnstile ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <Turnstile siteKey={turnstileSiteKey!} onSuccess={setTurnstileToken} onError={() => setTurnstileToken(null)} />
              </div>
            ) : null}

            {shouldShowMathCaptcha ? (
              <label className="block space-y-2 rounded-2xl border border-amber-300/16 bg-amber-300/8 p-4">
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-100/60">
                  <ShieldCheck className="h-4 w-4" />
                  Проверка после 7 ошибок
                </span>
                <input
                  value={mathCaptchaValue}
                  onChange={(event) => setMathCaptchaValue(event.target.value)}
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition-colors placeholder:text-white/28 focus:border-white/22"
                  placeholder={`${mathCaptcha.question} = ?`}
                />
              </label>
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-white/88 disabled:opacity-60"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {submitLabel}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/55">
              {mode !== 'login' ? (
                <button type="button" onClick={() => switchMode('login')} className="transition-colors hover:text-white">
                  Уже есть аккаунт
                </button>
              ) : null}
              {mode !== 'register' ? (
                <button type="button" onClick={() => switchMode('register')} className="transition-colors hover:text-white">
                  Зарегистрироваться
                </button>
              ) : null}
              {mode !== 'forgot' && mode !== 'verify-recovery' ? (
                <button type="button" onClick={() => switchMode('forgot')} className="transition-colors hover:text-white">
                  Восстановить пароль
                </button>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

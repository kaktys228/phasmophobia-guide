import { LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from './AuthProvider';

function getDisplayName(user: ReturnType<typeof useAuth>['user']) {
  if (!user) {
    return '';
  }

  const metadataName = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.username;
  return metadataName || user.email || 'Аккаунт';
}

function getAvatarUrl(user: ReturnType<typeof useAuth>['user']) {
  if (!user) {
    return '';
  }

  return user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
}

export function AuthButton() {
  const { user, isAuthReady, signOut } = useAuth();
  const avatarUrl = getAvatarUrl(user);

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 max-w-[220px] items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-50/82"
          title={user.email ?? getDisplayName(user)}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-emerald-100/30" />
          ) : (
            <UserCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="truncate">{getDisplayName(user)}</span>
        </button>
        <button
          type="button"
          onClick={() => void signOut()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-colors hover:text-white"
          title="Выйти"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        window.location.hash = 'auth';
      }}
      disabled={!isAuthReady}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
    >
      <LogIn className="h-4 w-4" />
      Войти
    </button>
  );
}

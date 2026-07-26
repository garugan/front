import { type FormEvent, type ReactNode, useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UtensilsCrossed,
} from 'lucide-react';
import { executeRecaptcha } from '../services/recaptcha';

const registrationEnabled =
  import.meta.env.VITE_REGISTRATION_ENABLED === undefined ||
  import.meta.env.VITE_REGISTRATION_ENABLED.toLowerCase() === 'true';

interface LoginScreenProps {
  onLogin: (email: string, password: string, recaptchaToken: string) => Promise<void>;
  onRegister: (
    email: string,
    password: string,
    recaptchaToken: string,
    name?: string,
  ) => Promise<void>;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    if (mode === 'register' && password !== passwordConfirm) {
      setError('確認用パスワードが一致しません');
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha(mode);

      if (mode === 'login') {
        await onLogin(trimmedEmail, password, recaptchaToken);
      } else {
        await onRegister(trimmedEmail, password, recaptchaToken, trimmedName || undefined);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setError(
        message.includes('reCAPTCHA') ||
        message.includes('RECAPTCHA') ||
        message.includes('VITE_RECAPTCHA') ||
        message.includes('サーバー設定')
          ? 'reCAPTCHAの設定を確認してください'
          : message.includes('タイムアウト')
          ? '通信がタイムアウトしました。バックエンドの起動状態を確認してください'
          : mode === 'login'
          ? 'メールアドレスまたはパスワードが違います'
          : 'アカウント作成に失敗しました',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="size-full overflow-y-auto bg-gray-50">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-4 py-6 sm:px-6 md:flex-row md:items-center md:gap-8 md:py-8">
        <section className="flex-1 pb-5 pt-4 md:pb-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-100">
              <UtensilsCrossed size={25} />
            </div>
            <h1 className="text-4xl leading-tight text-gray-900 sm:text-5xl" style={{ fontWeight: 800 }}>
              <span className="text-orange-500">Band</span> Meshi
            </h1>
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
            行ったお店も、次に行きたいお店も、バンドメンバーとまとめて記録。
          </p>
        </section>

        <section className="w-full rounded-[28px] bg-white p-5 shadow-xl shadow-gray-200/60 sm:p-6 md:max-w-[420px]">
          <div className="mb-5">
            <p className="text-xs text-orange-500" style={{ fontWeight: 700 }}>
              {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
            </p>
            <h2 className="mt-1 text-2xl text-gray-900" style={{ fontWeight: 800 }}>
              {mode === 'login' ? 'ログイン' : '新規登録'}
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              {mode === 'login'
                ? '登録済みのメールアドレスで続けます'
                : '最初にアカウントを作成してください'}
            </p>
          </div>

          {registrationEnabled && (
            <div className="mb-5 grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
              {([
                ['login', 'ログイン'],
                ['register', '新規登録'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setMode(id);
                    setError(undefined);
                    setPassword('');
                    setPasswordConfirm('');
                    setShowPassword(false);
                  }}
                  className={`rounded-xl py-2.5 text-xs transition-all ${
                    mode === id ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'
                  }`}
                  style={{ fontWeight: mode === id ? 700 : 500 }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <Field label="表示名" icon={<User size={16} className="text-gray-400" />}>
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  placeholder="山田 太郎"
                />
              </Field>
            )}

            <Field label="メールアドレス" icon={<Mail size={16} className="text-gray-400" />}>
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                placeholder="you@example.com"
              />
            </Field>

            <Field label="パスワード" icon={<Lock size={16} className="text-gray-400" />}>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                placeholder={mode === 'login' ? 'パスワード' : '8文字以上'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-gray-400 active:bg-gray-100"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </Field>

            {mode === 'register' && (
              <Field label="パスワード確認" icon={<Lock size={16} className="text-gray-400" />}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  placeholder="もう一度入力"
                />
              </Field>
            )}

            {error && (
              <div className="flex items-start gap-2 rounded-2xl bg-red-50 px-3 py-3 text-xs leading-5 text-red-500">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-orange-500 py-4 text-sm text-white shadow-lg shadow-orange-100 transition active:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
              style={{ fontWeight: 700 }}
            >
              {isSubmitting ? '送信中...' : mode === 'login' ? 'ログインする' : 'アカウント作成'}
            </button>
          </form>

          <p className="mt-4 text-[10px] leading-4 text-gray-400">
            このサイトは reCAPTCHA によって保護されており、Google の{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 underline underline-offset-2"
            >
              プライバシーポリシー
            </a>
            と
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 underline underline-offset-2"
            >
              利用規約
            </a>
            が適用されます。
          </p>
        </section>
      </div>
    </div>
  );
}

function Field({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-gray-500" style={{ fontWeight: 600 }}>
        {label}
      </span>
      <span className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-3 ring-1 ring-gray-100 transition focus-within:ring-orange-100">
        {icon}
        {children}
      </span>
    </label>
  );
}

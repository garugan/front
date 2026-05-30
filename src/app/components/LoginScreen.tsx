import { FormEvent, useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import { executeRecaptcha } from '../services/recaptcha';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    if (mode === 'register' && password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha(mode);

      if (mode === 'login') {
        await onLogin(email, password, recaptchaToken);
      } else {
        await onRegister(email, password, recaptchaToken, name);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setError(
        message.includes('RECAPTCHA') || message.includes('サーバー設定')
          ? 'reCAPTCHAの設定を確認してください'
          : mode === 'login'
          ? 'メールアドレスまたはパスワードが違います'
          : 'アカウント作成に失敗しました',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 leading-tight">
            <span className="text-orange-500" style={{ fontWeight: 700 }}>Band</span>
            <span style={{ fontWeight: 700 }}> Meshi</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">お店の記録を続ける</p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
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
              }}
              className={`rounded-xl py-2 text-xs transition-all ${
                mode === id ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500'
              }`}
              style={{ fontWeight: mode === id ? 700 : 500 }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <label className="block">
              <span className="mb-1.5 block text-xs text-gray-500" style={{ fontWeight: 600 }}>
                表示名
              </span>
              <span className="flex items-center gap-2 rounded-2xl bg-white px-3 py-3 shadow-sm">
                <User size={16} className="text-gray-400" />
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  placeholder="表示名"
                />
              </span>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-xs text-gray-500" style={{ fontWeight: 600 }}>
              メールアドレス
            </span>
            <span className="flex items-center gap-2 rounded-2xl bg-white px-3 py-3 shadow-sm">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                placeholder="you@example.com"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-gray-500" style={{ fontWeight: 600 }}>
              パスワード
            </span>
            <span className="flex items-center gap-2 rounded-2xl bg-white px-3 py-3 shadow-sm">
              <Lock size={16} className="text-gray-400" />
              <input
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                placeholder="password"
              />
            </span>
          </label>

          {error && <p className="text-center text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-orange-500 py-4 text-sm text-white shadow-lg shadow-orange-100 active:bg-orange-600"
            style={{ fontWeight: 700 }}
          >
            {isSubmitting ? '送信中...' : mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>
      </div>
    </div>
  );
}

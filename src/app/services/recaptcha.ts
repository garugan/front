const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const recaptchaEnabled = parseBoolean(
  import.meta.env.VITE_RECAPTCHA_ENABLED,
  import.meta.env.PROD,
);
const recaptchaTimeoutMs = 10_000;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let scriptPromise: Promise<void> | undefined;

export async function executeRecaptcha(action: 'login' | 'register') {
  if (!recaptchaEnabled) {
    return 'recaptcha-disabled-local';
  }

  if (!isValidSiteKey(recaptchaSiteKey)) {
    throw new Error('VITE_RECAPTCHA_SITE_KEY is not configured');
  }

  await withTimeout(loadRecaptchaScript(), 'reCAPTCHAの読み込みがタイムアウトしました');

  return withTimeout(new Promise<string>((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error('reCAPTCHA is not ready'));
      return;
    }

    window.grecaptcha?.ready(() => {
      window.grecaptcha
        ?.execute(recaptchaSiteKey, { action })
        .then(resolve)
        .catch(reject);
    });
  }), 'reCAPTCHAの実行がタイムアウトしました');
}

function loadRecaptchaScript() {
  if (window.grecaptcha) {
    return Promise.resolve();
  }

  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  }).catch((error) => {
    scriptPromise = undefined;
    throw error;
  });

  return scriptPromise;
}

function isValidSiteKey(siteKey: string | undefined) {
  return Boolean(siteKey && siteKey !== 'your_recaptcha_site_key');
}

function parseBoolean(value: string | undefined, defaultValue: boolean) {
  if (value === undefined) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true';
}

function withTimeout<T>(promise: Promise<T>, message: string) {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(message));
    }, recaptchaTimeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
    }
  });
}

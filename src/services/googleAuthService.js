const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

let gisLoadPromise = null;

export function getGoogleClientId() {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
}

export function isGoogleOAuthConfigured() {
  return Boolean(getGoogleClientId());
}

export function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to decode Google JWT:', err);
    return null;
  }
}

export function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }
  if (gisLoadPromise) return gisLoadPromise;

  gisLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error('Gagal memuat Google Identity Services SDK.'));
    document.head.appendChild(script);
  });

  return gisLoadPromise;
}

export async function mountOfficialGoogleButton(containerEl, onCredential) {
  const clientId = getGoogleClientId();
  if (!clientId || !containerEl) return false;

  containerEl.innerHTML = '<span style="font-size:0.84rem;color:var(--muted);">Memuat Google Sign-In...</span>';

  try {
    const google = await loadGoogleIdentityScript();
    if (!google?.accounts?.id) {
      containerEl.innerHTML = '<span style="font-size:0.82rem;color:var(--danger);">SDK Google tidak tersedia. Pastikan koneksi internet aktif.</span>';
      return false;
    }

    google.accounts.id.initialize({
      client_id: clientId,
      ux_mode: 'popup',
      auto_select: false,
      callback: (response) => {
        if (!response?.credential) return;
        const payload = decodeJwtPayload(response.credential);
        if (payload && payload.email) {
          onCredential({
            googleId: payload.sub,
            name: payload.name || payload.email.split('@')[0],
            email: payload.email,
            picture: payload.picture || null
          });
        }
      }
    });

    containerEl.innerHTML = '';
    const targetWidth = Math.max(260, Math.min(380, containerEl.parentElement?.offsetWidth || 340));
    google.accounts.id.renderButton(containerEl, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      shape: 'pill',
      text: 'continue_with',
      logo_alignment: 'left',
      width: targetWidth
    });
    return true;
  } catch (err) {
    console.warn('Google GIS mount error:', err);
    containerEl.innerHTML = '<span style="font-size:0.82rem;color:var(--danger);">Gagal memuat tombol Google. Periksa koneksi internet atau ad-blocker browser Anda.</span>';
    return false;
  }
}

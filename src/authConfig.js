// ─── Authentik OAuth ───────────────────────────────────────────
const REAL_ISSUER = 'https://pnb-auth-stage.isupay.in/application/o/pnb/';

export const authConfig = {
  authority: REAL_ISSUER,
  client_id: 'SaDG8kozoNOUC07Uv46et8',
  redirect_uri: 'http://localhost:3000/redirected',
  post_logout_redirect_uri: 'http://localhost:3000/',
  response_type: 'code',
  scope: 'openid profile email offline_access authorities privileges user_name created adminName bankCode goauthentik.io/api',
  automaticSilentRenew: true,
  loadUserInfo: true,
  // Fix state storage issues
  silent_redirect_uri: 'http://localhost:3000/redirected',
  monitorSession: false,
  checkSessionInterval: 10,
  query_status_response_type: 'code',
  metadata: {
    issuer: REAL_ISSUER,
    authorization_endpoint: 'https://pnb-auth-stage.isupay.in/application/o/authorize/',
    token_endpoint:    'https://pnb-auth-stage.isupay.in/application/o/token/',
    userinfo_endpoint: 'https://pnb-auth-stage.isupay.in/application/o/userinfo/',
    jwks_uri:          'https://pnb-auth-stage.isupay.in/application/o/pnb/jwks/',
    end_session_endpoint: 'https://pnb-auth-stage.isupay.in/application/o/pnb/end-session/',
  },
};

// ─── App Routes ────────────────────────────────────────────────
export const ROUTES = {
  DASHBOARD:       '/dashboard',
  TRANSACTIONS:    '/transactions',
  QR_DETAILS:      '/qr-details',
  LANGUAGE_UPDATE: '/language-update',
  OAUTH_REDIRECT:  '/redirected',
  NOT_AUTH:        '/not-authenticated',
};

// ─── Assets ────────────────────────────────────────────────────
export const ASSETS = {
  PNB_LOGO: 'https://www.figma.com/api/mcp/asset/32754bc7-8b2d-4b01-b1d9-1f74f2f343db',
  UPI_LOGO: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/3840px-UPI-Logo-vector.svg.png',
};

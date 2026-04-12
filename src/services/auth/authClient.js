import { UserManager, WebStorageStateStore } from "oidc-client-ts";
const appOrigin = window.location.origin;
const authConfig = {
  authority: "https://pnb-auth-stage.isupay.in/application/o/pnb/",
  client_id: "SaDG8kozoNOUC07Uv46et8",
  redirect_uri: `${appOrigin}/redirected`,
  post_logout_redirect_uri: `${appOrigin}/login`,
  response_type: "code",
  scope: "openid profile email offline_access authorities privileges user_name created adminName bankCode goauthentik.io/api",
  userStore: new WebStorageStateStore({ store: window.localStorage })
};
const userManager = new UserManager(authConfig);
const clearOidcStorage = () => {
  [window.localStorage, window.sessionStorage].forEach((store) => {
    Object.keys(store).forEach((key) => {
      if (key.startsWith("oidc.")) {
        store.removeItem(key);
      }
    });
  });
};
const login = async () => {
  await userManager.clearStaleState();
  return userManager.signinRedirect({
    redirect_uri: authConfig.redirect_uri,
    extraQueryParams: {
      prompt: "login",
      max_age: "0"
    }
  });
};
const logout = async () => {
  await userManager.removeUser();
  await userManager.clearStaleState();
  clearOidcStorage();
  window.location.replace(authConfig.post_logout_redirect_uri);
};
const getUser = () => userManager.getUser();
const signinCallback = () => userManager.signinCallback();
export {
  authConfig,
  getUser,
  login,
  logout,
  signinCallback,
  userManager
};

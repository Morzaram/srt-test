const TOKEN_KEY = "URQL_TOKEN";
export const getToken = () => window.localStorage.getItem(TOKEN_KEY);
export const setToken = (token: any) =>
  window.localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => window.localStorage.removeItem(TOKEN_KEY);

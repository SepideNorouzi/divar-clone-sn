import api from "configs/api";
import { getCookie } from "utils/cookie";
// This file is for managing the authentication tokens.

const getNewTokens = async () => {
  const refreshtoken = getCookie("refreshToken");
  if (!refreshtoken) return;

  try {
    const response = await api.post("auth/check-refresh-token", {
      refreshtoken,
    });
    return { response };
  } catch (error) {
    return { error };
  }
};
// If the refresh token is valid, the server sends back a new pair of
// access and refresh tokens. This allows the user to stay logged in
// without having to enter their password again.

export { getNewTokens };

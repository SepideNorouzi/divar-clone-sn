import axios from "axios";

import { getNewTokens } from "services/token";
import { getCookie, setCookie } from "utils/cookie";
// Think of it as setting up a smart "middleman" for all your API requests.

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// headers: It sets the default Content-Type to application/json for all requests.

// this interceptor is for the api that is sent and sets accessToken in it.
// This part of the code intercepts every request before it's sent to the server.
api.interceptors.request.use(
  (request) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Before any request goes out, this function runs.
// It looks for an accessToken in the browser's cookies using getCookie.
// If it finds a token, it adds an Authorization header to the request.
// This saves you from having to manually add the token every time you make an authenticated API call in your components.

// the response returned, ends up here.when status code is 401 (unauthorized) it
// checks wether the retry is also false, then requests for a new accessToken.
api.interceptors.request.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(originalRequest);
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await getNewTokens();
      if (res?.response) return;
      setCookie(res.response.data);
      console.log(res);

      return api(originalRequest);
    }
  }
);
// Let's say you make an API call, but your accessToken is expired. The server responds with a 401 error.
// The interceptor catches this specific error.
// It checks if this is the first time this specific request has failed (the !originalRequest._retry check is a
// safety measure to prevent an infinite loop).
// If it is, it automatically calls getNewTokens() to get a new accessToken using the refreshToken.
// It saves the new tokens to the cookies with setCookie.
// Finally, it transparently retries the original request that failed (return api(originalRequest)).
// This time, the request interceptor will attach the new accessToken, and the request should succeed.

export default api;

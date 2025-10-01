import api from "configs/api";
import { getCookie } from "utils/cookie";
// This file is for fetching user-specific data.

const token = getCookie("accessToken");

const getProfile = () => api.get("user/whoami").then((res) => res || false);
// This function makes a GET request to the user/whoami API endpoint.
//  The server will use the token stored in the cookie (which is likely
//  automatically attached by your api configuration) to identify the user
// and send back their profile information (like name, email, etc.).

const getPosts = () => api.get("post/my");

const getAllPosts = () => api.get("");

export { getProfile, getPosts, getAllPosts };

import axios from "axios";
import { revokeTokens } from "./auth";

// Setup axios response interceptor to handle 401 errors globally
const setupAxiosInterceptor = () => {
  axios.interceptors.response.use(
    (response) => {
      // If the response is successful, just return it
      return response;
    },
    (error) => {
      // If we get a 401 error, it means authentication failed (expired/invalid token)
      if (error.response && error.response.status === 401) {
        // Clear the tokens
        revokeTokens();
        // Redirect to login with a sessionExpired parameter
        window.location.href = "/login?sessionExpired=true";
        return Promise.reject(error);
      }
      
      // If we get a 403 error, it means authorization failed (valid token but insufficient permissions)
      // Let the component handle it - don't log the user out
      
      // For other errors, reject the promise so they can be handled by the component
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptor;

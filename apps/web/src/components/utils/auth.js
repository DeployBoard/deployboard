// Short duration JWT token (5-10 min)
const getToken = () => {
  return localStorage.getItem("authToken");
};

const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Longer duration refresh token (30-60 min)
const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

const setRefreshToken = (token) => {
  localStorage.setItem("refreshToken", token);
};

const revokeTokens = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
};

export { getToken, setToken, getRefreshToken, setRefreshToken, revokeTokens };

// Short duration JWT token (5-10 min)
const getToken = () => {
  return sessionStorage.getItem("jwt");
};

const setToken = (token) => {
  sessionStorage.setItem("jwt", token);
};

// Longer duration refresh token (30-60 min)
const getRefreshToken = () => {
  return sessionStorage.getItem("refreshToken");
};

const setRefreshToken = (token) => {
  sessionStorage.setItem("refreshToken", token);
};

export { getToken, setToken, getRefreshToken, setRefreshToken };

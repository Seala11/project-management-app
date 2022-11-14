type tokenData = {
  token: string;
};

const getUserTokenLS = (key: string) => {
  const tokenLS = localStorage.getItem(key);
  if (tokenLS !== null) {
    const tokenData: tokenData = JSON.parse(tokenLS);
    return tokenData.token;
  }
};

export default getUserTokenLS;

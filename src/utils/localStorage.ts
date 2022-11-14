const getUserTokenLS = (key: string) => {
  const token = localStorage.getItem(key);
  return token !== null ? token : '';
};

export default getUserTokenLS;

export function getMsgErrorUserGet(err: string) {
  const obj: { [key: string]: string } = {
    '401': '401_SIGNIN',
    '403': '403',
    '404': '404_USER',
    DEFAULT: 'Server error',
  };

  const arr = Object.keys(obj);
  if (arr.includes(err)) {
    return 'AUTH.' + obj[err];
  } else {
    return 'AUTH.' + obj.DEFAULT;
  }
}

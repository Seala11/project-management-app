export function getMsgErrorSignin(err: string) {
  const obj: { [key: string]: string } = {
    '401': '401_SIGNIN',
    '400': '401_SIGNIN',
    DEFAULT: 'Server error',
  };

  const arr = Object.keys(obj);
  if (arr.includes(err)) {
    return 'AUTH.' + obj[err];
  } else {
    return 'AUTH.' + obj.DEFAULT;
  }
}

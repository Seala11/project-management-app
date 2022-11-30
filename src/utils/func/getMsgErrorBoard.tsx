export function getMsgErrorBoard(err: string) {
  const obj: { [key: string]: string } = {
    '400': '400_SIGNUP',
    '403': '403_USER',
    '404': '404_BOARD',
    '404_BOARD': '404_BOARD_ERROR',
    DEFAULT: 'DEFAULT',
  };

  const arr = Object.keys(obj);
  if (arr.includes(err)) {
    return 'AUTH.' + obj[err];
  } else {
    return 'AUTH.' + obj.DEFAULT;
  }
}

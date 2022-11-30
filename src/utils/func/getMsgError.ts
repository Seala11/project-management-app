import errJson from 'utils/locales/en.json';

const errObj = errJson.AUTH;
const arrErrors = Object.keys(errObj);

export function getMsgError(err: string) {
  console.log(err);

  for (const key in arrErrors) {
    if (arrErrors[key] === err) {
      console.log(arrErrors[key]);

      return 'AUTH.' + err;
    }
  }
  return 'AUTH.DEFAULT';
}

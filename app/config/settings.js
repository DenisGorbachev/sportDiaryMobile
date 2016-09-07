let METEOR_URL = 'ws://localhost:3000/websocket';
if (process.env.NODE_ENV === 'production') {
  METEOR_URL = '';
}

export const settings = {
  env: process.env.NODE_ENV,
  METEOR_URL,
};

export const dateSettings = {
  format: 'YYYY-MM-DD',
  minDate: '2016-05-01',
  maxDate: '2018-06-01',
  confirmBtnText:'Confirm',
  cancelBtnText: 'Cancel',
  mode: 'date',
  placeholder: 'select date',
}

export const API_URL = process.env.NODE_ENV === 'dev' ?
  'http://api.lostcities.local' :
  'https://api.lostcities.nickjames.io';
export const SOCKET_URL = process.env.NODE_ENV === 'dev' ?
  'http://api.lostcities.local' :
  'https://api.lostcities.nickjames.io';

export const ItemTypes = {
  FACE_UP: "face_up_card",
  FACE_DOWN: "face_down_card",
};

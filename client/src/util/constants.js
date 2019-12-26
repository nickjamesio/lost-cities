export const API_URL = proces.env.NODE_ENV === 'dev' ?
  'http://api.lostcities.local' :
  'https://api_lostcities.nickjames.io';
export const SOCKET_URL = proces.env.NODE_ENV === 'dev' ?
  'http://api.lostcities.local' :
  'https://api_lostcities.nickjames.io';


export const ItemTypes = {
  FACE_UP: "face_up_card",
  FACE_DOWN: "face_down_card",
};

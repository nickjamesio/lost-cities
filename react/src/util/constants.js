export const URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API
    : process.env.REACT_APP_DEV_API;

export const ItemTypes = {
  FACE_UP: "face_up_card",
  FACE_DOWN: "face_down_card",
};

import { API_URL } from "./constants";

export async function getGame(gid) {
  const response = await fetch(`${API_URL}/mygame/${gid}`, {
    method: "get",
    credentials: "include"
  });
  const data = await response.json();
  return { code: response.status, data };
}

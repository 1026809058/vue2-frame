import { get, post, postJson } from "@/request";

export const api = (params) => {
  return post("/api", params);
};

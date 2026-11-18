import { authClient } from "./auth-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/** Calls the Express API. Adds the Better Auth JWT automatically for protected routes. */
export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const { data } = await authClient.token();
    if (data?.token) headers.Authorization = `Bearer ${data.token}`;
  }
  let res;
  try {
    res = await fetch(`${API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error("Cannot reach the server. Check your connection and try again.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return json;
}

/** Uploads an image through the server (ImgBB key stays secret) and returns the hosted URL. */
export async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  let res;
  try {
    res = await fetch(`${API}/upload`, { method: "POST", body: form });
  } catch {
    throw new Error("Image upload failed. Check your connection.");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Image upload failed");
  return json.url;
}

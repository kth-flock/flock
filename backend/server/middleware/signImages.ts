import { RequestHandler } from "express";
import { signImageKey } from "../services/imageService";

async function signUrlHelper(value: unknown): Promise<unknown> {
  if (Array.isArray(value)) return Promise.all(value.map(signDeep));
  if (value === null || typeof value !== "object" || value instanceof Date)
    return value;

  const entries = await Promise.all(
    Object.entries(value).map(async ([key, v]) => [
      key,
      key === "imageUrl" && typeof v === "string"
        ? await signImageKey(v)
        : await signUrlHelper(v),
    ]),
  );
  return Object.fromEntries(entries);
}

// Replaces every `imageUrl` S3 key in the JSON response with a signed URL.
export const signImages: RequestHandler = (_req, res, next) => {
  const json = res.json.bind(res);
  res.json = (body) => {
    signUrlHelper(body).then(json, next);
    return res;
  };
  next();
};

export async function nominatimFetch(
  path: "search" | "reverse",
  params: Record<string, string>,
) {
  const url = new URLSearchParams(params);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/${path}?${url}`,
    {
      referrer: window.location.origin,
      referrerPolicy: "origin",
      headers: { "Accept-Language": "en" },
    },
  );
  if (!res.ok) throw new Error(`Nominatim ${path} failed`);
  return res.json();
}

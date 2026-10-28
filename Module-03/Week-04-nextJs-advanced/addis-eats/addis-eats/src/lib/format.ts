export const formatEtb = (n: number) => `ETB ${n.toLocaleString("en-US")}`;

// Explicit locale and time zone so server output never depends on the host machine.
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: "Africa/Addis_Ababa",
    dateStyle: "medium",
    timeStyle: "short",
  });
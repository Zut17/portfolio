const custom = (import.meta.env.VITE_ADMIN_PATH as string | undefined)?.replace(
  /^\/|\/$/g,
  "",
);

export const ADMIN = custom ? `/${custom}` : "/admin";

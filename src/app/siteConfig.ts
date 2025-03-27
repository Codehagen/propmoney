export const siteConfig = {
  name: "Dashboard",
  url: "https://dashboard.tremor.so",
  description: "The only dashboard you will ever need.",
  baseLinks: {
    home: "/",
    overview: "/overview",
    details: "/details",
    buildings: "/buildings",
    settings: {
      general: "/settings/general",
      billing: "/settings/billing",
      users: "/settings/users",
    },
  },
};

export type siteConfig = typeof siteConfig;

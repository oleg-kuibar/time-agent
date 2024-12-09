export interface DocSection {
  title: string;
  items: DocItem[];
}

export interface DocItem {
  title: string;
  slug: string;
  file: string;
}

export const docs: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Installation", slug: "installation", file: "guide/installation.md" },
      { title: "Configuration", slug: "configuration", file: "guide/configuration.md" },
      { title: "Time Tracking", slug: "time-tracking", file: "guide/time-tracking.md" }
    ]
  },
  {
    title: "Integrations",
    items: [
      { title: "Harvest", slug: "harvest", file: "guide/integrations/harvest.md" },
      { title: "Slack", slug: "slack", file: "guide/integrations/slack.md" }
    ]
  },
  {
    title: "API Reference",
    items: [
      { title: "REST API", slug: "api", file: "api/endpoints.md" },
      { title: "Webhooks", slug: "webhooks", file: "api/webhooks.md" }
    ]
  }
]; 
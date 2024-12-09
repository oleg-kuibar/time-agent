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
      { title: "Installation", slug: "installation", file: "installation.md" },
      { title: "Configuration", slug: "configuration", file: "configuration.md" }
    ]
  },
  {
    title: "Integrations",
    items: [
      { title: "Harvest", slug: "harvest", file: "integrations/harvest.md" },
      { title: "Slack", slug: "slack", file: "integrations/slack.md" }
    ]
  }
]; 
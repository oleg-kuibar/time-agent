import type { WebhookEventName } from "@octokit/webhooks-types";

export interface ReviewData {
  repo: string;
  pr: number;
  reviewer: string;
  timeSpent: number;
  startedAt: string;
  completedAt: string;
  comments: number;
}

export interface WebhookPayload {
  action: string;
  review: {
    id: number;
    user: {
      login: string;
    };
    submitted_at: string;
    state: 'approved' | 'changes_requested' | 'commented';
  };
  pull_request: {
    number: number;
    title: string;
    user: {
      login: string;
    };
  };
  repository: {
    full_name: string;
  };
} 
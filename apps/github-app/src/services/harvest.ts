import type { ReviewData } from '../types';

interface HarvestTimeEntry {
  project_id: string;
  task_id: string;
  spent_date: string;
  hours: number;
  notes: string;
  user_id?: string;
}

export class HarvestClient {
  private baseUrl = 'https://api.harvestapp.com/v2';
  private accountId: string;
  private accessToken: string;

  constructor() {
    this.accountId = process.env.HARVEST_ACCOUNT_ID!;
    this.accessToken = process.env.HARVEST_ACCESS_TOKEN!;
  }

  async createTimeEntry(data: ReviewData): Promise<void> {
    const hours = data.timeSpent / 60; // Convert minutes to hours
    const entry: HarvestTimeEntry = {
      project_id: process.env.HARVEST_PROJECT_ID!,
      task_id: process.env.HARVEST_TASK_ID!,
      spent_date: new Date().toISOString().split('T')[0],
      hours,
      notes: `Code review for PR #${data.pr} in ${data.repo}\nComments: ${data.comments}`
    };

    const response = await fetch(`${this.baseUrl}/time_entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Harvest-Account-ID': this.accountId,
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      throw new Error(`Failed to create Harvest time entry: ${response.statusText}`);
    }
  }
} 
import type { LucideIcon } from 'lucide-react'
import { Boxes, Clock, Slack } from 'lucide-react'

export interface Feature {
  id: string
  title: string
  description: string
  status: 'available' | 'coming-soon'
  Icon?: LucideIcon
}

export const features: Feature[] = [
  {
    id: '1',
    title: 'Weekly Time Reports',
    description:
      'Automated weekly summaries of time spent on PR reviews, with detailed breakdowns by repository and project.',
    status: 'available',
  },
  {
    id: '2',
    title: 'Harvest Integration',
    description:
      'Automatically sync PR review time with Harvest for accurate client billing and time tracking.',
    status: 'available',
    Icon: Clock,
  },
  {
    id: '3',
    title: 'Slack Notifications',
    description:
      'Get daily and weekly time tracking summaries directly in your Slack channels.',
    status: 'available',
    Icon: Slack,
  },
  {
    id: '4',
    title: 'Smart Time Detection',
    description:
      'AI-powered analysis of PR interactions to accurately estimate review and feedback time.',
    status: 'coming-soon',
  },
  {
    id: '5',
    title: 'Time Tracking Integrations',
    description:
      'Coming support for Toggl, Clockify, and other popular time tracking tools.',
    status: 'coming-soon',
    Icon: Boxes,
  },
] as const

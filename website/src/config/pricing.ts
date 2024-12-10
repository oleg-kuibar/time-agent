import type { LucideIcon } from 'lucide-react'
import { Users, Building2, Rocket } from 'lucide-react'

export interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  Icon?: LucideIcon
  highlighted?: boolean
  limits?: {
    repos?: number
    seats?: number
    retention?: string
  }
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'For public repositories and small teams',
    Icon: Users,
    features: [
      'Unlimited public repositories',
      'Up to 3 private repositories',
      'Basic PR analytics',
      'Weekly email reports',
      'Community support',
      '7-day data retention',
      'Up to 5 team members',
    ],
    limits: {
      repos: 3,
      seats: 5,
      retention: '7 days'
    }
  },
  {
    name: 'Team',
    price: '$4/user/month',
    description: 'For growing development teams',
    Icon: Building2,
    features: [
      'Everything in Free, plus:',
      'Unlimited private repositories',
      'Advanced PR metrics',
      'Custom report scheduling',
      'Slack notifications',
      'API access',
      '30-day data retention',
      'Up to 25 team members',
      'Email support',
    ],
    highlighted: true,
    limits: {
      seats: 25,
      retention: '30 days'
    }
  },
  {
    name: 'Enterprise',
    price: '$8/user/month',
    description: 'For large organizations',
    Icon: Rocket,
    features: [
      'Everything in Team, plus:',
      'Unlimited team members',
      'SAML SSO',
      'Advanced security features',
      'Custom data retention',
      'Priority support',
      'Dedicated success manager',
      'Custom contracts & SLA',
      'Audit logs',
    ],
    limits: {
      retention: 'Unlimited'
    }
  },
]

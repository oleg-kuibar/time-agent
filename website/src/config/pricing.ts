import type { LucideIcon } from 'lucide-react'

export interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  Icon?: LucideIcon
  highlighted?: boolean
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individual developers and small teams',
    features: [
      'Weekly PR time reports',
      'Up to 3 repositories',
      'Basic time tracking',
      'Email notifications',
      '7-day data retention',
    ],
  },
  {
    name: 'Pro',
    price: '$10/month',
    description: 'For growing development teams',
    features: [
      'Everything in Free',
      'Unlimited repositories',
      'Harvest integration',
      'Slack notifications',
      '30-day data retention',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Advanced analytics',
      'Unlimited data retention',
      'SSO/SAML',
      'Dedicated support',
      'SLA guarantees',
    ],
  },
]

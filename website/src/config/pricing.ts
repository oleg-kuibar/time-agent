import type { LucideIcon } from 'lucide-react'
import { Users, Building2, Rocket } from 'lucide-react'

export interface Feature {
  title: string
  tooltip?: string
  included: boolean
  highlight?: boolean
}

export interface PricingTier {
  name: string
  pricePerMonth: number
  isPerUser: boolean
  description: string
  Icon?: LucideIcon
  highlighted?: boolean
  callToAction: string
  featureCategories: {
    title: string
    features: Feature[]
  }[]
  limits: {
    repos?: number
    seats?: number
    retention?: string
  }
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    pricePerMonth: 0,
    isPerUser: false,
    description: 'For public repositories and small teams',
    Icon: Users,
    callToAction: 'Get Started',
    featureCategories: [
      {
        title: 'Core Features',
        features: [
          { 
            title: 'Unlimited public repositories',
            included: true 
          },
          { 
            title: 'Up to 3 private repositories',
            tooltip: 'Upgrade to Team plan for unlimited private repos',
            included: true 
          },
          { 
            title: 'Basic PR analytics',
            tooltip: 'View basic pull request statistics and trends',
            included: true 
          },
        ]
      },
      {
        title: 'Reporting',
        features: [
          { 
            title: 'Weekly email reports',
            tooltip: 'Automated reports sent every Monday',
            included: true 
          },
          { 
            title: 'Custom report scheduling',
            included: false 
          },
        ]
      },
      {
        title: 'Support & Security',
        features: [
          { 
            title: 'Community support',
            tooltip: 'Access to our community forums and documentation',
            included: true 
          },
          { 
            title: '7-day data retention',
            included: true 
          },
        ]
      }
    ],
    limits: {
      repos: 3,
      seats: 5,
      retention: '7 days'
    }
  },
  {
    name: 'Team',
    pricePerMonth: 4,
    isPerUser: true,
    description: 'For growing development teams',
    Icon: Building2,
    highlighted: true,
    callToAction: 'Start Free Trial',
    featureCategories: [
      {
        title: 'Core Features',
        features: [
          { 
            title: 'Everything in Free',
            included: true 
          },
          { 
            title: 'Unlimited private repositories',
            highlight: true,
            included: true 
          },
          { 
            title: 'Advanced PR metrics',
            tooltip: 'Detailed analytics including review times, merge rates, and more',
            highlight: true,
            included: true 
          },
        ]
      },
      {
        title: 'Integrations',
        features: [
          { 
            title: 'Slack notifications',
            tooltip: 'Real-time updates in your Slack channels',
            included: true 
          },
          { 
            title: 'API access',
            tooltip: 'Programmatic access to your PR data',
            included: true 
          },
        ]
      },
      {
        title: 'Support & Security',
        features: [
          { 
            title: '30-day data retention',
            included: true 
          },
          { 
            title: 'Email support',
            tooltip: 'Priority email support with 24-hour response time',
            included: true 
          },
        ]
      }
    ],
    limits: {
      seats: 25,
      retention: '30 days'
    }
  },
  {
    name: 'Enterprise',
    pricePerMonth: 8,
    isPerUser: true,
    description: 'For large organizations',
    Icon: Rocket,
    callToAction: 'Contact Sales',
    featureCategories: [
      {
        title: 'Core Features',
        features: [
          { 
            title: 'Everything in Team',
            included: true 
          },
          { 
            title: 'Unlimited team members',
            highlight: true,
            included: true 
          },
        ]
      },
      {
        title: 'Enterprise Security',
        features: [
          { 
            title: 'SAML SSO',
            tooltip: 'Single Sign-On with your identity provider',
            included: true 
          },
          { 
            title: 'Advanced security features',
            tooltip: 'Including audit logs, IP allow lists, and more',
            included: true 
          },
        ]
      },
      {
        title: 'Premium Support',
        features: [
          { 
            title: 'Custom data retention',
            included: true 
          },
          { 
            title: 'Priority support',
            tooltip: '1-hour response time during business hours',
            included: true 
          },
          { 
            title: 'Dedicated success manager',
            included: true 
          },
          { 
            title: 'Custom contracts & SLA',
            included: true 
          },
        ]
      }
    ],
    limits: {
      retention: 'Unlimited'
    }
  },
]

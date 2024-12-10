import type { PricingTier } from '@/config/pricing'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { memo } from 'react'
import { Button } from './ui/button'

const formatPrice = (tier: PricingTier) => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <div className="text-4xl font-extrabold">
        ${tier.pricePerMonth || 0}
      </div>
      <div className="text-base text-muted-foreground">
        {tier.isPerUser ? 'per user · monthly' : 'per month'}
      </div>
    </div>
  )
}

const PricingCard = memo(({ tier }: { tier: PricingTier }) => {
  return (
    <Card className={`relative flex flex-col p-6 ${tier.highlighted ? 'border-primary shadow-lg' : ''}`}>
      {tier.highlighted && (
        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
          Popular
        </span>
      )}
      <CardHeader className="text-center">
        <CardTitle>
          <span className="text-lg font-semibold">{tier.name}</span>
        </CardTitle>
        {formatPrice(tier)}
        {/* <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p> */}
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-y-4">
        <ul className="space-y-3 flex-1">
          {tier.featureCategories.map(category => (
            <li key={category.title} className="flex flex-col gap-2">
              <span className="font-semibold">{category.title}</span>
              <ul className="space-y-1">
                {category.features.map(feature => (
                  <li key={feature.title} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className={`text-sm ${feature.highlight ? 'font-bold' : ''}`}>
                      {feature.title}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <Button
          className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            tier.highlighted
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
          }`}
        >
          {tier.callToAction}
        </Button>
      </CardContent>
    </Card>
  )
})

export default PricingCard

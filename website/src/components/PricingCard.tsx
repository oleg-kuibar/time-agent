import type { PricingTier } from '@/config/pricing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Check, HelpCircle, AlertCircle } from 'lucide-react'
import { type FC } from 'react'

const formatPrice = (tier: PricingTier) => {
  if (tier.pricePerMonth === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-4xl font-extrabold">$0</div>
        <div className="text-base text-muted-foreground">forever</div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-baseline">
        <span className="text-4xl font-extrabold">${tier.pricePerMonth}</span>
      </div>
      <div className="text-base text-muted-foreground">
        {tier.isPerUser ? 'per user · monthly' : 'per month'}
      </div>
    </div>
  )
}

const FeatureTooltip: FC<{ tooltip?: string }> = ({ tooltip }) => {
  if (!tooltip) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface PricingCardProps {
  tier: PricingTier
}

const PricingCard: FC<PricingCardProps> = ({ tier }) => {
  return (
    <Card className={`relative flex flex-col ${tier.highlighted ? 'border-primary shadow-lg' : ''}`}>
      {tier.highlighted && (
        <Badge 
          variant="default"
          className="absolute -top-3 left-1/2 transform -translate-x-1/2"
        >
          Popular
        </Badge>
      )}

      <CardHeader className="text-center space-y-4">
        {tier.Icon && typeof tier.Icon === 'function' && (
          <tier.Icon className="w-8 h-8 mx-auto text-muted-foreground" />
        )}
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        {formatPrice(tier)}
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        {tier.featureCategories.map(category => (
          <div key={category.title} className="mb-6 last:mb-0">
            <h4 className="font-semibold mb-2">{category.title}</h4>
            <ul className="space-y-2">
              {category.features.map(feature => (
                <li key={feature.title} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="w-4 h-4 mt-1 text-primary shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-1 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${!feature.included ? 'text-muted-foreground italic' : ''} ${feature.highlight ? 'font-semibold' : ''}`}>
                      {feature.title}
                      {!feature.included && ' (Coming soon)'}
                    </span>
                    {feature.tooltip && <FeatureTooltip tooltip={feature.tooltip} />}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>

      <CardFooter className="pt-6">
        <Button 
          className="w-full"
          variant={tier.highlighted ? 'default' : 'secondary'}
          size="lg"
        >
          {tier.callToAction}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PricingCard
  
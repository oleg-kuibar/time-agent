import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Feature, features } from '@/config/features'
import { memo } from 'react'

const FeatureCard = memo(({ feature }: { feature: Feature }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">{feature.title}</CardTitle>
            {feature.Icon && (
              <feature.Icon
                className="w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>
          {feature.status === 'coming-soon' && (
            <Badge variant="secondary">Coming Soon</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  )
})

export default memo(() => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map(feature => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  )
})

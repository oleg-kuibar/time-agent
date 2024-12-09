import { type Feature, features } from '@/config/features';
import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeatureCard = memo(function FeatureCard({ feature }: { feature: Feature }) {
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
  );
});

export default memo(function ReportList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature) => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}); 
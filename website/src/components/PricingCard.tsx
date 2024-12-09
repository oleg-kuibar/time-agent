import { memo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import type { PricingTier } from '@/config/pricing';

const PricingCard = memo(function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <Card className={`relative flex flex-col ${tier.highlighted ? 'border-primary shadow-lg' : ''}`}>
      {tier.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
          Popular
        </span>
      )}
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col space-y-2">
            <span className="text-lg font-medium">{tier.name}</span>
            <span className="text-3xl font-bold">{tier.price}</span>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{tier.description}</p>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ul className="space-y-3 flex-1">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          className={`mt-auto w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            tier.highlighted
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
          }`}
        >
          {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
        </button>
      </CardContent>
    </Card>
  );
});

export default PricingCard; 
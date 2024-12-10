// AWS Service interfaces
export interface AWSServices {
  // Customer Management
  dynamoDB: {
    customers: CustomerTable;
    subscriptions: SubscriptionTable;
    usage: UsageTable;
  };
  
  // Authentication
  cognito: {
    userPool: string;
    clientId: string;
  };
  
  // Billing & Subscriptions
  stripe: {
    webhookSecret: string;
    priceIds: Record<string, string>;
  };
}

interface CustomerTable {
  id: string;
  email: string;
  githubOrg: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
}

interface SubscriptionTable {
  customerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'past_due' | 'canceled';
  currentPeriodEnd: string;
}

interface UsageTable {
  customerId: string;
  month: string;
  reviewCount: number;
  totalTimeSpent: number;
  harvestEntries: number;
} 
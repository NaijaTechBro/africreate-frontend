  
  export interface Subscription {
    _id: string;
    subscriber: User | string;
    creator: User | string;
    tier: SubscriptionTier | string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    autoRenew: boolean;
    paymentMethod: string;
    price: number;
    currency: string;
  }
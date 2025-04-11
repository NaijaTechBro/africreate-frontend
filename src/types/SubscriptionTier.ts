export interface SubscriptionTier {
  _id: string;
  name: string;
  price: number;
  benefits: string[];
  currency: string;
}
export interface User {
    _id: string;
    username: string;
    email: string;
    fullName?: string;
    profilePicture?: string;
    coverImage?: string;
    bio?: string;
    isCreator: boolean;
    country?: string;
    phone?: string;
    creatorDetails?: CreatorDetails;
    followers: string[];
    following: string[];
    createdAt: string;
  }
  
  export interface CreatorDetails {
    categories: string[];
    subscriptionTiers: SubscriptionTier[];
    paymentMethods: PaymentMethod[];
  }
  
  export interface SubscriptionTier {
    _id: string;
    name: string;
    price: number;
    benefits: string[];
    currency: string;
  }
  
  export interface PaymentMethod {
    type: string;
    details: any;
  }
  
  export interface Content {
    _id: string;
    creator: User | string;
    title: string;
    description?: string;
    contentType: 'image' | 'video' | 'audio' | 'text' | 'live';
    mediaUrl?: string;
    thumbnailUrl?: string;
    tags: string[];
    isExclusive: boolean;
    requiredTier?: string;
    isPaidContent: boolean;
    price?: number;
    currency?: string;
    likes: string[];
    comments: Comment[];
    views: number;
    status: 'draft' | 'published' | 'archived';
    scheduleDate?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Comment {
    user: User | string;
    text: string;
    createdAt: string;
  }
  
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
  
  export interface Payment {
    _id: string;
    payer: User | string;
    recipient: User | string;
    type: 'subscription' | 'tip' | 'pay-per-view';
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentDetails: {
      provider: string;
      transactionId: string;
      status: string;
    };
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    createdAt: string;
  }
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
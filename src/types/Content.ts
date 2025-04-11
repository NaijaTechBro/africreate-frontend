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
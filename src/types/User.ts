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
export interface News {
    creatorEmail: string;
    id?: string;
    creatorId: string;
    title: string;
    profils: string[];
    description?: string;
    picture?: string;
    pjs?: string[];
    publicationDate: Date;
    expirationDate: Date;
    isRead:boolean;
  }
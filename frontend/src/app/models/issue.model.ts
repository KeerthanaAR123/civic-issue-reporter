// src/app/models/issue.model.ts
export interface IssueLocation {
  address: string;
  geo?: {
    type: string;
    coordinates: number[]; // [lng, lat]
  };
}

export interface Issue {
  _id?: string;
  title: string;
  description: string;
  category: 'Infrastructure' | 'Sanitation' | 'Safety' | 'Environment' | 'Other';
  location: IssueLocation;        // changed from string
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  reportedBy?: { _id: string; email: string };
  reportedAt?: Date;
  resolvedAt?: Date;
  subCategory?: string;
  latitude?: number;
  longitude?: number;
  departmentId?: string;
  imageUrl?: string;
  voiceUrl?: string;
}

export interface IssueFormData {
  title: string;
  description: string;
  category: string;
  location: string;   // still address string from form
  priority: string;
  subCategory?: string;
  latitude?: number;
  longitude?: number;
  departmentId?: string;
}

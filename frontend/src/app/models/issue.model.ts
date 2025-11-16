export interface Issue {
  _id?: string;
  title: string;
  description: string;
  category: 'Infrastructure' | 'Sanitation' | 'Safety' | 'Environment' | 'Other';
  location: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  reportedBy?: {
    _id: string;
    email: string;
  };
  reportedAt?: Date;
  resolvedAt?: Date;
}

export interface IssueFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
}

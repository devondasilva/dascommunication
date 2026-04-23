export interface Project {
  id: string;
  title: string;
  category: 'Branding' | 'UI/UX' | 'Motion';
  description: string;
  imageUrl: string;
  tags: string[];
}
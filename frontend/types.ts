import { LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}

export interface CommandBlockProps {
  title?: string;
  commands: string[];
}

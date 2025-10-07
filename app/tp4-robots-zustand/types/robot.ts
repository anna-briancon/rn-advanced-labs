export type RobotType = 'industrial' | 'service' | 'medical' | 'educational' | 'other';

export interface Robot {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
}

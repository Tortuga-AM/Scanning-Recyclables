export type RecyclableType = 'plastic' | 'metal' | 'glass' | 'paper' | 'compostable' | 'unknown';

export interface RecyclableInfo {
  type: RecyclableType;
  color: string;
  instructions: string;
  examples: string[];
  tips: string[];
}

export const recyclableDatabase: Record<RecyclableType, RecyclableInfo> = {
  plastic: {
    type: 'plastic',
    color: '#3B82F6',
    instructions: 'Rinse and place in blue bin',
    examples: ['Bottles', 'Containers', 'Bags', 'Cups'],
    tips: [
      'Remove caps before recycling',
      'Rinse out food residue',
      'Flatten large items to save space',
    ],
  },
  metal: {
    type: 'metal',
    color: '#9CA3AF',
    instructions: 'Place in metal bin or blue bin',
    examples: ['Aluminum cans', 'Steel cans', 'Foil', 'Tin containers'],
    tips: [
      'Rinse cans and containers',
      'Keep lids attached',
      'Crushed cans are fine',
    ],
  },
  glass: {
    type: 'glass',
    color: '#10B981',
    instructions: 'Place in green bin or separate container',
    examples: ['Glass bottles', 'Jars', 'Drinking glasses'],
    tips: [
      'Rinse bottles and jars',
      'Remove metal lids and rubber rings',
      'Keep glass separate from other recyclables',
    ],
  },
  paper: {
    type: 'paper',
    color: '#F59E0B',
    instructions: 'Place in brown bin or paper recycling',
    examples: ['Cardboard', 'Newspapers', 'Magazines', 'Paper bags'],
    tips: [
      'Flatten cardboard boxes',
      'Remove plastic and tape',
      'Keep paper dry',
    ],
  },
  compostable: {
    type: 'compostable',
    color: '#84CC16',
    instructions: 'Place in compost bin',
    examples: ['Food scraps', 'Leaves', 'Garden waste', 'Organic matter'],
    tips: [
      'Include fruits, vegetables, and grains',
      'Avoid meat and dairy when possible',
      'Add dry materials for better composting',
    ],
  },
  unknown: {
    type: 'unknown',
    color: '#6B7280',
    instructions: 'Check local waste guidelines',
    examples: ['Unknown items'],
    tips: ['Visit your local waste facility website for more information'],
  },
};

export function getRecyclableInfo(type: RecyclableType): RecyclableInfo {
  return recyclableDatabase[type] || recyclableDatabase.unknown;
}

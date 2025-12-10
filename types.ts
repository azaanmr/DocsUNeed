export interface ChecklistItem {
  id: string;
  name: string;
  isMandatory: boolean;
  isOfflineOnly: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
  iconName?: string;
  imageUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  iconName: string;
  sections: ChecklistSection[];
}

export interface CheckedState {
  [itemId: string]: boolean;
}

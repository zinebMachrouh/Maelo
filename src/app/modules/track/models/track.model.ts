import {MusicCategory} from './enums/MusicCategory';

export interface Track {
  id: string;
  title: string;
  artist: string;
  description?: string;
  addedDate: Date;
  duration: number;
  category: MusicCategory;
  coverImage?: string;
  audioUrl: string;
  fileSize: number;
}

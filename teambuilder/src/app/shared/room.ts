import { Location } from './location';

export class Room {
    rid: number;
    rname: string;
    location?: Location[];
    current_num: number;
    total_num?: number;
    skills?: string[];
}
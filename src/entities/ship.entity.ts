import { Column, Entity, PrimaryColumn, Repository } from 'typeorm';
import { ShipType } from './ship-type';
import { getDB } from '../db';

export function _ships(): Repository<Ship> {
    return getDB().getRepository(Ship);
}

@Entity()
export class Ship {
    @PrimaryColumn()
    id: string;

    @Column()
    domain: string;

    @Column()
    type: ShipType;
}

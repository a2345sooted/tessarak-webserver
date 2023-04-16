import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ShipType } from './ship-type';

@Entity()
export class Ship {
    @PrimaryColumn()
    id: string;

    @Column()
    domain: string;

    @Column()
    type: ShipType;
}

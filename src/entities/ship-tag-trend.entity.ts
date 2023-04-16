import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Repository, UpdateDateColumn } from 'typeorm';
import { getDB } from '../db';

export function _shipTagTrends(): Repository<ShipTagTrend> {
    return getDB().getRepository(ShipTagTrend);
}

@Entity()
export class ShipTagTrend {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    shipId: string;

    @Column()
    name: string;

    @Column()
    url: string;

    @Column()
    score: number = 0;
}

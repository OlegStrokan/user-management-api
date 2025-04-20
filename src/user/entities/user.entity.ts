import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', length: 26 })
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column('text', { array: true })
  roles: string[];

  @Column('text', { array: true })
  groups: string[];
}

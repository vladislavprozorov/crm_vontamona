import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'clients' })
export class ClientEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({ type: 'varchar', length: 128, nullable: false, name: 'full_name' })
  fullName: string;

  @Column()
  email: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}

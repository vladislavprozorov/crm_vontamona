import { ClientEntity } from 'src/clients/entity/clients.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

export type RequestStatus = '1' | '2';
@Entity({ name: 'requests' })
export class RequestEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({ type: 'varchar', length: 128, nullable: false, name: 'full_name' })
  fullName: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  status: RequestStatus;

  @Column({ type: 'uuid', name: 'client_id', nullable: true })
  clientId: string;

  @ManyToOne(() => ClientEntity, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
}

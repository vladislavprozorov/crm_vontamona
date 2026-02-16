export interface Client {
  id: string;
  fullName: string;
  email: string;
  description: string;
  createdAt: string;
}

export interface CreateClientDto {
  fullName: string;
  email: string;
  description: string;
}

export interface UpdateClientDto {
  fullName: string;
  email: string;
  description: string;
}

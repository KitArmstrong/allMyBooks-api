import { UserStatusEntity } from 'src/user/entities/user-status.entity';
import { UserTypeEntity } from 'src/user/entities/user-type.entity';

export class UserRO {
  id: number;
  user_status: UserStatusEntity;
  user_type: UserTypeEntity;
  email: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}

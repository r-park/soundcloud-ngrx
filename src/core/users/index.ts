import { UserActions } from './user-actions';
import { UserService } from './user-service';


export { UserActions, UserService };
export { User, UserData, UserRecord } from './user';
export { UserEffects } from './user-effects';
export { usersReducer, UsersState } from './users-reducer';


export const USERS_PROVIDERS: any[] = [
  UserActions,
  UserService
];

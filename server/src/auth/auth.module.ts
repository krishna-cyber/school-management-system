import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/account.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { User, UserSchema } from './schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema, collection: 'account' },
      { name: Session.name, schema: SessionSchema, collection: 'session' },
      { name: User.name, schema: UserSchema, collection: 'user' },
    ]),
  ],
  controllers: [],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

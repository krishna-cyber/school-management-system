import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './schemas/account.schema';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Session } from './schemas/session.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
  ) {}

  async findOne(tenantId: string) {
    return await this.userModel.findOne({ tenantId }).exec();
  }
}

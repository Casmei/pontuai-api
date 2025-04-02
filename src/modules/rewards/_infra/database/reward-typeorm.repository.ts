
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRewardRepository } from '../../interfaces/reward.repository';
import { Reward } from '../../entities/reward.entity';
import { Tenant } from 'src/modules/tenant/entities/tenant.entity';
import { CreateRewardDto } from '../http/dtos/create-reward.dto';

@Injectable()
export class RewardRepository implements IRewardRepository {
    constructor(

    ) { }


}

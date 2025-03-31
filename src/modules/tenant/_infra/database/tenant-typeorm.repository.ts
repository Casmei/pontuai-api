import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { ITenantRepository } from './tenant.repository';
import CreateTenantDto from '../http/Dtos/create-tenant.dto';

@Injectable()
export class TenantRepository implements ITenantRepository {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
    ) { }

    async create({ cnpj, name, segment }: CreateTenantDto): Promise<Tenant> {
        const tenant = await this.tenantRepository.create({ name, segment, CNPJ: cnpj, active: true });

        console.log(tenant);
        return this.tenantRepository.save(tenant);
    }
}
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetSlugPipe implements PipeTransform {
    constructor(
        @InjectRepository(Tenant) private tenantRepository: Repository<Tenant>,
    ) { }

    async transform(slug: string) {
        const tenant = await this.tenantRepository.findOneBy({ slug });

        if (!tenant) {
            throw new BadRequestException('Tenant not found');
        }

        return tenant;
    }
}

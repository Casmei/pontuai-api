import { ApiProperty } from '@nestjs/swagger';
import { TransactionEnum } from 'src/modules/transaction/entities/transaction.entity';

export class AddPointsResponse {
    @ApiProperty({
        description: 'The unique identifier of the point transaction',
        example: 'e19decf2-7a0e-4230-8b14-a9bbf49d13fc',
    })
    id: string;

    @ApiProperty({
        description: 'The type of the point transaction (e.g., input or output)',
        example: 'input',
        enum: TransactionEnum
    })
    type: TransactionEnum;

    @ApiProperty({
        description: 'Amount of points added or removed',
        example: 100,
    })
    points: number;

    @ApiProperty({
        description: 'The customer identifier related to the point transaction',
        example: 'bb66747b-cbc0-42fe-94d1-48436b275356',
    })
    customerId: string;

    @ApiProperty({
        description: 'The reward identifier if the points are linked to a reward (null if not applicable)',
        example: null,
        nullable: true,
    })
    rewardId: string | null;

    @ApiProperty({
        description: 'The date and time the transaction was created',
        example: '2025-04-13T23:29:15.221Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'The date and time the transaction was last updated',
        example: '2025-04-13T23:29:15.221Z',
    })
    updatedAt: string;
}

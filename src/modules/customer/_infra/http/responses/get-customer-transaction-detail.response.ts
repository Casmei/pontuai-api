import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponse } from 'src/modules/transaction/_infra/http/responses/get-all-invoices.response';

export class GetCustomerTransactionDetailResponse {
    @ApiProperty({
        description: 'List of transactions performed by the customer',
        type: [TransactionResponse],
    })
    transactions: TransactionResponse[];

    @ApiProperty({
        description: 'Total points earned by the customer through input transactions',
        example: 300,
    })
    earnedPoints: number;

    @ApiProperty({
        description: 'Total points redeemed by the customer through output transactions',
        example: 150,
    })
    redeemedPoints: number;

    @ApiProperty({
        description: 'Total points that have expired',
        example: 0,
    })
    expiredPoints: number;

    @ApiProperty({
        description: 'Total points currently available for the customer',
        example: 150,
    })
    avaliablePoints: number;
}

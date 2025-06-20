import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class GetCustomerDetailResponse {
  @ApiProperty({
    description: 'Id to identify the customer',
    example: '07275dd6-940c-424a-b37e-bf2c38a1036c',
  })
  id: string

  @ApiProperty({
    description: 'Full name of the member',
    example: 'Robert Johnson',
  })
  name: string

  @ApiProperty({
    description: 'Phone number of the member',
    example: '(555) 456-7890',
  })
  phone: string

  @ApiPropertyOptional({
    description: 'Email address of the member',
    example: 'robert@example.com',
  })
  email?: string

  @ApiProperty({
    description: 'Date the member joined, in ISO format',
    example: '2023-03-22',
  })
  memberSince: Date

  @ApiProperty({
    description: 'Current status of the member (e.g., active, inactive)',
    example: 'inactive',
  })
  status: string

  @ApiPropertyOptional({
    description:
      'Tier level of the member, typically based on loyalty or engagement',
    example: 'Bronze',
  })
  tier?: string

  @ApiPropertyOptional({
    description: 'Birthdate of the member in YYYY-MM-DD format',
    example: '1978-09-30',
  })
  birthdate?: string

  @ApiPropertyOptional({
    description: 'Physical address of the member',
    example: '789 Pine St, Nowhere, USA',
  })
  address?: string

  @ApiPropertyOptional({
    description:
      'List of user preferences, such as favorite products or services',
    example: ['Ice Cream'],
    type: [String],
  })
  preferences?: string[]

  @ApiPropertyOptional({
    description:
      'Tags or labels assigned to the member for segmentation or filtering',
    example: ['New Member'],
    type: [String],
  })
  tags?: string[]
}

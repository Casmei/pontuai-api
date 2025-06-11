import { EventDispatcher } from 'src/modules/@shared/interfaces/event-dispatcher'
import { Customer } from 'src/modules/customer/entities/customer.entity'
import { Reward } from '../entities/reward.entity'

export class RedeemRewardEvent {
  constructor(private eventDispatcher: EventDispatcher) {
    this.eventDispatcher.on('reward.redeem', (data) =>
      this.handleOrderCreatedEvent(data),
    )
  }
  handleOrderCreatedEvent(payload: { customer: Customer; reward: Reward }) {
    console.log('Notificando resgate do usuário: ' + payload.customer.phone)
  }
}

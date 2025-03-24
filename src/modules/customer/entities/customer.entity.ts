type UserProperties = {
  id: string;
  name: string;
  phone: string;
};

export class Customer {
  private constructor(private props: UserProperties) {}

  static create(payload: Omit<UserProperties, 'id' | 'role'>) {
    return new Customer({
      ...payload,
      id: 'customer-id',
    });
  }

  static load(payload: UserProperties) {
    return new Customer(payload);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get phone() {
    return this.props.phone;
  }
}

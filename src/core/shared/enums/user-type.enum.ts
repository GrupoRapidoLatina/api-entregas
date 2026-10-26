export enum UserType {
  Customer = 1,
  Driver = 2,
}

export const UserTypeLabel: Record<UserType, string> = {
  [UserType.Customer]: 'Cliente',
  [UserType.Driver]: 'Motorista',
};

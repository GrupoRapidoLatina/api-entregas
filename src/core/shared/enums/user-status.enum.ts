export enum UserStatus {
  Active = 1,
  PendingDriver = 2,
}

export const UserStatusLabel: Record<UserStatus, string> = {
  [UserStatus.Active]: 'Ativo',
  [UserStatus.PendingDriver]: 'Motorista pendente',
};

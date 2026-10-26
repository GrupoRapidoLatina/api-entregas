export type JwtPayload = {
  sub: number;
  userType: number | null;
  purpose?: 'password_reset';
  email?: string;
  iat?: number;
};

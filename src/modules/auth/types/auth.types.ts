export interface JwtPayload {
  name: string;
  phone: string;
  email: string;
  custom: null;
  sub: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
  jti: string;
  scope: string;
}

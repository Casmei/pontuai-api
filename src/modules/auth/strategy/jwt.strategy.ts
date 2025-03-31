import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy as BaseStrategy,
  ExtractJwt,
  SecretOrKeyProvider,
} from 'passport-jwt';
import JwksRsa from 'jwks-rsa';
import { JwtPayload } from '../types/auth.types';
import { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(private readonly jwtService: JwtService) {
    const secretOrKeyProvider: SecretOrKeyProvider = async (
      _request,
      jwtToken: string,
      done: (arg0: null, arg1: string | null) => void
    ) => {
      try {
        const decodedToken = this.jwtService.decode(jwtToken, {
          complete: true,
        });

        const jwkClient = JwksRsa({
          jwksUri: `${env.LOGTO_BASE_URL}/oidc/jwks`,
        });

        const key = await jwkClient.getSigningKey(decodedToken.header.kid);
        const pubKey = key.getPublicKey();

        done(null, pubKey);
      } catch (error) {
        done(error, null);
      }
    };

    super({
      secretOrKeyProvider,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: env.LOGTO_AUDIENCE,
      issuer: `${env.LOGTO_BASE_URL}/oidc`,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}

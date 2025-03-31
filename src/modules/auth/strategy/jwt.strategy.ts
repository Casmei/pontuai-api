import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy as BaseStrategy,
  ExtractJwt,
  type SecretOrKeyProvider,
} from 'passport-jwt';
import JwksRsa from 'jwks-rsa';
import type { JwtPayload } from '../types/auth.types';
import type { JwtService } from '@nestjs/jwt';
import { env } from 'src/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor(private readonly jwtService: JwtService) {
    const secretOrKeyProvider: SecretOrKeyProvider = async (
      request,
      jwtToken: string,
      done
    ) => {
      try {
        const decodedToken = this.jwtService.decode(jwtToken, {
          complete: true,
        });

        console.log(decodedToken);
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

  async validate(payload: JwtPayload) {
    return payload;
  }
}

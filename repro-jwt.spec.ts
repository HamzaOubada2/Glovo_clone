import { it } from 'vitest';
import { Injectable, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './src/auth/guards/jwt-auth.guard';

const FALLBACK = 'fzifnzifiznfiznifnç_è(è"-(8837872873823))';

class FixedGuard {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: any): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const h = req.headers.authorization;
    try {
      req.user = await this.jwtService.verifyAsync(h.split(' ')[1]);
      return true;
    } catch (e: any) {
      console.log('  [FixedGuard] options.secret =', JSON.stringify((this.jwtService as any).options?.secret));
      console.log('  [FixedGuard] underlying error =', e.message);
      throw { response: { message: 'Invalid or expired token' } };
    }
  }
}

@Injectable()
class TokenIssuer {
  constructor(private jwt: JwtService) {}
  issue() {
    return this.jwt.sign({ sub: 1, email: 'a@b.c', role: 'owner' });
  }
}

function makeAuth(global: boolean) {
  @Module({
    imports: [
      JwtModule.registerAsync({
        global,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          secret: config.get<string>('JWT_SECRET') || FALLBACK,
        }),
      }),
    ],
    providers: [TokenIssuer],
    exports: [TokenIssuer],
  })
  class AuthModule {}
  return AuthModule;
}

@Module({ imports: [JwtModule, ConfigModule] })
class BuggyStores {}
@Module({ imports: [ConfigModule] })
class CleanStores {}

const mockContext = (headers: Record<string, string>) => ({
  switchToHttp: () => ({ getRequest: () => ({ headers }) }),
});

async function setup(auth: any, stores: any, guard: any) {
  const moduleRef = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }), auth, stores],
    providers: [guard as any],
  }).compile();
  const issuer = moduleRef.get(TokenIssuer);
  console.log('  [TokenIssuer] jwt options.secret =', JSON.stringify((issuer as any)?.jwt?.options?.secret) || 'n/a');
  const token = issuer.issue();
  const g = moduleRef.get(guard as any);
  const cfg = moduleRef.get(ConfigService);
  console.log('  [root ConfigService].get(JWT_SECRET) =', JSON.stringify(cfg.get('JWT_SECRET')));
  return { token, g };
}

async function run(label: string, auth: any, stores: any, guard: any) {
  const { token, g } = await setup(auth, stores, guard);
  try {
    await g.canActivate(mockContext({ authorization: 'Bearer ' + token }) as any);
    process.stdout.write(label + ' -> PASS\n');
  } catch (e: any) {
    process.stdout.write(label + ' -> REJECT (' + (e.response?.message ?? e.message) + ')\n');
  }
}

it('env set', async () => {
  process.env.JWT_SECRET = 'test-secret-123';
  await run('CURRENT + env set  ', makeAuth(false), BuggyStores, JwtAuthGuard);
});

it('env missing', async () => {
  delete process.env.JWT_SECRET;
  await run('FIXED  + env gone   ', makeAuth(true), CleanStores, FixedGuard);
});

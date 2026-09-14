process.chdir('/home/hamza-oubada/Documents/Glovo_Clone/glovo-backend');

const { Module, Controller, Post, UseGuards, Req, Get, Global } = require('./node_modules/@nestjs/common');
const { NestFactory } = require('./node_modules/@nestjs/core');
const { ConfigModule, ConfigService } = require('./node_modules/@nestjs/config');
const { JwtModule, JwtService } = require('./node_modules/@nestjs/jwt');
const { JwtAuthGuard } = require('./src/auth/guards/jwt-auth.guard');

const FALLBACK = 'fzifnzifiznfiznifn\u00e7_\u00e8(\u00e8"-(8837872873823))';

// --- Replicates AuthModule (JwtModule WITH secret + fallback) ---
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => ({
        secret: config.get('JWT_SECRET') || FALLBACK,
      }),
    }),
  ],
})
class AuthModule {}

// --- Replicates StoresModule: bare JwtModule + bare ConfigModule ---
@Controller()
class TestController {
  @UseGuards(JwtAuthGuard)
  @Post('protected')
  async protected() {
    return { ok: true };
  }
}
@Module({ imports: [JwtModule, ConfigModule], controllers: [TestController] })
class StoresModule {}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    StoresModule,
  ],
})
class AppModule {}

async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });

  // sign a token the same way AuthService does
  const jwt = app.get(JwtService);
  const token = jwt.sign({ sub: 1, email: 'a@b.c', role: 'owner' });
  console.log('JWT_SECRET from env:', JSON.stringify(process.env.JWT_SECRET));

  let res = await app.getHttpAdapter().getInstance().requests?.pending();

  const server = app.getHttpServer();
  const address = await app.listen(0);
  const port = address.address().port;

  for (const [label, headers] of [
    ['Bearer token', { authorization: 'Bearer ' + token }],
  ]) {
    const r = await fetch(`http://127.0.0.1:${port}/protected`, { method: 'POST', headers });
    console.log(`POST /protected with ${label} ->`, r.status, (await r.text()).slice(0, 120));
  }
  await app.close();
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });
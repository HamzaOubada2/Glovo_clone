import { CanActivate, ExecutionContext, UnauthorizedException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No Token provided or invalid format');
        }

        const token = authHeader.split(' ')[1];

        try {
            // جيب الـ secret من ConfigService أو استعمل نفس الـ Fallback
            const secret = this.configService.get<string>('JWT_SECRET') || 'fzifnzifiznfiznifnç_è(è"-(8837872873823))';
            
            const payload = await this.jwtService.verifyAsync(token, { secret });
            console.log('--- [DEBUG] Verified Payload:', payload);

            request.user = payload;
            return true;
        } catch (error) {
            console.error('--- [DEBUG] JWT Verify Error:', error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
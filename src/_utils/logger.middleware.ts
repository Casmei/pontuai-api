import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();

        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        const { method, originalUrl } = request;
        const userAgent = request.headers['user-agent'] || '';
        const ip = request.ip || request.socket.remoteAddress;

        return next.handle().pipe(
            tap(() => {
                const statusCode = response.statusCode;
                const duration = `${Date.now() - now}ms`;

                const emoji =
                    statusCode >= 500
                        ? '💥'
                        : statusCode >= 400
                            ? '⚠️'
                            : statusCode >= 300
                                ? '📦'
                                : '✅';

                const msg = `${emoji} ${method} ${originalUrl} ${statusCode} - ${duration}`;
                const details = `User-Agent: ${userAgent} | IP: ${ip}`;

                if (statusCode >= 500) {
                    this.logger.error(msg, details);
                } else if (statusCode >= 400) {
                    this.logger.warn(msg, details);
                } else {
                    this.logger.log(`${msg}`);
                }
            }),
        );
    }
}

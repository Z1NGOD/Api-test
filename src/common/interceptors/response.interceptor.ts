import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface IResponse<T> {
    statusCode: number;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IResponse<T>> | Promise<Observable<IResponse<T>>> {
        return next.handle().pipe(
            map(data => ({
                statusCode: context.switchToHttp().getResponse().statusCode,
                data,
            })),
        );
    }
}

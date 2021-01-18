
import { Request, Response, NextFunction } from 'express';


export interface ServerMiddleware {
    (req: Request, res: Response, next: NextFunction): any
}
export interface ServerHookInterface {
    [name: string]: Function
}

export interface ServerOptionsConfigInterface {
    [name: string]: any
}

export interface ServerOptionsInterface {
    config: ServerOptionsConfigInterface
}

export interface ControllerInterface {
    get(req: Request, res: Response, next: NextFunction): Promise<any>;
    getOne(req: Request, res: Response, next: NextFunction): Promise<any>;
    post(req: Request, res: Response, next: NextFunction): Promise<any>;
    put(req: Request, res: Response, next: NextFunction): Promise<any>;
    delete(req: Request, res: Response, next: NextFunction): Promise<any>;
}
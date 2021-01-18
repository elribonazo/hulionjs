import { RequestHandler } from "express";

import { Request, Response, NextFunction } from 'express';


export interface ServerMiddleware {
    (req: Response, res: Response, next: NextFunction): any
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
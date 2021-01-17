import { RequestHandler } from "express";

export interface MiddlewareInterface extends Array<RequestHandler> { };

export interface ServerHookInterface {
    [name: string]: Function
}

export interface ServerOptionsConfigInterface {
    [name: string]: any
}

export interface ServerOptionsInterface {
    config: ServerOptionsConfigInterface
}
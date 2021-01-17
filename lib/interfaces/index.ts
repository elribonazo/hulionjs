import { RequestHandler } from "express";

export interface MiddlewareInterface extends Array<RequestHandler> { };

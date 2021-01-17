export function setHook(name: any, func: any): Promise<void>;
export function setConfig(config?: {}): void;
export function loadMiddlewares(): Promise<undefined>;
export function attachController(controller: any): Promise<void>;
export function loadBeforeListen(): Promise<void>;
export function getServerAddress(options: any): Promise<{
    hostname: any;
    port: any;
}>;
export function listen(options: any): Promise<any>;

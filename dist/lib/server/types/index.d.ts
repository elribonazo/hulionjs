export function useRoute(url: any, method?: string, middlewares?: any[], root?: boolean): (target: any) => void;
export function useReact(App: any): (target: any) => void;
export function useResource(middleware: any): (target: any) => void;
export function api(resource: any): (target: any) => void;
export function useUrl(url: any, root?: boolean): (target: any, key: any, descriptor: any) => any;
export function useMethod(method: any): (target: any, key: any, descriptor: any) => any;
export function useMiddleware(middleware: any): (target: any, key: any, descriptor: any) => any;
export class SMWController {
}

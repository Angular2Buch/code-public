export declare class LocationStrategy {
    path(): string;
    pushState(ctx: any, title: string, url: string): void;
    forward(): void;
    back(): void;
    onPopState(fn: (_: any) => any): void;
    getBaseHref(): string;
}
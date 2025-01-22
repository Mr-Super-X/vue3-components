import { Plugin } from 'vue';
export type SFCWithInstall<T> = T & Plugin & {
    new (...args: any[]): any;
};
export declare function withInstall<T>(comp: T): SFCWithInstall<T>;

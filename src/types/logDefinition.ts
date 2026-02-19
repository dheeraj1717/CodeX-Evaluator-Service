export interface Ilog {
    timestamp: string;
    level: string;
    message: string;
    label?: string;
    source?: string;
    service?: string;
}
export declare type DataComparisonOptions = {
    toRequest?: boolean;
    nestedFields?: string[];
    strongComparison?: boolean;
};
export declare function simplifyValue(value: any): any;
export declare function getDifference<T>(originalData: Partial<T>, modifiedData: Partial<T>, options?: DataComparisonOptions): Partial<T>;

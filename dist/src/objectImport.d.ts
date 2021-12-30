declare function organizeImportedObjects(options: ObjectImportOptions): Promise<void>;
declare type ObjectImportOptions = {
    _commandFlags: unknown[];
    _status: string;
    _commandParameters: {
        authid: string;
        destinationfolder: string;
        project: string;
        scriptid: string;
        type: string;
    };
    _data: {
        errorImports: unknown[];
        failedImpots: unknown[];
        successfulImports: Array<{
            customObject: {
                id: string;
                result: {
                    code: string;
                };
                type: string;
            };
            referencedFileImportResult: {
                failedImports: unknown[];
                successfulImports: unknown[];
            };
        }>;
    };
};
export { organizeImportedObjects };

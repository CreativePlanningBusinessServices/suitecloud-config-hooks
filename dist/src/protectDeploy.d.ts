export declare function preventDeployWithoutRemote(options: DeployOptions): Promise<DeployOptions>;
export declare function preventDeployWithUncommittedChanges(options: DeployOptions): Promise<DeployOptions>;
export declare function isProd(options: DeployOptions): boolean;
declare type DeployOptions = {
    command: string;
    projectPath: string;
    arguments: Arguments;
};
declare type Arguments = {
    accountspecificvalues: string;
    authid: string;
};
export {};

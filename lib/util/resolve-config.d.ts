/**
 * Set an Default value for an specific key
 * Mostly only used internally (for the "global-x.x" packages)
 * @param key The Key the default value should be assigned to
 * @param value The Value what the default should be
 */
export declare function setDefaultValue(key: string, value: string): void;
/**
 * Traverse up the hierarchy and combine all package.json files
 * @param directory Set an custom directory to search the config in (default: process.cwd())
 */
export declare function findPackageJson(directory?: string): void;
/**
 * Resolve "variableName" with a prefix of "ENV_CONFIG_PREFIX"
 * @param variableName The variable to use
 */
export default function resolveConfig(variableName: string): string | undefined;
/**
 * Convert "1, on, yes, true" to true (otherwise false)
 * @param env The String / Environment Variable to check
 */
export declare function envToBool(env?: string): boolean;
//# sourceMappingURL=resolve-config.d.ts.map
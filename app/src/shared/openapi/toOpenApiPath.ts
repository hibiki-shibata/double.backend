export function toOpenApiPath(expressPath: string): string {
    return expressPath.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
}
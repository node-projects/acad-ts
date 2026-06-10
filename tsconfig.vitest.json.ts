{
    "extends": "./tsconfig.json",
    "compilerOptions": {
    "rootDir": ".",
        "noEmit": true,
        "types": ["node", "vitest"]
},
    "include": ["src/**/*.ts", "tests/**/*.ts"],
    "exclude": ["node_modules", "dist", "**/*.cs"]
}
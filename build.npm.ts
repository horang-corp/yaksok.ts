// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

if (Deno.args.length === 0) {
    throw new Error("Version is required");
}

await emptyDir("./npm");

await build({
    entryPoints: ["./index.ts"],
    packageManager: "pnpm",
    outDir: "./npm",
    shims: {
        // see JS docs for overview and more options
        deno: true,
    },
    scriptModule: false,
    test: false,
    package: {
        // package.json properties
        name: "@horang-corp/yaksok.ts",
        version: Deno.args[0],
        description: "Zero dependency yaksok interpreter written in TypeScript",
        license: "MIT",
        author: "horang-corp",
        repository: {
            type: "git",
            url: "git+https://github.com/horang-corp/yaksok.ts.git",
        },
        bugs: {
            url: "https://github.com/horang-corp/yaksok.ts/issues",
        },
        publishConfig: {
            registry: "https://npm.pkg.github.com",
        }
    },
    postBuild() {
        // steps to run after building and before running the tests
        Deno.copyFileSync("LICENSE", "npm/LICENSE");
        Deno.copyFileSync("README.md", "npm/README.md");
    },
});
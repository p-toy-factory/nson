#!/usr/bin/env node
// @ts-check
import { accessSync, constants, readFileSync, readdirSync } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";

try {
	accessSync("package.json", constants.R_OK);
} catch (error) {
	console.error('This script may not run in the "editor" package directory.');
	console.error(error);
	process.exit(1);
}

const packageJson = readFileSync("package.json", { encoding: "utf-8" });

if (JSON.parse(packageJson).name !== "editor") {
	console.error('This script not run in the "editor" package directory.');
	process.exit(2);
}

const assetsDirPath = path.resolve("dist/assets");
const files = readdirSync(assetsDirPath);
await Promise.all(
	files
		.filter(
			(filename) =>
				filename.endsWith(".js") && !/index|json|worker/.test(filename),
		)
		.map((filename) => path.resolve(assetsDirPath, filename))
		.map(async (filePath) => {
			await rm(filePath, {});
			console.log(`Removed ${filePath}`);
		}),
);

console.log(
	"\n",
	"If the production build is not working, please check scripts/remove-unused-monaco-loaders file.",
);

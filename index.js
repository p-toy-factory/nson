// @ts-check
const { program } = require("commander");
const { createReadStream, createWriteStream } = require("node:fs");
const { pipeline } = require("node:stream");
const { createInflateRaw, createDeflateRaw } = require("node:zlib");

const { input, output } = program
  .requiredOption("-i, --input <string>")
  .requiredOption("-o, --output <string>")
  .parse(process.argv)
  .opts();

const transformerCtor = input.endsWith(".nson")
  ? createInflateRaw
  : createDeflateRaw;

const transformer = transformerCtor({
  windowBits: 15,
});

const source = createReadStream(input);
const destination = createWriteStream(output);

pipeline(source, transformer, destination, (err) => {
  if (err) {
    console.error("An error occurred:", err);
    process.exit(1);
  } else {
    console.log("Completed.");
  }
});

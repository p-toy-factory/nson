import * as monaco from "monaco-editor";
import {
	deflateRaw,
	DeflateFunctionOptions,
	inflateRaw,
	InflateFunctionOptions,
} from "pako";
import { format } from "prettier";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import { setupMonaco } from "./setup-monaco";
import "./style.css";

setupMonaco();

const myEditor = monaco.editor.create(
	document.getElementById("editor-container")!,
	{
		automaticLayout: true,
		language: "json",
		value: JSON.stringify(
			{
				"0": "It's very important to BACKUP your nson file before editing!",
				"1": "Click 'Open' button to select nson file which you want to edit",
				"2": "nson is a type of JSON that has been encoded into binary, you may need to learn about JSON format",
				"3": "change some value",
				"4": "Click 'Save' button to apply your changes",
				"sc-0": "在编辑前备份你的 nson 文件非常重要",
				"sc-1": "点击 'Open' 按钮选择你想编辑的 nson 文件",
				"sc-2": "nson 是一种被编码成二进制的 JSON，你可能需要了解 JSON 格式",
				"sc-3": "修改一些值",
				"sc-4": "点击 'Save' 按钮应用你的修改",
			},
			null,
			"\t",
		),
	},
);

let fileHandle: FileSystemFileHandle | null = null;
const zlibOptions: DeflateFunctionOptions | InflateFunctionOptions = {
	windowBits: 15,
};

document.getElementById("button-open")!.addEventListener("click", async () => {
	[fileHandle] = await window.showOpenFilePicker();
	const file = await fileHandle.getFile();
	const nsonBuffer = await file.arrayBuffer();
	const jsonBuffer = inflateRaw(nsonBuffer, zlibOptions);
	const json = new TextDecoder().decode(jsonBuffer);
	const formattedJson = await format(json, {
		useTabs: true,
		parser: "json",
		plugins: [prettierPluginBabel, prettierPluginEstree],
	});
	myEditor.setValue(formattedJson);
});

document.getElementById("button-save")!.addEventListener("click", async () => {
	if (!fileHandle) {
		alert("Not opened file yet");
		return;
	}
	const json = myEditor.getValue();
	if (!isValidJSON(json)) {
		alert("Invalid JSON");
		return;
	}
	const writableStream = await fileHandle.createWritable();
	const nsonBuffer = deflateRaw(json, zlibOptions);
	await writableStream.write(nsonBuffer);
	await writableStream.close();
	alert("Saved");
});

function isValidJSON(str: string) {
	try {
		JSON.parse(str);
	} catch {
		return false;
	}
	return true;
}

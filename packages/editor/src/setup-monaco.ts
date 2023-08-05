import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import "monaco-editor";

export function setupMonaco() {
	self.MonacoEnvironment = {
		getWorker(_, label) {
			switch (label) {
				case "json":
					return new jsonWorker();
				case "editorWorkerService":
					return new editorWorker();
				default:
					throw new Error(`Unexpected label: ${label}`);
			}
		},
	};
}

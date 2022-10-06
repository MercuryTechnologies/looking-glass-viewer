import { buildGraph, jsonTextToGraphDef } from "./ingest";
import { View } from "./renderer";

function startup() {
  const textControl = document.getElementById("paste-json") as HTMLInputElement;

  let myView: View | undefined;

  const graphContainer = document.getElementById("sigma-container")!;
  const loading = document.getElementById("loading-indication")!;
  const failures = document.getElementById("failures")!;
  const nodeDataView = document.getElementById(
    "properties-table"
  ) as HTMLTableElement;

  async function onAcceptText(text: string) {
    loading.style.display = "block";
    setTimeout(() => onLoad(text), 0);
  }

  async function onLoad(content: string, title?: string) {
    if (myView) {
      console.log("kill");
      myView.kill();
      myView = undefined;
      console.log("done");
    }

    let graphDef;
    let graph;
    try {
      graphDef = jsonTextToGraphDef(content);
      graph = buildGraph(graphDef);
    } catch (e) {
      failures.textContent = `Failed to parse JSON, try copying it again: ${(
        e as any
      ).toString()}`;
      console.error(e);
      loading.style.display = "none";
      return;
    }

    loading.style.display = "none";
    failures.textContent = "";

    document.title = `${
      graphDef.title || title || "untitled"
    } - Looking Glass 🔎`;

    myView = new View(graph, graphContainer, nodeDataView);
  }

  textControl.addEventListener("paste", (ev) => {
    ev.preventDefault();
    const data = ev.clipboardData?.getData("text/plain");
    if (!data) {
      throw "Clipboard data is null?";
    }

    onAcceptText(data);
  });
}

startup();

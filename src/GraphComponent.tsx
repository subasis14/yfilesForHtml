// GraphComponent.tsx

import React, { useEffect, useRef } from "react";
import { GraphComponent, License, GraphModelManager } from "yfiles";
import licenseValue from "./license.json";

const GraphComponentWrapper: React.FC = () => {
  // Initialize yFiles license
  License.value = licenseValue;

  const graphComponentRef = useRef<HTMLDivElement>(null);
  let graphComponent: GraphComponent | null = null;

  // Initialize the GraphComponent on mount
  useEffect(() => {
    if (graphComponentRef.current && !graphComponent) {
      // Create a new GraphComponent instance
      graphComponent = new GraphComponent(graphComponentRef.current);

      // Create a new graph and add nodes or other initialization
      const graph = graphComponent.graph;
      graph.createNode();

      // Optionally configure other properties or behaviors of the graph component
      const graphModelManager = new GraphModelManager(graphComponent);

      // Handle cleanup on component unmount
      return () => {
        if (graphComponent) {
          graphComponent.inputMode = null; // Remove input mode to avoid memory leaks
          graphComponent.graph.clear(); // Clear graph to release resources
          // graphComponent.dispose(); // Dispose the graph component
          graphComponent = null;
        }
      };
    }
  }, []);

  // This function is similar to your helloWebpack() function
  function helloYFiles() {
    const element = document.createElement("div");
    element.innerHTML = ["Hello", "yFiles", "world"].join(" ");
    return element;
  }

  return (
    <div>
      <div
        ref={graphComponentRef}
        style={{ width: "500px", height: "400px", backgroundColor: "darkgray" }}
      ></div>
      {/* {helloYFiles()} */}
    </div>
  );
};

export default GraphComponentWrapper;

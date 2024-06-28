import { useRef, useMemo, useLayoutEffect } from "react";
import {
  GraphComponent,
  GraphEditorInputMode,
  IGraph,
  License,
  ExteriorLabelModel,
  ShapeNodeStyle,
  SolidColorFill,
  PolylineEdgeStyle,
  IArrow,
  Fill,
  DefaultLabelStyle,
  IModelItem,
  ICommand,
  INode,
  PopulateItemContextMenuEventArgs,
} from "yfiles";
import { ContextMenu } from "./ContextMenu";
import licenseData from "../license.json";
import { graphData } from "./GraphData";

License.value = licenseData;

function configureContextMenu(graphComponent: GraphComponent): void {
  const inputMode = graphComponent.inputMode as GraphEditorInputMode;

  const contextMenu = new ContextMenu(graphComponent);

  contextMenu.addOpeningEventListeners(graphComponent, (location) => {
    if (
      inputMode.contextMenuInputMode.shouldOpenMenu(
        graphComponent.toWorldFromPage(location)
      )
    ) {
      contextMenu.show(location);
    }
  });

  inputMode.addPopulateItemContextMenuListener((_, args) =>
    populateContextMenu(contextMenu, graphComponent, args)
  );

  inputMode.contextMenuInputMode.addCloseMenuListener(() => {
    contextMenu.close();
  });
}

function populateContextMenu(
  contextMenu: ContextMenu,
  graphComponent: GraphComponent,
  args: PopulateItemContextMenuEventArgs<IModelItem>
): void {
  args.showMenu = true;
  contextMenu.clearItems();

  const node = args.item instanceof INode ? args.item : null;
  updateSelection(graphComponent, node);

  if (graphComponent.selection.selectedNodes.size > 0) {
    contextMenu.addMenuItem("Cut", () =>
      ICommand.CUT.execute(null, graphComponent)
    );
    contextMenu.addMenuItem("Copy", () =>
      ICommand.COPY.execute(null, graphComponent)
    );
    contextMenu.addMenuItem("Delete", () =>
      ICommand.DELETE.execute(null, graphComponent)
    );
  } else {
    contextMenu.addMenuItem("Select all", () =>
      ICommand.SELECT_ALL.execute(null, graphComponent)
    );
    contextMenu.addMenuItem("Paste", () =>
      ICommand.PASTE.execute(args.queryLocation, graphComponent)
    );
  }
}

function updateSelection(
  graphComponent: GraphComponent,
  node: INode | null
): void {
  if (node === null) {
    graphComponent.selection.clear();
  } else if (!graphComponent.selection.selectedNodes.isSelected(node)) {
    graphComponent.selection.clear();
    graphComponent.selection.selectedNodes.setSelected(node, true);
    graphComponent.currentItem = node;
  }
}

function createSampleGraph(graph: IGraph): void {
  const nodeMap = new Map();

  graphData.nodes.forEach((node) => {
    const graphNode = graph.createNode(node.position);
    if (
      node.id === "Aqtk1_OutOfService_Wait" ||
      node.id === "1_OoS" ||
      node.id === "3_run" ||
      node.id === "Aqtk1_Run_run2" ||
      node.id === "Aqtk1_Run2_Run3" ||
      node.id === "Aqtk1_Run2_Ins" ||
      node.id === "Aqtk1_InS_Wait" ||
      node.id === "Aqtk1_InS_run" ||
      node.id === "dummy_node_aqtk1_run_below_aqtk1_ins_run" ||
      node.id === "dummy_node_aqtk1_run2_ins_below" ||
      node.id === "2_inS"
    ) {
      const customNodeStyle = new ShapeNodeStyle({
        fill: new SolidColorFill("#9D9897"),
      });
      graph.setStyle(graphNode, customNodeStyle);
      const labelModel = new ExteriorLabelModel({ insets: 5 });
      const label = graph.addLabel(graphNode, node.label);
      const labelParameter = labelModel.createParameter("east");
      graph.setLabelLayoutParameter(label, labelParameter);
    } else if (node.id === "slide") {
      const customNodeStyle = new ShapeNodeStyle({
        fill: new SolidColorFill("#9D9897"),
      });
      graph.setStyle(graphNode, customNodeStyle);
      const label = graph.addLabel(graphNode, node.label);
      graph.setStyle(
        label,
        new DefaultLabelStyle({
          textFill: Fill.WHITE,
        })
      );
    } else if (
      node.id === "Aqtk1_OoS" ||
      node.id === "Aqtk1_InS" ||
      node.id === "Aqtk1_Run" ||
      node.id === "Aqtk1_Run2" ||
      node.id === "Aqtk1_Run3"
    ) {
      const customNodeStyle = new ShapeNodeStyle({
        fill: new SolidColorFill("#E0DDDD"),
      });
      graph.setStyle(graphNode, customNodeStyle);
      graph.addLabel(graphNode, node.label);
    } else {
      graph.addLabel(graphNode, node.label);
    }

    nodeMap.set(node.id, graphNode);
  });

  graphData.edges.forEach((edge) => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    const graphEdge = graph.createEdge(sourceNode, targetNode);

    if (edge.bends) {
      edge.bends.forEach((bend) => {
        graph.addBend(graphEdge, bend);
      });
    }

    if (
      (edge.source === "dummy_node_aqtk1_ins_run_below" &&
        edge.target === "dummy_node_ins_wait_below") ||
      (edge.source === "Aqtk1_InS_Wait" &&
        edge.target === "dummy_node_aqtk1_ins_run_stop") ||
      (edge.source === "Aqtk1_Run2_Run3" &&
        edge.target === "dummy_node_aqtk1_run2_ins_to_aqtk1_run3")
    ) {
      const edgeStyle = new PolylineEdgeStyle({
        targetArrow: IArrow.NONE,
      });
      graph.setStyle(graphEdge, edgeStyle);
    }
  });
}

export function ReactGraphComponent() {
  const graphComponentContainer = useRef<HTMLDivElement>(null);

  const graphComponent = useMemo<GraphComponent>(() => {
    License.value = licenseData;
    const gc = new GraphComponent();
    gc.inputMode = new GraphEditorInputMode();

    createSampleGraph(gc.graph);
    configureContextMenu(gc);
    return gc;
  }, []);

  useLayoutEffect(() => {
    const gcContainer = graphComponentContainer.current;
    if (gcContainer) {
      gcContainer.appendChild(graphComponent.div);
      return () => {
        gcContainer.innerHTML = "";
      };
    }
  }, [graphComponentContainer, graphComponent]);

  return (
    <div
      className="graph-component-container"
      style={{ width: "800px", height: "600px" }}
      ref={graphComponentContainer}
    />
  );
}

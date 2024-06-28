import { useRef, useMemo, useLayoutEffect } from "react";
import {
  GraphComponent,
  GraphEditorInputMode,
  IGraph,
  License,
  Point,
  Rect,
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

License.value = licenseData;

const graphData = {
  nodes: [
    { id: "slide", label: "slide", position: new Rect(450, 30, 60, 30) },
    {
      id: "1_OoS",
      label: "1:OoS",
      position: new Rect(65, 100, 50, 10),
    },
    {
      id: "2_inS",
      label: "2:Ins",
      position: new Rect(325, 100, 50, 10),
    },
    {
      id: "3_run",
      label: "3:Run",
      position: new Rect(580, 100, 50, 10),
    },
    {
      id: "Aqtk1_OoS",
      label: "Aqtk1_OoS",
      position: new Rect(40, 140, 100, 30),
    },
    {
      id: "Aqtk1_InS",
      label: "Aqtk1_InS",
      position: new Rect(300, 140, 100, 30),
    },
    {
      id: "Aqtk1_Run",
      label: "Aqtk1_Run",
      position: new Rect(555, 140, 100, 30),
    },
    {
      id: "Aqtk1_OutOfService_Wait",
      label: "Aqtk1_OutOfService_Wait",
      position: new Rect(65, 190, 50, 10),
    },

    {
      id: "Aqtk1_InS_Wait",
      label: "Aqtk1_InS_Wait",
      position: new Rect(260, 220, 50, 10),
    },
    {
      id: "Aqtk1_InS_run",
      label: "Aqtk1_InS_run",
      position: new Rect(420, 220, 50, 10),
    },
    {
      id: "Aqtk1_Run2",
      label: "Aqtk1_Run2",
      position: new Rect(555, 240, 100, 30),
    },
    {
      id: "Aqtk1_Run_run2",
      label: "Aqtk1_Run_Run2",
      position: new Rect(580, 190, 50, 10),
    },
    {
      id: "Aqtk1_Run2_Run3",
      label: "Aqtk1_Run2_Run3",
      position: new Rect(500, 310, 50, 10),
    },
    {
      id: "Aqtk1_Run2_Ins",
      label: "Aqtk1_Run2_Ins",
      position: new Rect(680, 310, 50, 10),
    },
    {
      id: "Aqtk1_Run3",
      label: "Aqtk1_Run3",
      position: new Rect(580, 480, 100, 30),
    },
    {
      id: "dummy_node_ins_wait_below",
      label: "",
      position: new Rect(360, 530, 0, 0),
    },
    {
      id: "dummy_node_slide_to_aqtk1_run3",
      label: "",
      position: new Rect(450, 530, 0, 0),
    },
    {
      id: "dummy_node_slide_to_2_ins_3_run_between",
      label: "",
      position: new Rect(480, 80, 0, 0),
    },
    {
      id: "dummy_node_2_ins_to_slide",
      label: "",
      position: new Rect(350, 80, 0, 0),
    },
    {
      id: "dummy_node_aqtk1_run2_to_mid_of_aqtk1_run2_run3_and_aqtk1_run2_ins",
      label: "",
      position: new Rect(630, 390, 0, 0),
    },
    {
      id: "dummy_node_top_aqtk1_run2_to_mid_of_aqtk1_run2_run3_and_aqtk1_run2_ins",
      label: "",
      position: new Rect(605, 290, 0, 0),
    },
    {
      id: "dummy_node_aqtk1_run2_ins_to_aqtk1_run3",
      label: "",
      position: new Rect(705, 360, 0, 0),
    },
    {
      id: "dummy_node_aqtk1_run2_ins_below",
      label: "Aqtk1_Ins",
      position: new Rect(740, 345, 0, 0),
    },
    {
      id: "dummy_node_aqtk1_run_below_aqtk1_ins_run",
      label: "Aqtk1_Run",
      position: new Rect(480, 250, 0, 0),
    },
    {
      id: "dummy_node_aqtk1_ins_run_stop",
      label: "",
      position: new Rect(440, 270, 0, 0),
    },
    {
      id: "dummy_node_aqtk1_ins_run_below",
      label: "",
      position: new Rect(360, 300, 0, 0),
    },
    {
      id: "dummy_node_aqtk1_ins_run_below_aqtk1_ins_wait",
      label: "",
      position: new Rect(350, 200, 0, 0),
    },
  ],
  edges: [
    {
      source: "1_OoS",
      target: "3_run",
      bends: [new Point(90, 80), new Point(605, 80)],
    },
    {
      source: "1_OoS",
      target: "Aqtk1_OoS",
    },
    {
      source: "Aqtk1_Run2",
      target:
        "dummy_node_top_aqtk1_run2_to_mid_of_aqtk1_run2_run3_and_aqtk1_run2_ins",
    },
    {
      source: "Aqtk1_InS",
      target: "dummy_node_aqtk1_ins_run_below_aqtk1_ins_wait",
    },
    {
      source: "slide",
      target: "dummy_node_slide_to_2_ins_3_run_between",
      bends: [],
    },
    {
      source: "Aqtk1_InS_Wait",
      target: "Aqtk1_InS_run",
      bends: [new Point(285, 200), new Point(445, 200)],
    },
    {
      source: "Aqtk1_InS_Wait",
      target: "dummy_node_aqtk1_ins_run_stop",
      bends: [new Point(285, 300), new Point(440, 300)],
    },
    {
      source: "Aqtk1_Run2_Run3",
      target: "dummy_node_aqtk1_run2_ins_to_aqtk1_run3",
      bends: [new Point(525, 390), new Point(690, 390), new Point(705, 390)],
    },
    { source: "Aqtk1_OoS", target: "Aqtk1_OutOfService_Wait" },
    {
      source:
        "dummy_node_aqtk1_run2_to_mid_of_aqtk1_run2_run3_and_aqtk1_run2_ins",
      target: "Aqtk1_Run3",
    },
    {
      source: "dummy_node_2_ins_to_slide",
      target: "2_inS",
    },
    { source: "2_inS", target: "Aqtk1_InS" },
    { source: "3_run", target: "Aqtk1_Run" },
    {
      source: "Aqtk1_Run",
      target: "Aqtk1_Run_run2",
    },
    {
      source: "Aqtk1_Run_run2",
      target: "Aqtk1_Run2",
    },
    {
      source: "Aqtk1_Run2_Run3",
      target: "Aqtk1_Run2_Ins",
      bends: [new Point(525, 290), new Point(705, 290)],
    },
    {
      source: "Aqtk1_Run2_Ins",
      target: "dummy_node_aqtk1_run2_ins_below",
      bends: [new Point(705, 345)],
    },
    {
      source: "Aqtk1_InS_run",
      target: "dummy_node_aqtk1_run_below_aqtk1_ins_run",
      bends: [new Point(445, 250)],
    },
    {
      source: "dummy_node_slide_to_aqtk1_run3",
      target: "slide",
      bends: [
        new Point(450, 550),
        new Point(20, 550),
        new Point(20, 5),
        new Point(480, 5),
      ],
    },
    {
      source: "Aqtk1_OutOfService_Wait",
      target: "Aqtk1_Run3",
      bends: [new Point(90, 530), new Point(200, 530), new Point(630, 530)],
    },
    {
      source: "dummy_node_aqtk1_ins_run_below",
      target: "dummy_node_ins_wait_below",
    },
  ],
};

function configureContextMenu(graphComponent: GraphComponent): void {
  const inputMode = graphComponent.inputMode as GraphEditorInputMode;

  const contextMenu = new ContextMenu(graphComponent);
  console.log(graphComponent);
  contextMenu.addOpeningEventListeners(graphComponent, (location) => {
    if (
      inputMode.contextMenuInputMode.shouldOpenMenu(
        graphComponent.toWorldFromPage(location)
      )
    ) {
      contextMenu.show(location);
    }
  });

  inputMode.addPopulateItemContextMenuListener((sender, args) =>
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

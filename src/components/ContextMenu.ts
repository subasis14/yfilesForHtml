import { GraphComponent, Point } from "yfiles";

export class ContextMenu {
  element: HTMLElement;
  isOpen: boolean;

  constructor(graphComponent: GraphComponent) {
    const contextMenu = document.createElement("div");
    contextMenu.setAttribute("class", "demo-context-menu");
    this.element = contextMenu;
    this.isOpen = false;
  }

  addMenuItem(
    label: string,
    clickListener: ((e: MouseEvent) => void) | null
  ): HTMLElement {
    const menuItem = document.createElement("button");
    menuItem.setAttribute("class", "demo-context-menu__item");
    menuItem.innerHTML = label;
    if (clickListener !== null) {
      menuItem.addEventListener("click", clickListener, false);
    }
    this.element.appendChild(menuItem);
    return menuItem;
  }

  clearItems(): void {
    const element = this.element;
    while (element.lastChild != null) {
      element.removeChild(element.lastChild);
    }
  }

  show(location: Point): void {
    if (this.element.childElementCount <= 0) {
      return;
    }

    const style = this.element.style;
    style.setProperty("position", "absolute", "");
    style.setProperty("left", `${location.x}px`, "");
    style.setProperty("top", `${location.y}px`, "");
    if (
      document.fullscreenElement &&
      !document.fullscreenElement.contains(document.body)
    ) {
      document.fullscreenElement.appendChild(this.element);
    } else {
      document.body.appendChild(this.element);
    }

    setTimeout(() => {
      this.element.classList.add("demo-context-menu--visible");
    }, 0);
    (this.element.firstElementChild! as HTMLElement).focus();
    this.isOpen = true;
  }

  close(): void {
    const parentNode = this.element.parentNode;
    if (parentNode) {
      const contextMenuClone = this.element.cloneNode(true) as HTMLElement;
      contextMenuClone.classList.add("demo-context-menu--clone");
      parentNode.appendChild(contextMenuClone);
      setTimeout(() => {
        contextMenuClone.classList.remove("demo-context-menu--visible");

        setTimeout(() => {
          parentNode.removeChild(contextMenuClone);
        }, 300);
      }, 0);

      this.element.classList.remove("demo-context-menu--visible");
      parentNode.removeChild(this.element);
    }

    this.isOpen = false;
  }

  addOpeningEventListeners(
    graphComponent: GraphComponent,
    openingCallback: (p: Point) => void
  ): void {
    graphComponent.div.addEventListener(
      "contextmenu",
      (evt: MouseEvent): void => {
        evt.preventDefault();
        if (!this.isOpen) {
          openingCallback(new Point(evt.pageX, evt.pageY));
        }
      },
      false
    );

    let contextMenuTimer: number | undefined;
    graphComponent.addTouchDownListener((_, evt) => {
      if (!evt.device.isPrimaryDevice) {
        clearTimeout(contextMenuTimer);
        return;
      }
      contextMenuTimer = window.setTimeout(() => {
        const viewLocation = graphComponent.toViewCoordinates(evt.location);
        openingCallback(graphComponent.toPageFromView(viewLocation));
      }, 500);
    });
    graphComponent.addTouchUpListener(() => {
      clearTimeout(contextMenuTimer);
    });
  }
}

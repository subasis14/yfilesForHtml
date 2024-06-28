import { GraphComponent, Point } from "yfiles";

export class ContextMenu {
  element: HTMLElement;

  // focusInListener: (e: FocusEvent) => void;

  // blurredTimeout: number | null;
  isOpen: boolean;

  /**
   * Creates a new empty menu.
   *
   * @param graphComponent The graph component of this context menu.
   */
  constructor(graphComponent: GraphComponent) {
    const contextMenu = document.createElement("div");
    contextMenu.setAttribute("class", "demo-context-menu");
    this.element = contextMenu;
    this.isOpen = false;
  }

  /**
   * Adds a new menu entry with the given text and click-listener to this menu.
   */
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

  /**
   * Removes all menu entries and separators from this menu.
   */
  clearItems(): void {
    const element = this.element;
    while (element.lastChild != null) {
      element.removeChild(element.lastChild);
    }
  }

  /**
   * Shows this menu at the given location.
   *
   * This menu only shows if it has at least one menu item.
   *
   * @param location The location of the menu relative to the left edge of the entire
   *   document. These are typically the pageX and pageY coordinates of the contextmenu event.
   */
  show(location: Point): void {
    if (this.element.childElementCount <= 0) {
      return;
    }

    // this.element.addEventListener("focusin", this.focusInListener);
    // this.element.addEventListener("click", this.closeListener, false);

    // Set the location of this menu and append it to the body
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

    // trigger enter animation
    setTimeout(() => {
      this.element.classList.add("demo-context-menu--visible");
    }, 0);
    (this.element.firstElementChild! as HTMLElement).focus();
    this.isOpen = true;
  }

  /**
   * Closes this menu.
   */
  close(): void {
    // this.element.removeEventListener("focusin", this.focusInListener);
    // this.element.removeEventListener("click", this.closeListener, false);

    const parentNode = this.element.parentNode;
    if (parentNode) {
      // trigger fade-out animation on a clone
      const contextMenuClone = this.element.cloneNode(true) as HTMLElement;
      contextMenuClone.classList.add("demo-context-menu--clone");
      parentNode.appendChild(contextMenuClone);
      // fade the clone out, then remove it from the DOM. Both actions need to be timed.
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

  /**
   * Adds event listeners for events that should show the context menu. These listeners then call the provided
   * openingCallback function.
   *
   * Besides the obvious `contextmenu` event, we listen for long presses and the Context Menu key.
   *
   * A long touch press doesn't trigger a `contextmenu` event on all platforms therefore we listen to the
   * GraphComponent's TouchLongPress event
   *
   * The Context Menu key is not handled correctly in Chrome. In other browsers, when the Context Menu key is
   * pressed, the correct `contextmenu` event is fired but the event location is not meaningful.
   * In this case, we set a better location, centered on the given element.
   *
   * @param graphComponent The graph component of this context menu.
   * @param openingCallback This function is called when an event that should
   *   open the context menu occurred. It gets the location of the event.
   */
  addOpeningEventListeners(
    graphComponent: GraphComponent,
    openingCallback: (p: Point) => void
  ): void {
    // Listen for the contextmenu event
    // Note: On Linux based systems (e.g. Ubuntu), the contextmenu event is fired on mouse down
    // which triggers the ContextMenuInputMode before the ClickInputMode. Therefore, handling the
    // event will prevent the ItemRightClicked event from firing.
    // For more information, see https://docs.yworks.com/yfileshtml/#/kb/article/780/
    graphComponent.div.addEventListener(
      "contextmenu",
      (evt: MouseEvent): void => {
        evt.preventDefault();
        if (!this.isOpen) {
          // might be open already because of the long press event listener
          openingCallback(new Point(evt.pageX, evt.pageY));
        }
      },
      false
    );

    // Additionally add a long press listener especially for iOS, since it does not fire the contextmenu event.
    let contextMenuTimer: number | undefined;
    graphComponent.addTouchDownListener((_, evt) => {
      if (!evt.device.isPrimaryDevice) {
        // a second pointer is down, so just dismiss the context-menu event
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

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "./components";
import { initializeIcons } from '@fluentui/react/lib/Icons';

export function init(rootEl: HTMLElement): void {
    initializeIcons();
    ReactDOM.render(<Application/>, rootEl);
}

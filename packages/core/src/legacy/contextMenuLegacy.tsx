/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview This component is DEPRECATED, and the code is frozen.
 * All changes & bugfixes should be made to ContextMenu2 instead.
 */

/* eslint-disable deprecation/deprecation */

import classNames from "classnames";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { AbstractPureComponent, Classes } from "../common";
import { OverlayLifecycleProps } from "../components/overlay/overlay";
import { Popover } from "../components/popover/popover";

export interface Offset {
    left: number;
    top: number;
}

interface ContextMenuLegacyState {
    isOpen: boolean;
    isDarkTheme: boolean;
    menu?: JSX.Element;
    offset?: Offset;
    onClose?: () => void;
}

const TRANSITION_DURATION = 100;

type ContextMenuLegacyProps = OverlayLifecycleProps;

/* istanbul ignore next */
/** @deprecated use ContextMenu */
class ContextMenuLegacy extends AbstractPureComponent<ContextMenuLegacyProps, ContextMenuLegacyState> {
    public state: ContextMenuLegacyState = {
        isDarkTheme: false,
        isOpen: false,
    };

    public render() {
        // prevent right-clicking in a context menu
        const content = <div onContextMenu={this.cancelContextMenu}>{this.state.menu}</div>;
        const popoverClassName = classNames({ [Classes.DARK]: this.state.isDarkTheme });

        // HACKHACK: workaround until we have access to Popper#scheduleUpdate().
        // https://github.com/palantir/blueprint/issues/692
        // Generate key based on offset so a new Popover instance is created
        // when offset changes, to force recomputing position.
        const key = this.state.offset === undefined ? "" : `${this.state.offset.left}x${this.state.offset.top}`;

        // wrap the popover in a positioned div to make sure it is properly
        // offset on the screen.
        return (
            <div className={Classes.CONTEXT_MENU} style={this.state.offset}>
                <Popover
                    {...this.props}
                    backdropProps={{ onContextMenu: this.handleBackdropContextMenu }}
                    content={content}
                    enforceFocus={false}
                    key={key}
                    hasBackdrop={true}
                    isOpen={this.state.isOpen}
                    minimal={true}
                    rootBoundary="viewport"
                    onInteraction={this.handlePopoverInteraction}
                    placement="right-start"
                    popoverClassName={popoverClassName}
                    transitionDuration={TRANSITION_DURATION}
                >
                    <div />
                </Popover>
            </div>
        );
    }

    public show(menu: JSX.Element, offset: Offset, onClose?: () => void, isDarkTheme = false) {
        this.setState({ isOpen: true, menu, offset, onClose, isDarkTheme });
    }

    public hide() {
        this.state.onClose?.();
        this.setState({ isOpen: false, onClose: undefined });
    }

    private cancelContextMenu = (e: React.SyntheticEvent<HTMLDivElement>) => e.preventDefault();

    private handleBackdropContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        // React function to remove from the event pool, useful when using a event within a callback
        e.persist();
        e.preventDefault();
        // wait for backdrop to disappear so we can find the "real" element at event coordinates.
        // timeout duration is equivalent to transition duration so we know it's animated out.
        this.setTimeout(() => {
            // retrigger context menu event at the element beneath the backdrop.
            // if it has a `contextmenu` event handler then it'll be invoked.
            // if it doesn't, no native menu will show (at least on OSX) :(
            const newTarget = document.elementFromPoint(e.clientX, e.clientY);
            const { view, ...newEventInit } = e;
            newTarget?.dispatchEvent(new MouseEvent("contextmenu", newEventInit));
        }, TRANSITION_DURATION);
    };

    private handlePopoverInteraction = (nextOpenState: boolean) => {
        if (!nextOpenState) {
            // delay the actual hiding till the event queue clears
            // to avoid flicker of opening twice
            this.requestAnimationFrame(() => this.hide());
        }
    };
}

let contextMenuElement: HTMLElement | undefined;
let contextMenu: ContextMenuLegacy | undefined;

/**
 * Show the given menu element at the given offset from the top-left corner of the viewport.
 * The menu will appear below-right of this point and will flip to below-left if there is not enough
 * room onscreen. The optional callback will be invoked when this menu closes.
 *
 * @deprecated use ContextMenu2
 */
export function show(menu: JSX.Element, offset: Offset, onClose?: () => void, isDarkTheme?: boolean) {
    if (contextMenuElement === undefined) {
        contextMenuElement = document.createElement("div");
        contextMenuElement.classList.add(Classes.CONTEXT_MENU);
        document.body.appendChild(contextMenuElement);
        contextMenu = ReactDOM.render<ContextMenuLegacyProps>(
            <ContextMenuLegacy onClosed={remove} />,
            contextMenuElement,
        ) as ContextMenuLegacy;
    }

    contextMenu!.show(menu, offset, onClose, isDarkTheme);
}

/** Hide the open context menu. */
export function hide() {
    contextMenu?.hide();
}

/** Return whether a context menu is currently open. */
export function isOpen() {
    return contextMenu != null && contextMenu.state.isOpen;
}

function remove() {
    if (contextMenuElement != null) {
        ReactDOM.unmountComponentAtNode(contextMenuElement);
        contextMenuElement.remove();
        contextMenuElement = undefined;
        contextMenu = undefined;
    }
}

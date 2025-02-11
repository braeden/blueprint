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

import { CellCoordinate, Region, Regions } from "../../regions";

export type ContextMenuRenderer = (context: MenuContext) => JSX.Element;

export interface MenuContext {
    /**
     * Returns an array of `Region`s that represent the user-intended context
     * of this menu. If the mouse click was on a selection, the array will
     * contain all selected regions. Otherwise it will have one `Region` that
     * represents the clicked cell (the same `Region` from `getTarget`).
     */
    getRegions: () => Region[];

    /**
     * Returns the list of selected `Region` in the table, regardless of
     * where the users clicked to launch the context menu. For the user-
     * intended regions for this context, use `getRegions` instead.
     */
    getSelectedRegions: () => Region[];

    /**
     * Returns a region containing the single cell that was clicked to launch
     * this context menu.
     */
    getTarget: () => Region;

    /**
     * Returns an array containing all of the unique, potentially non-
     * contiguous, cells contained in all the regions from `getRegions`. The
     * cell coordinates are sorted by rows then columns.
     */
    getUniqueCells: () => CellCoordinate[];
}

export class MenuContextImpl implements MenuContext {
    private regions: Region[];

    constructor(
        private target: Region,
        private selectedRegions: Region[],
        private numRows: number,
        private numCols: number,
    ) {
        this.regions = Regions.overlapsRegion(selectedRegions, target) ? selectedRegions : [target];
    }

    public getTarget() {
        return this.target;
    }

    public getSelectedRegions() {
        return this.selectedRegions;
    }

    public getRegions() {
        return this.regions;
    }

    public getUniqueCells() {
        return Regions.enumerateUniqueCells(this.regions, this.numRows, this.numCols);
    }
}

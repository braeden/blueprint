/*
 * Copyright 2023 Palantir Technologies, Inc. All rights reserved.
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

import dedent from "dedent";
import * as React from "react";

import { Button, Classes, EditableText, H5, Section, SectionPanel, Switch } from "@blueprintjs/core";
import { Example, ExampleProps } from "@blueprintjs/docs-theme";
import { IconNames } from "@blueprintjs/icons";

export interface SectionExampleState {
    collapsible: boolean;
    hasDescription: boolean;
    hasIcon: boolean;
    hasMultiplePanels: boolean;
    hasRightElement: boolean;
    isCompact: boolean;
    isPanelPadded: boolean;
}

const BASIL_DESCRIPTION_TEXT = dedent`
    Ocimum basilicum, also called great basil, is a culinary herb of the family Lamiaceae (mints). It \
    is a tender plant, and is used in cuisines worldwide. In Western cuisine, the generic term "basil" \
    refers to the variety also known as sweet basil or Genovese basil. Basil is native to tropical regions \
    from Central Africa to Southeast Asia.
`;

export class SectionExample extends React.PureComponent<ExampleProps, SectionExampleState> {
    public state: SectionExampleState = {
        collapsible: false,
        hasDescription: false,
        hasIcon: false,
        hasMultiplePanels: false,
        hasRightElement: true,
        isCompact: false,
        isPanelPadded: true,
    };

    private editableTextRef = React.createRef<HTMLDivElement>();

    public render() {
        const { collapsible, hasDescription, hasIcon, hasRightElement, hasMultiplePanels, isCompact, isPanelPadded } =
            this.state;

        const options = (
            <>
                <H5>Section Props</H5>
                <Switch checked={isCompact} label="Compact" onChange={this.toggleIsCompact} />
                <Switch checked={hasIcon} label="Icon" onChange={this.toggleHasIcon} />
                <Switch checked={hasDescription} label="Description" onChange={this.toggleHasDescription} />
                <Switch checked={hasRightElement} label="Right element" onChange={this.toggleHasRightElement} />
                <Switch checked={collapsible} label="Collapsible" onChange={this.toggleCollapsible} />

                <H5>Children</H5>
                <Switch
                    checked={hasMultiplePanels}
                    label="Multiple section panels"
                    onChange={this.toggleMultiplePanels}
                />

                <H5>SectionPanel Props</H5>
                <Switch checked={isPanelPadded} label="Padded" onChange={this.togglePanelIsPadded} />
            </>
        );

        const descriptionContent = (
            <EditableText
                defaultValue={BASIL_DESCRIPTION_TEXT}
                disabled={!hasRightElement}
                elementRef={this.editableTextRef}
                multiline={true}
            />
        );

        const metadataContent = (
            <div className="metadata-panel">
                <div>
                    <span className={Classes.TEXT_MUTED}>Kingdom</span>Plantae
                </div>
                <div>
                    <span className={Classes.TEXT_MUTED}>Clade</span>Tracheophytes
                </div>
                <div>
                    <span className={Classes.TEXT_MUTED}>Family</span>Lamiaceae
                </div>
            </div>
        );

        return (
            <Example options={options} {...this.props}>
                <Section
                    compact={isCompact}
                    title="Basil"
                    subtitle={hasDescription ? "Ocimum basilicum" : undefined}
                    icon={hasIcon ? IconNames.BOOK : undefined}
                    rightElement={
                        hasRightElement ? (
                            <Button
                                minimal={true}
                                intent="primary"
                                onClick={this.handleEditContent}
                                text="Edit description"
                            />
                        ) : undefined
                    }
                    collapsible={collapsible}
                >
                    <SectionPanel padded={isPanelPadded}>{descriptionContent}</SectionPanel>
                    {hasMultiplePanels && <SectionPanel padded={isPanelPadded}>{metadataContent}</SectionPanel>}
                </Section>
            </Example>
        );
    }

    private toggleIsCompact = () => this.setState({ isCompact: !this.state.isCompact });

    private toggleHasIcon = () => this.setState({ hasIcon: !this.state.hasIcon });

    private toggleHasDescription = () => this.setState({ hasDescription: !this.state.hasDescription });

    private toggleHasRightElement = () => this.setState({ hasRightElement: !this.state.hasRightElement });

    private toggleMultiplePanels = () => this.setState({ hasMultiplePanels: !this.state.hasMultiplePanels });

    private toggleCollapsible = () => this.setState({ collapsible: !this.state.collapsible });

    private togglePanelIsPadded = () => this.setState({ isPanelPadded: !this.state.isPanelPadded });

    private handleEditContent = (event: React.MouseEvent) => {
        // prevent this event from toggling the collapse state
        event.stopPropagation();
        this.editableTextRef?.current?.focus();
    };
}

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
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

export type KeyEventMap<T = HTMLElement> = {
    /** Event handler invoked on all events */
    all?: React.KeyboardEventHandler<T>;

    /** Event handler invoked on spacebar key press */
    Space?: React.KeyboardEventHandler<T>;
} & {
    /** Map key names to specific event handlers */
    [keyCode: string]: React.KeyboardEventHandler<T>;
};

export function createKeyEventHandler<T = HTMLElement>(actions: KeyEventMap<T>, preventDefault = false) {
    return (e: React.KeyboardEvent<T>) => {
        for (const key of Object.keys(actions)) {
            const isSpacebarEvent = e.key === " ";
            if (e.key === key || (isSpacebarEvent && key === "Space")) {
                if (preventDefault) {
                    e.preventDefault();
                }
                actions[key]?.(e);
            }
        }
        actions.all?.(e);
    };
}

/** Event handler that exposes the target element's value as a boolean. */
export function handleBooleanChange(handler: (checked: boolean) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).checked);
}

/** Event handler that exposes the target element's value as a string. */
export function handleStringChange(handler: (value: string) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value);
}

/** Event handler that exposes the target element's value as an inferred generic type. */
export function handleValueChange<T>(handler: (value: T) => void) {
    return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).value as unknown as T);
}

/** Event handler that exposes the target element's value as a number. */
export function handleNumberChange(handler: (value: number) => void) {
    return handleStringChange(value => handler(+value));
}

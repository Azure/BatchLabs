import type { Form } from "./form";
import type { FormEntry } from "./form-entry";

import { FormEntryType } from "./constants";
import { FormSection } from "./form-section";
import { FormParameter } from "./form-parameter";

/**
 * Searches upwards recursively to find a form entry's direct parent form.
 * Note that this may be a subform and not the root form
 * 
 * @param entry The form entry to search for
 * @returns The direct parent form, or null if none is found
 */
export function findParentForm(entry: FormEntry): Form | null {
    if (!entry.parent) {
        return null;
    }
    if (entry.parent.isForm()) {
        return entry.parent;
    } else {
        return findParentForm(entry.parent);
    }
}

export function isFormEntry(obj: any): obj is FormEntry {
    return obj && obj.entryType && typeof obj.id === "string";
}

export function isForm(obj: any): obj is Form {
    return isFormEntry(obj) && obj.entryType === FormEntryType.Form;
}

export function isSection(obj: any): obj is FormSection {
    return isFormEntry(obj) && obj.entryType === FormEntryType.Section;
}

export function isParameter(obj: any): obj is FormParameter {
    return isFormEntry(obj) && obj.entryType === FormEntryType.Parameter;
}

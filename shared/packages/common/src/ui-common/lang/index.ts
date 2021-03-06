// Importing specific modules instead of importing all of "lodash" gives us
// better tree shaking and a smaller bundle size
import lodashCloneDeep from "lodash/cloneDeep";

export function cloneDeep<T>(target: T): T {
    return lodashCloneDeep(target) as T;
}

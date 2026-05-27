import { AbilityMap } from "./abilities";
import { Modules } from "./modules";

export type Permissions = {
    [key in Modules]?: AbilityMap[];
};
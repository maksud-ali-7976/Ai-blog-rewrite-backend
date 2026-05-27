import { Modules } from "./modules";

export const Summary = (
    modules: Modules[],
) => {
    return JSON.stringify({
        modules,
    });
};
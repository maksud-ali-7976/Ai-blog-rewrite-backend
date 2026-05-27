export enum AbilityMap {
    READ = 1,
    CREATE = 2,
    UPDATE = 3,
    DELETE = 4,
    REVIEW = 5,
    PUBLISH = 6,
}

export const abilityHttpMap = {
    GET: AbilityMap.READ,
    POST: AbilityMap.CREATE,
    PUT: AbilityMap.UPDATE,
    PATCH: AbilityMap.UPDATE,
    DELETE: AbilityMap.DELETE,
};
import { routeMap } from "src";
import { abilityHttpMap, AbilityMap } from "src/config/rabc/abilities";
import Admin from "src/models/Admin";
import JWT from "src/utils/jwt";
export const isAdminAuthenticated = async (
    Context: any,
) => {
    console.log("Admin")
    const {
        set,
        headers,
        request,
        route,
    } = Context;

    if (
        !headers?.authorization
    ) {
        set.status = 401;

        return {
            status: false,
            message:
                "Unauthorized",
            data:
                "No Access Token",
        };
    }

    const token =
        headers.authorization.replace(
            "Bearer ",
            "",
        );
    // console.log("Token", token)
    const jwt =
        JWT.verify(
            token,
        );
    // console.log("Jwt", jwt)
    if (!jwt) {
        set.status = 401;

        return {
            status: false,
            message:
                "Unauthorized",
            data:
                "Invalid Token",
        };
    }

    const { _id } =
        jwt;

    if (!_id) {
        set.status = 401;

        return {
            status: false,
            message:
                "Unauthorized",
            data:
                "Token Payload Invalid",
        };
    }

    const user =
        await Admin.findById(
            _id,
        ).populate(
            "role",
        );
    console.log("Admin", user)
    if (!user) {
        set.status = 401;

        return {
            status: false,
            message:
                "Unauthorized",
            data:
                "User Not Found",
        };
    }
    console.log("Route", route);
    console.log("Path", Context.path);
    console.log("RouteMap Keys", [...routeMap.keys()]);
    Context.user =
        user;

    const meta =
        routeMap.get(
            route ||
            Context.path,
        );
    console.log("Meta", meta)
    if (
        (user.role as any)
            ?.super_admin ||
        user?.super_admin
    ) {
        return;
    }

    if (!meta) {
        return;
    }

    const moduleId =
        `${meta.modules[0]}`;
    console.log("ModuleId", moduleId)
    const permission =
        (user.role as any)
            ?.permissions?.[
        moduleId
        ];
    console.log("Persmission", permission)
    if (!permission) {
        set.status = 403;

        return {
            status: false,
            message:
                "Lack Of Authorization",
            data: [],
        };
    }

    const method =
        request.method.toUpperCase();

    let ability =
        (abilityHttpMap as any)[method];
    console.log("Method", request.method);
    console.log("Path", Context.path);
    if (
        method === "PATCH" &&
        Context.path.includes("/publish")
    ) {
        ability = AbilityMap.PUBLISH;
    }

    if (
        method === "PATCH" &&
        Context.path.includes("/review")
    ) {
        ability = AbilityMap.REVIEW;
    }

    console.log("Ability", ability)
    if (!ability) {
        set.status = 403;

        return {
            status: false,
            message:
                "Invalid Authorization Method",
            data: [],
        };
    }

    const hasAccess =
        permission.includes(
            ability,
        );
    console.log("Has Access", hasAccess)
    if (!hasAccess) {
        set.status = 403;

        return {
            status: false,
            message:
                "Permission Denied",
            data: [],
        };
    }

    return;
};
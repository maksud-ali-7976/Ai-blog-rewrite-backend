import { routeMap } from "src";
import { abilityHttpMap } from "src/config/rabc/abilities";
import Admin from "src/models/Admin";
import JWT from "src/utils/jwt";
export const isAdminAuthenticated = async (
    Context: any,
) => {

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

    const jwt =
        JWT.verify(
            token,
        );

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

    Context.user =
        user;

    const meta =
        routeMap.get(
            route ||
            Context.path,
        );

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

    const permission =
        (user.role as any)
            ?.permissions?.[
        moduleId
        ];

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

    const ability =
        (
            abilityHttpMap as any
        )[method];

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
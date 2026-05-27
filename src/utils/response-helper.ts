export function R(
    message: String | any,
    data?: any,
    status?: boolean,
    meta?: any,
) {
    const object = {
        status: status ?? true,
        message: message,
        data: data ? data : data === null ? null : {},
        ...(meta && {
            meta: meta ?? {},
        }),
    };

    return object;
}
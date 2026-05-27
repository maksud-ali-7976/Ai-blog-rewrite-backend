// import { app } from "src";
// import { Modules } from "./modules";

// export const routeMap: Map<
// 	string,
// 	{
// 		modules: Modules[];
// 	}
// > = new Map();

// for (const route of app.routes) {
// 	const summary =
// 		route.hooks.detail?.summary;

// 	if (!summary) {
// 		continue;
// 	}

// 	try {
// 		const parsed = JSON.parse(
// 			summary,
// 		);

// 		routeMap.set(route.path, {
// 			modules:
// 				parsed.modules,
// 		});
// 	} catch (error) {
// 		console.error(
// 			"Invalid Summary:",
// 			route.path,
// 		);
// 	}
// }
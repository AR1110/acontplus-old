export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "client-sveltekit/_app",
	assets: new Set(["favicon.ico","favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.Bs3qIhOJ.js","app":"_app/immutable/entry/app.Zdg41de4.js","imports":["_app/immutable/entry/start.Bs3qIhOJ.js","_app/immutable/chunks/entry.DTXdeeiq.js","_app/immutable/chunks/scheduler.X72G1_9w.js","_app/immutable/entry/app.Zdg41de4.js","_app/immutable/chunks/scheduler.X72G1_9w.js","_app/immutable/chunks/index.B8LpvrVp.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/config/email",
				pattern: /^\/config\/email\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/inventario/motivo-discrepancia",
				pattern: /^\/inventario\/motivo-discrepancia\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/inventario/stock-fisico",
				pattern: /^\/inventario\/stock-fisico\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/restaurant/infrastructure",
				pattern: /^\/restaurant\/infrastructure\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/restaurant/products",
				pattern: /^\/restaurant\/products\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/restaurant/reports",
				pattern: /^\/restaurant\/reports\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/restaurant/[2]",
				pattern: /^\/restaurant\/([^/]+?)\/?$/,
				params: [{"name":"2","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

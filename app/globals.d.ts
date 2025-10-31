declare module "*.css" {}

// Provide a typed global cache for the mongoose connection to avoid re-connecting during dev reloads
declare global {
	// eslint-disable-next-line no-var
	var mongoose:
		| {
				conn: typeof import("mongoose") | null;
				promise: Promise<typeof import("mongoose")> | null;
			}
		| undefined;
}

export {};
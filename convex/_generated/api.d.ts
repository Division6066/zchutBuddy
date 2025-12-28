/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminUsers from "../adminUsers.js";
import type * as answers from "../answers.js";
import type * as chat from "../chat.js";
import type * as checklists from "../checklists.js";
import type * as internal_createDummyUsers from "../internal/createDummyUsers.js";
import type * as notifications from "../notifications.js";
import type * as profiles from "../profiles.js";
import type * as queries from "../queries.js";
import type * as seed from "../seed.js";
import type * as sources from "../sources.js";
import type * as subscriptions from "../subscriptions.js";
import type * as updates from "../updates.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminUsers: typeof adminUsers;
  answers: typeof answers;
  chat: typeof chat;
  checklists: typeof checklists;
  "internal/createDummyUsers": typeof internal_createDummyUsers;
  notifications: typeof notifications;
  profiles: typeof profiles;
  queries: typeof queries;
  seed: typeof seed;
  sources: typeof sources;
  subscriptions: typeof subscriptions;
  updates: typeof updates;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

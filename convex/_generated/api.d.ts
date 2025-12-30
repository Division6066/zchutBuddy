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
import type * as alerts from "../alerts.js";
import type * as chat from "../chat.js";
import type * as checklists from "../checklists.js";
import type * as internal_createDummyUsers from "../internal/createDummyUsers.js";
import type * as lib_modelConfig from "../lib/modelConfig.js";
import type * as lib_subscriptionConfig from "../lib/subscriptionConfig.js";
import type * as modelConfig from "../modelConfig.js";
import type * as savedRights from "../savedRights.js";
import type * as seed from "../seed.js";
import type * as subscriptions from "../subscriptions.js";
import type * as usageTracking from "../usageTracking.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminUsers: typeof adminUsers;
  alerts: typeof alerts;
  chat: typeof chat;
  checklists: typeof checklists;
  "internal/createDummyUsers": typeof internal_createDummyUsers;
  "lib/modelConfig": typeof lib_modelConfig;
  "lib/subscriptionConfig": typeof lib_subscriptionConfig;
  modelConfig: typeof modelConfig;
  savedRights: typeof savedRights;
  seed: typeof seed;
  subscriptions: typeof subscriptions;
  usageTracking: typeof usageTracking;
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

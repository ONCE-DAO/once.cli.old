import * as oclif from "@oclif/core";
import { finallyHandler } from "@typhonjs-oclif/core";
// import { BaseOnce } from "../../../../once.ts/dist/current/src/2_systems/Once/BaseOnce.class.js";

// declare global {
//   var ONCE: BaseOnce | undefined;
// }

/**
 * Invokes the `fvttdev` CLI with args programmatically. Deletes any environment variables loaded from before to after
 * execution.
 *
 * @param {...string} args - args to pass to CLI.
 *
 * @returns {Promise<void>}
 */
export default async function once(...args: any[]) {
  return oclif.run(args, import.meta.url).finally(finallyHandler);
}

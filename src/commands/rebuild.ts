import { Command, Flags } from "@oclif/core";
import { Once } from "../../../../../once.ts/dist/current/src/2_systems/Once.class.js";
import { EAMDGitRepository } from "../../../../../once.ts/dist/current/src/2_systems/Git/EAMDGitRepository.class";

export default class Rebuild extends Command {
  static description = "describe the command here";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {};

  static args = [{ name: "submodules" }];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Rebuild);

    if (!global.ONCE) {
      // TODO
      // ISSUE Add ONCE.cli as OnceMode
      global.ONCE = await Once.start();
    }

    if (args.name == "submodules") {
      const eamd = await ONCE?.getEAMD();
      if (eamd?.eamdPath) {
        (
          await EAMDGitRepository.getInstance.init({ baseDir: eamd.eamdPath })
        ).rebuildAllSubmodules();
      }
    }
  }
}

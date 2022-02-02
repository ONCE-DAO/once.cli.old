import { Command, Flags } from "@oclif/core";
import { Octokit } from "@octokit/rest";
import fs from "fs";
import inquirer from "inquirer";
import open from "open";

import { Submodule } from "../../../../../once.ts/dist/current/src/2_systems/Git/Submodule.class.js";

export default class Create extends Command {
  static description = "create ucpComponent";
  static examples = ["$ once create tla.EAM.MyComponent -t <githubToken>"];

  static flags = {
    token: Flags.string({ char: "t" }),
  };

  static args = [
    { name: "name", description: "component name", required: true },
  ];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Create);
    const split: string[] = args.name.split(".");
    const componentName = split.pop() || "";
    const nameSpace = split;

    flags.token && fs.writeFileSync(".token", flags.token);
    let token = fs.existsSync(".token")
      ? fs.readFileSync(".token").toString()
      : undefined;

    if (!token) {
      let answer = await inquirer.prompt([
        {
          type: "list",
          name: "tokenExist",
          message: "Hast du bereits ein Github Token",
          choices: ["ja", "nein"],
        },
      ]);

      answer.tokenExist == "nein" &&
        open("https://github.com/settings/tokens/new");
      console.log("DDD", answer);

      answer = await inquirer.prompt([
        {
          type: "input",
          name: "token",
          message: "bitte token einfügen",
        },
      ]);
      fs.writeFileSync(".token", answer.token);
      token = answer.token;
    }

    const octokit = new Octokit({
      auth: token,
    });
    console.log();

    const owners = [
      (await octokit.rest.users.getAuthenticated()).data.name,
      ...(
        await octokit.rest.orgs.listMembershipsForAuthenticatedUser()
      ).data.map((x) => x.organization.login),
    ];

    console.log(owners);
    let answer = await inquirer.prompt([
      {
        type: "list",
        name: "owner",
        message: "Wo möchtest du die Componente erstellen",
        choices: owners,
      },
    ]);

    const result = await octokit.rest.repos.createUsingTemplate({
      template_owner: "ONCE-DAO",
      template_repo: "ComponentTemplate",
      name: componentName,
      owner: answer.owner,
    });

    (
      await Submodule.addFromUrl({
        url: result.data.ssh_url,
        overwrite: { name: componentName, namespace: nameSpace.join(".") },
      })
    ).build();
  }
}

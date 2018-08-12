const fs = require("fs");
const util = require("util");
const { prompt } = require("prompts");
const app = require("../app.json");

const main = async () => {
  const [major, minor, patch] = app.expo.version
    .split(".")
    .map(n => parseInt(n, 10));

  const versionNumberCandidates = [
    `${major}.${minor}.${patch + 1}`,
    `${major}.${minor + 1}.${patch}`,
    `${major + 1}.${minor}.${patch}`
  ];

  const versionNumber = (await prompt({
    type: "select",
    name: "value",
    message: "Which version number do you bump to ?",
    choices: versionNumberCandidates.map(c => {
      return { title: c, value: c };
    })
  })).value;

  const versionCode = app.expo.android.versionCode + 1;

  const updatedAppInfo = Object.assign({}, app, {
    expo: {
      ...app.expo,
      version: versionNumber,
      android: { ...app.expo.android, versionCode }
    }
  });

  await util.promisify(fs.writeFile)(
    "app.json",
    JSON.stringify(updatedAppInfo, null, 2)
  );
};

main().then();

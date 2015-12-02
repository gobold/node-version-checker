import findParent from 'find-parent-dir';
import fs from 'fs';
import semver from 'semver';
import {
  which, exec
}
from 'shelljs';


let strictCheck = function (actualVersion, engineVersion) {
  return semver.satisfies(actualVersion, engineVersion);
};

let cleanVersion = function (version) {
  if (version) {
    return version.match(/[0-9]+(\.[0-9]+)*/)[0];
  }
};

let looseCheck = function (actualVersion, engineVersion) {
  var cleanedVer = cleanVersion(engineVersion);
  return semver.gt(actualVersion, cleanedVer);
};

let getPackageInfo = function () {
  var dir = findParent.sync(process.cwd(), 'package.json');
  if (!dir) {
    return null;
  }
  var file = fs.readFileSync(dir + '/package.json');
  if (!file) {
    return null;
  }
  return JSON.parse(file);
};

let switchVer = function (version) {
  if (which('n')) {
    var cleanedVersion = cleanVersion(version);
    console.log(`info: Switched node version to ${cleanedVersion}`);
    return exec('n ' + cleanedVersion);
  }
  throw new Error('Attempted to switch version, but n was not defined. If you want to use the --switch flag install the n manager with `npm install -g n`');
};

let checkVer = function (options) {
  options = options || {};
  var packageInfo = getPackageInfo();
  if (!packageInfo) {
    throw new Error('Could not locate package.json in the current directory structure.');
  }
  var engineVersion = packageInfo.engines.node;
  var check = options.loose ? looseCheck : strictCheck;
  if (!check(process.version, engineVersion)) {
    try {
      if (!options.switch) {
        throw new Error();
      }

      switchVer(engineVersion);
    } catch (err) {
      throw new Error(`Error: Current node version does not match the engines section of the package.json. Wanted ${engineVersion} but was ${process.version}`);
    }
  }

  return true;
};

export default checkVer;

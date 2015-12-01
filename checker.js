import yargs from 'yargs';
import findParent from 'find-parent-dir';
import fs from 'fs';
import semver from 'semver';
import {
	which, exec
}
from 'shelljs';
var args = yargs.usage('Usage: $0 [options]')
	.describe('loose', 'Check only that the current node version is greater the required engine version')
	.describe('switch', 'If the node version doesn\'t satisfy the engine version attempt to use the n pacakage manager to switch the current node version to a compliant version.')
	.help('h')
	.argv;

var strict = function (actualVersion, engineVersion) {
	return semver.satisfies(actualVersion, engineVersion);
};

var cleanVersion = function (version) {
	if (version) return version.match(/[0-9]+(\.[0-9]+)*/)[0];
}

var loose = function (actualVersion, engineVersion) {
	var cleanedVer = cleanVersion(engineVersion);
	return semver.gt(actualVersion, cleanedVer);
};

var getPackageInfo = function () {
	var dir = findParent.sync(process.cwd(), 'package.json');
	if (!dir) {
		return null;
	}
	var file = fs.readFileSync(dir + '/package.json');
	if (!file) {
		return null;
	}
	return JSON.parse(file);
}

var switchVer = function (version) {
	if (which('n')) {
		var cleanedVersion = cleanVersion(version);
		console.log('info: Switched node version to ' + cleanedVersion);
		return exec('n ' + cleanedVersion);
	}
	throw new Error('Attempted to switch version, but n was not defined. If you want to use the --switch flag install the n manager with `npm install -g n`')
}

var checkVer = function () {
	var packageInfo = getPackageInfo();
	if (!packageInfo) {
		throw new Error('Could not locate package.json in the current directory structure.')
	}
	var engineVersion = packageInfo.engines.node;
	var check = args.loose ? loose : strict;
	if (!check(process.version, engineVersion)) {
		try {
			if (!args.switch) throw new Error();
			switchVer(engineVersion);
		} catch (err) {
			throw new Error('Error: Current node version does not match the engines section of the package.json. Wanted ' + engineVersion + ' but was ' + process.version);
		}
	}

	console.log('info: Node version matches the engine version');
	return true;
};

export default checkVer;

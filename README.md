# node-version-checker

Tool for checking if the current node version matches what is provided in the `engines` section of the project's `package.json` file.

Main functionality:
* Attempts to find a package.json in the current directory or one of its ancestors.
* If package.json is found compare the current version of node with the version specified in the package.json
* If the current version of node does not satisfy the version from package.json throw an error.
* If the current version of node *does* satisfy the version from package.json print a friendly message that everything is ok.

Options:
* loose instead of checking semver.satisfies checks only if the current version is greater than the requested version
* switch if the versions do not match attempt to use the `n` package manager to switch to a compliant node version

## install

Easy command line usage:
`npm install -g node-version-checker`

Dev dependency:
`npm install node-version-checker --save-dev`

## Command Line Usage
```shell
Usage: nvc [options]

Options:
  --loose   Check only that the current node version is greater the required
            engine version
  --switch  If the node version doesn't satisfy the engine version attempt to
            use the n pacakage manager to switch the current node version to a
            compliant version.
  -h        Show help                                                  [boolean]
```

## Node Usage
Just require checker and then invoke it.

```js
//Require syntax
var checker = require('node-version-checker').default;
//import syntax
import checker from 'node-version-checker';
```

Checker will throw an error if the versions don't match the rules. You can optionally pass in an options object to modify behavior:

```js
//Check with default options
checker()
//Check with options provided.
checker({loose: true, switch: false});
```

### Node Options
You can specify the following options when using through node:
```js
const options = {
  //Check only that the current node version is greater the required engine version when set to true.
  //Default is false.
  loose: true || false,
  //If the node version doesn't satisfy the engine version attempt to use the n pacakage manager to switch the current node version to compliant version.
  //Default is false
  switch: true || false
}
```

## Package.json script

```json
{
  "scripts": {
    "checkVer": "node node_modules/node-version-checker"
  }
}
```

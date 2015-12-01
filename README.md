# node-version-checker

Tool for checking if the current node version matches what is provided in the `enginges` section of the project's `package.json` file.

Main functionality:
* Attempts to find a package.json in the current directory or its ancestors.
* If package.json is found compare the current version of node with the version specified in the package.json
* If the current version of node does not satisfy the version from package.json throw an error.
* If the current version of node *does* satisfy the version from package.json print a friendly message that everything is ok.

Options:
* --loose instead of checking semver.satisfies checks only if the current version is greater than the requested version
* --switch if the versions do not match attempt to use the `n` package manager to switch to a compliant node version

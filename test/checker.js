import {
  expect
}
from 'chai';
import { exec } from 'shelljs';


describe('version checker', () => {
  process.chdir('test');
  const fs = require('fs');
  const checker = require('../checker').default;
  const parentDir = require('find-parent-dir');

  before(() => exec('n 0.10.40'));

  afterEach(() => fs.writeFileSync('package.json', JSON.stringify({})));
  const writeFile = (packageInfo) => fs.writeFileSync('package.json', JSON.stringify(packageInfo));

  it('should attempt to find package.json in the current heirarchy', () => {
    var packageInfo = {
      engines: {
        node: '1000.0.0'
      }
    };
    writeFile(packageInfo);
    try {
      checker();
    } catch (err) {
      expect(err.message).to.equal('Error: Current node version does not match the engines section of the package.json. Wanted 1000.0.0 but was v0.10.40')
    }
  });

  it('should error out if the current node version doesn\'t satisfy the wanted version', () => {
    var packageInfo = {
      engines: {
        node: '1000.0.0'
      }
    };
    writeFile(packageInfo);
    try {
      checker();
    } catch (err) {
      expect(err.message).to.equal('Error: Current node version does not match the engines section of the package.json. Wanted 1000.0.0 but was v0.10.40')
    }
  });

  it('should be ok if the current node version satisfies the wanted version', () => {
    var packageInfo = {
      engines: {
        node: '0.10.x'
      }
    };
    writeFile(packageInfo);
    expect(checker()).to.be.ok;
  });

  describe('loose', () => {
    const options = {
      loose: true
    }
    it('should accept an actual version that is greater than the engine version', () => {
      var packageInfo = {
        engines: {
          node: '0.0.1'
        }
      };
      writeFile(packageInfo);
      expect(checker(options)).to.be.ok;
    });

    it('should throw an error if the actual version is less than then engine version', () => {
      var yargs = require('yargs');
      yargs.argv.loose = true;
      var packageInfo = {
        engines: {
          node: '10.5.0'
        }
      };
      writeFile(packageInfo);
      try {
        checker(options);
      } catch (err) {
        expect(err.message).to.equal('Error: Current node version does not match the engines section of the package.json. Wanted 10.5.0 but was v0.10.40')
      }
    });
  });
});

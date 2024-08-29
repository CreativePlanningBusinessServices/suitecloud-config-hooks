# SuiteCloud Config Hooks

Hooks into Node version of SuiteCloud Developer Framework CLI. These can be executed automatically with SDF commands by creating a `suitecloud.config.js` file. Details on creating this file can be found in the Help Center.

## Example suitecloud.config.js

```js
const hooks = require('suitecloud-config-hooks');

module.exports = {
  commands: {
    'object:import': {
      onCompleted: hooks.organizeImportedObjects,
    },
    'project:deploy': {
      beforeExecuting: async (options) => {
        await hooks.preventDeployWithoutRemote(options);
        if (hooks.isProd(options)) {
          await hooks.preventDeployWithUncommittedChanges(options);
        }
        return options;
      }
    }
  }
}

```

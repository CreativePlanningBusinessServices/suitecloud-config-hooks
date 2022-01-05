# SuiteCloud Config Hooks

Hooks into Node version of SuiteCloud Developer Framework CLI. These can be executed automatically with SDF commands by creating a `suitecloud.config.js` file. Details on creating this file can be found in the Help Center.

## Example suitecloud.config.js

```js
const hooks = require('./node_modules/suitecloud-config-hooks/dist/index');

module.exports = {
  commands: {
    'object:import': {
      onCompleted: hooks.organizeImportedObjects,
    }
  }
}
```

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
      beforeExecuting: hooks.deployConfirmation,
    }
  }
}
```

## Hooks

- **organizeImportedObjects**: After importing XML objects from the Netsuite account, this organizes them into folders, using the same folder structure as the [NetsuiteSDF](https://github.com/christopherwxyz/NetSuiteSDF) repo.

- **deployConfirmation**: Displays a popup window to enter "Deploy" to confirm deployment. This UI is tested and working on Windows and macOS. The binary for both platforms is written in [Rust](https://www.rust-lang.org/) using [iced](https://github.com/iced-rs/iced). Source code for the UI can be found [here](https://github.com/KyleJonesWinsted/deploy-confirmation).

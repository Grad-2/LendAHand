const { removeModuleScopePlugin } = require('customize-cra')
module.exports = removeModuleScopePlugin()

// const rewireAppcachePlugin = require('react-app-rewire-appcache-plugin')
// const { removeModuleScopePlugin } = require('customize-cra')

// module.exports = {
//     webpack:  function override(config, env) {
//         // Generate a manifest.appcache file
//         config = rewireAppcachePlugin(config, env, {
//             settings: ['prefer-online'],
//             output: 'manifest.appcache'
//         })    
//         return config;
//     // },
//     // // removeModuleScopePlugin: function override(config) {
//     // //     removeModuleScopePlugin()(config);
//     // //     return config;
//     // // }
// }


import globals from 'globals';
import pluginJs from '@eslint/js';


export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      'quotes': [2, 'single', { 'avoidEscape': true }]
    }
  },
  pluginJs.configs.recommended,
];

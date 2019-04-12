(module.exports = {
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "rules": {
    // enable additional rules
    //"indent": ["error", 2],
    "linebreak-style": ["error", "windows"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    //"no-unused-vars": ["error", "true"],
    // override default options for rules from base configurations
    "comma-dangle": ["error", "never"],
    "no-cond-assign": ["error", "always"],
    // disable rules from base configurations
    "no-console": "off"
  },
  "env": {
    "browser": true
  }
})

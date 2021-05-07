module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "react/prop-types": 0,
    "semi": ["error", "always"],
    "indent": [["error", "space"], ["error", 2]],
    "no-trailing-spaces": ["error", { "ignoreComments": true }],
    "space-before-blocks": ["error", "always"],
    "keyword-spacing": ["error", {"before": true, "after": true}],
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "arrow-parens": ["error", "always"]
  },
};
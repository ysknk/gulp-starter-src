module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  // writable || readonly
  "globals": {
    "jQuery": "writable",
    "$": "writable",
    "_": "writable"
  },
  "rules": {
    "no-console": 1,
    "no-alert": 1,
    "default-case": 1
  }
}

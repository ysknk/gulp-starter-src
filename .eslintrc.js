module.exports = {
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "globals": {
    "jQuery": true,
    "$": true,
    "_": true
  },
  "rules": {
    "no-console": 1,
    "no-alert": 1,
    "default-case": 1
  }
}
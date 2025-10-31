import js from "@eslint/js";

export default [
  js.configs.recommended,

  // Default: CommonJS / script mode for most files
  {
    files: ["**/*.js"],
    ignores: ["scripts/**", "**/*.test.js", "**/__tests__/**"], // use ignores instead of excludedFiles
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-console": "off"
    }
  },

  // Files in scripts/ should be parsed as ES modules
   // Files in scripts/ should be parsed as ES modules
  {
    files: ["scripts/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly"
      }
    },
    rules: {
      "no-undef": "error"
    }
  },


  // Test files: provide Jest globals
  {
    files: ["**/*.test.js", "**/__tests__/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly"
      }
    },
    rules: {
      "no-undef": "off"
    }
  }
];

import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    // General settings for your source files
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",        // important for require/module.exports
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
      // keep helpful rules but relax things that cause noise
      "no-undef": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-console": "off"   // allow console in server-side code; set to "warn" if you prefer
    }
  },
  {
    // Apply test globals & slightly different rules for test files
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
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
      "no-undef": "off" // jest globals provided above
    }
  }
];


import nestConfig from "@ai-platform/eslint-config/nest";

/**
 * 使用本地 tsconfig.eslint.json（覆盖 src + test），
 * 避免生产用 tsconfig.json（仅含 src）漏掉 e2e 文件。
 * projectService: false 关闭预设默认的自动查找，改用 project 显式指定。
 */
export default [
  ...nestConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: false,
        project: "./tsconfig.eslint.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

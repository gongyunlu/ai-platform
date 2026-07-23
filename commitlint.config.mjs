/**
 * Conventional Commits 校验。允许的 type：
 *   feat / fix / docs / style / refactor / perf / test / build / ci / chore / revert
 * scope 可以是 web / api / shared / tsconfig / eslint-config / deps 等，也可留空。
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
};

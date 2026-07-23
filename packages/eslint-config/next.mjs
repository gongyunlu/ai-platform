// Next.js 前端应用的 ESLint 预设：Next 官方规则 + 关闭与 Prettier 冲突的排版规则。
// eslint-config-next 16 起原生 flat config，直接导入即可，无需 FlatCompat。
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**', 'out/**'],
  },
];

export default config;

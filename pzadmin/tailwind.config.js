/** @type {import('tailwindcss').Config} */
module.exports = {
  // 指定需要 Tailwind 处理的文件路径，这里示例是处理 src 目录下所有 vue、js、ts、jsx、tsx 文件
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    // 在这里可以扩展 Tailwind 的主题，比如自定义颜色、字体等，若不需要扩展，保持空对象即可
    extend: {},
  },
  plugins: [
    // 可以在这里添加 Tailwind 的插件，若不需要插件，保持空数组即可
  ],
};

import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import css from "rollup-plugin-import-css";
import image from "@rollup/plugin-image";

import dotenv from "dotenv";
dotenv.config();

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "public/bundle.js",
      format: "es",
      // sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    commonjs(),
    resolve({ browser: true }),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    }),
    css({ output: "styles.css" }),
    image({ dom: false }),
  ],
};

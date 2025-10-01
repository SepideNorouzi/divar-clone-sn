import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const paths = [
  "src",
  "assets",
  "components",
  "configs",
  " layouts",
  "pages",
  "router",
  "services",
  "styles",
  "utils",
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ...paths.reduce(
        (acc, cur) => ({
          ...acc,
          [cur]: `/${cur === "src" ? cur : "src/" + cur}`,
        }),
        ""
      ),
      // looped through paths, then spread the already existing data(...acc), named the key and its value(if
      // the path is just src, return it and if not, add the rest to the past using the key name.)
    },
  },
});
// what i did here:
// there is a way of importing components which depends on the path youre currently in,
// we often use this method and u have seen it everywhere, its called relative.
// another way is to do this instead, create a config in this file and then use it to address
// other components from outside, this is called absolute.

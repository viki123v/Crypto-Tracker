import { defineConfig } from "vite";
import react  from '@vitejs/plugin-react'
import viteSvgr from "vite-plugin-svgr";

export default defineConfig({
    plugins : [ react(), viteSvgr() ],
    define : {
        'process.env' : process.env
    }
})
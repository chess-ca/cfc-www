
import path from 'path';
import * as url from 'url';
import nodeResolve from '@rollup/plugin-node-resolve';
//import svelte from 'rollup-plugin-svelte';
import sizes from 'rollup-plugin-sizes';
import sass from 'rollup-plugin-sass';

const config_dir = url.fileURLToPath(new URL('.', import.meta.url));
const src_dir = config_dir;
const built_dir = path.resolve(config_dir, '../hugo/assets/built');
console.log('Source: ' + src_dir);
console.log('Destination: ' + built_dir);

const isDev = String(process.env.BUILD).toLowerCase().startsWith('dev');
console.log('Building CSS/JS for ' + (isDev ? 'development' : 'non-development'));

export default [
    // build_cfg('ratings', 'ratings/_main.js'),
    build_cfg('cfc-2024', 'js/cfc-2024.js'),
];

function build_cfg(cfg_name, src) {
    const cfg = { input: {}, output: {}, plugins: []};
    cfg.input[cfg_name] = path.resolve(src_dir, src);
    cfg.output = {
        dir: built_dir,
        entryFileNames: '[name].js',
        globals: {},
        format: 'es'     // 'iife' for browser; 'es' for downstream bundlers.
    };
    cfg.plugins = [
        nodeResolve({
            moduleDirectories: ['node_modules']
        }),
        // svelte({
        //     // include: path.resolve(src_dir, 'javascript/components/**/*.svelte'),
        //     emitCss: false,
        //     compilerOptions: {
        //         dev: isDev
        //         // customElement: true      // these mount in Shadow DOM; hides external CSS (like Bulma.io)
        //     }
        // }),
        sass({
            output: path.resolve(built_dir, cfg_name+'.css'),
            outputStyle: 'compressed',
            //---- All are NFG
            //includePaths: [path.resolve(src_dir, 'node_modules')],
            //includePaths: [path.resolve('node_modules')],
            //includePaths: ['node_modules/'],
            //includePaths: ['node_modules'],
            watch: src_dir+'/css'
        }),
        (isDev) ? sizes({details: false}) : null
    ];
    cfg['watch'] = { clearScreen: false, buildDelay: 500 };
    return cfg;
}

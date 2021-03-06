/* eslint-env node */
/* eslint-disable no-console */

const path = require("path");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const TSConfigPathsWebpackPlugin = require("tsconfig-paths-webpack-plugin");
const BundleAnalyzerWebpackPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');
const webpack = require("webpack");


const MODE_DEV = "development";
const MODE_PROD = "production";

/**
 * Build a bundle targeting deployment in the Azure Portal. External dependencies
 * below should match what the portal provides.
 */
module.exports = env => {

    if (!env) {
        env = {};
    }

    // Contain all options for the build
    const OPTS = {
        TEST_MODE: env.test === true,
        DEV_MODE: env.dev === true,
        ANALYZE_MODE: env.analyze === true,
        WATCH_MODE: env.watch === true
    };

    console.log("Webpack Configuration Options: ", OPTS);

    const webpackPlugins = [];

    webpackPlugins.push(new ForkTsCheckerWebpackPlugin({
        async: false
    }));

    webpackPlugins.push(new WebpackBar());

    if (OPTS.ANALYZE_MODE === true) {
        // Get stats on the final webpack bundle
        webpackPlugins.push(new BundleAnalyzerWebpackPlugin());
    }

    return {
        mode: OPTS.DEV_MODE ? MODE_DEV : MODE_PROD,
        target: "web",
        devtool: OPTS.DEV_MODE ? "inline-source-map" : undefined,
        watch: OPTS.WATCH_MODE ? true : false,

        externals: [
            /^(@fluentui|@uifabric|office-ui-fabric)/i,
            "react",
            "react-dom"
        ],

        output: {
            path: path.join(__dirname, "dist", "umd"),
            filename: "batchreact.js",
            library: 'batchreact',
            libraryTarget: 'umd'
        },

        entry: "./src/ui-react/index.ts",

        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            plugins: [
                new TSConfigPathsWebpackPlugin({ 
                    extensions: [".ts", ".js"],
                    logLevel: "info",
                    logInfoToStdOut: true,
                    configFile: path.join(__dirname, "tsconfig.json")
                })
            ]
        },
    
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        // Fork TS Checker will handle this in another process
                        transpileOnly: true
                    }
                }
            ]
        },
    
        plugins: webpackPlugins,
    
        resolveLoader: {
            modules: ["node_modules"]
        },
    
        optimization: {
            splitChunks: false
        }
        
    };
};

/* eslint-env node */
/* eslint-disable no-console */

const path = require("path");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TSConfigPathsWebpackPlugin = require("tsconfig-paths-webpack-plugin");
const BundleAnalyzerWebpackPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');
const webpack = require("webpack");


const MODE_DEV = "development";
const MODE_PROD = "production";

/**
 * Build a bundle which can be imported into a regular web page and used without
 * any external dependencies.
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

    webpackPlugins.push(new HtmlWebpackPlugin({
        template: path.join(__dirname, "dev-server", "index.html"),
        filename: "index.html",
        inject: "head"
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

        output: {
            path: path.join(__dirname, "dist", "umd"),
            filename: "batchstandalone.js",
            library: 'batchstandalone',
            libraryTarget: 'umd'
        },

        devServer: {
            open: true,
            host: "127.0.0.1",
            contentBase: path.join(__dirname, "dev-server"),
            historyApiFallback: true,
            watchContentBase: true,
            port: 9000,
            compress: true,
            headers: {
                Connection: 'keep-alive'
            }
        },
    
        entry: "./src/ui-standalone/index.tsx",

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

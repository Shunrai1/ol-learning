module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset',
        // ["es2015", { modules: false }]
        ["@babel/preset-env", { modules: false }]
    ],
    plugins: [
        '@babel/plugin-transform-optional-chaining',
        '@babel/plugin-transform-nullish-coalescing-operator'
    ]
}
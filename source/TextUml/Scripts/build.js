({
    baseUrl: ".",
    mainConfigFile: "./config.js",
    out: "app.js",
    paths: {
        jquery: "empty:",
        "preloaded-data": "empty:"
    },
    include: "main.js",
    excludeShallow: ["jquery", "preloaded-data"],
    optimize: "uglify2",
    generateSourceMaps: true,
    preserveLicenseComments: false
})
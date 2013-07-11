({
    baseUrl: ".",
    mainConfigFile: "./config.js",
    out: "app.js",
    paths: {
        jquery: "empty:",
        "preloaded-data": "empty:",
    },
    include: "main.js",
    excludeShallow: ["jquery", "preloaded-data"]
})
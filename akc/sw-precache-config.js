module.exports = {
  // Generate service-worker.js in the built version of the site
  "root": "dist/",
  // Only precache the main app file (HTML + CSS + JS)
  "staticFileGlobs": [
    "dist/index.html"
  ],
  // Runtime cache the images and music
  "runtimeCaching": [{
    "urlPattern": /\.(?:png|gif|jpg|jpeg|svg|mp3)$/,
    "handler": 'cacheFirst'
  }]
};
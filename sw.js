const CACHE = "utlegg-v1";


self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE)
                .then(cache =>

                    cache.addAll([
                        "index.html",
                        "style.css",
                        "storage.js",
                        "settings.js",
                        "ui.js",
                        "app.js",
                        "manifest.json"
                    ])

                )

        );

    });



self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(event.request)
                .then(response =>

                    response ||
                    fetch(event.request)

                )

        );

    });
# Vert.x - Bringing the Browser to the Cluster

## DevIgnition conference, December 6 2013.

These are the slides and demo application used in my presentation at the
DevIgnition conference. The presentation was created with
[Reveal.js](http://lab.hakim.se/reveal-js/#/). I usually view the presentation
locally using the vert.x script in the `presentation` directory.  You need to 
have [Vert.x](http://vertx.io) installed.

    $ cd presentation
    $ vertx run start.js 

Then browse to [http://localhost:8000](http://localhost:8000) to view the 
presentation slides.

To view the demo application, you should have at least version 2.1M2 of vert.x.

    $ cd app
    $ vertx run start.js -cluster -conf config.json

If you want to hack the election, run the chaos inducer as its own verticle.

    $ vertx run src/clj/chaos.js -cluster -conf config.json

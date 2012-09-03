Rdio.com remote for Firefox
===========================

Disclaimer
----------

You shouldn't use this for now! I'm playing with Rdio and Firefox's JS add-on
toolkit, and started this on a Sunday afternoon. JS Hackers only. :p

About
-----

This is a Firefox add-on to control rdio.com's web-app without using Firefox's
UI (mouse, or keyboard).  The idea is to open Rdio.com in the background, or
(as of now) in a browser tab, to then control it through Firefox's embedded
HTTPd.

Hacking
=======

Setup
-----

To get started, you will need to:

    1. Get an account on rdio.com
    2. Setup the Mozilla's [add-on SDK](https://addons.mozilla.org/en-US/developers/builder)
       on your computer.
    3. Clone the git repository at git://github.com/oz/rdio-ff-remote.git
    4. Hack your way around.

How-to
------

When running, the add-on starts an HTTP server on port 8000 (hard-coded for
now).  Be sure that nothing is running here, or it won't start.

It talks in JSON.

Since the project-goal is to control rdio.com through HTTP (!), these are the
paths available so far.

 * `GET /status` tells when the player is ready.
 * `POST /play_pause` allows you to play/pause the current song.

Caveats
-------

 * This is alpha-software, without any guarantees.
 * Hey, you've got a HTTP server running on your machine for every local
   user to abuse (wait, is that not a feature?).
 * It shouldn't work.
 * I guess it's OK, but I should definitely check Rdio's terms of service.

License
=======

MIT

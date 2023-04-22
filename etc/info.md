# How is it working 

## using fastapi,spotipy,youtube-search and yt-dlp for backend and jquery and tailwind for frontend


* run.py has instance app that can be used to run app
`uvicorn run:app`

* `app/__init__.py` has fastapi app loading routers and specifying jinja templates 
* `routes/` has all the api end points being used and jinja templates being return
* `app/utils` has functions that are needed
* checkout `localhost/docs` for api

* all the actual app files in /app
* html files in `templates`
* css/js/img files in `static`
* `templates/components` used to store html components or element that are being used often `card.html->the cards that tracks are shown in` `modal.html-> modal for add all feature` , `alert.html` all the alerts used
* all the main code for javascript side is in `main.js`
* func.js contains some functions being used in main.js
* style.js contains all the stuff for styles ofc
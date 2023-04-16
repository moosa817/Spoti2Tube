# Spoti2Tube
Fast Api App to download tracks/playlist even liked songs 

Website Live Demo At 
https://spoti2tube.vercel.app/

<hr>
<h2>how to run this app</h2>



### Virtualenv 
```

python -m venv env

source env/bin/activate 
OR 
./Scripts/activate
pip install -r requirements.txt
`````

### Virtualenv 
```

python -m venv env

source env/bin/activate 
OR 
./Scripts/activate
pip install -r requirements.txt
`````

### Setup .env file 
```
SPOTIPY_CLIENT_ID=
SPOTIPY_CLIENT_SECRET=
SPOTIPY_REDIRECT_URI=
MONGO_STR=
EMAIL_SENDER=
MAIL_USER=
SMTP_PWD=
EMAIL_RECIEVER=
MAIL_SERVER=
CALLBACK_URL=
```

### Run The App

```uvicorn run:app --reload --host 0.0.0.0```






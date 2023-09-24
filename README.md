# Update
You can read my article on how I made the application
https://community.intersystems.com/post/cookbook-preparing-your-own-assistant-meetings

# About
The iris-recorder-helper application is an assistant in recording audio sessions with subsequent decoding of audio into text and summarizing up or other things (to your taste).

The application is based on InterSystems IRIS, Python (Flask, SQLALchemy ORM) and simple Javascript with jQuery and Bootstrap 5

[![OEX](https://img.shields.io/badge/Available%20on-Intersystems%20Open%20Exchange-00b2a9.svg)](https://openexchange.intersystems.com/package/iris-recorder-helper)
[![license](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/alexnxela/iris-recorder-helper/blob/master/LICENSE)
<img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/alexnxela/iris-recorder-helper">
![Support](https://img.shields.io/badge/Support-mobile_version-blue)
# In practice
Watch a demo of how the service works https://www.youtube.com/watch?v=O2yh-jorDs4

![Main](https://github.com/alexnxela/iris-recorder-helper/blob/master/demo/main.png?raw=true)

# TRY ONLINE DEMO https://iris-recorder-helper.demo.community.intersystems.com/

# Features
* Convert voice to text
* AI-powered text recognition
* Shortening text with your own settings and in different roles

# TODO
* List of your sessions with recordings
* Loading audio via files
* Working on your server with local models
* Capturing a microphone from another source (for example zoom)

# Installation
1. Clone/git pull the repo into any local directory

```
git clone https://github.com/alexnxela/iris-recorder-helper.git
```

2. Open a Docker terminal in this directory and run:

```
./docker-build.sh
```

3. Run the IRIS container:

```
docker-compose run iris irispython ./rh/flask/app/configer.py

docker-compose up -d
```
---
**Install with IPM**
```objectscript
zpm "install iris-recorder-helper"
```

## How to setup
 You should put the parameters file here **./rh/flask/app/config.json**
```json
{
  "OPENAI_KEY": "sk-***",
  "OPENAI_MAX_TEMP": 0.9,
  "IRIS_URL":"iris://_SYSTEM:SYS@iris:1972/USER"
}
```
You can get the key **OPENAI_KEY** here https://platform.openai.com/account/api-keys

## How to run it
### Run the python script in iris container:

```bash
# attach to the running IRIS container
docker-compose exec iris bash
# run the script
$ irispython ./rh/flask/main.py
```
### and then you can follow the link
>**http://localhost:5000**

## Special Thanks to:
Dmitry Maslennikov for sqlalchemy-iris library (An InterSystems IRIS dialect for SQLAlchemy ) which was helpful to connect with IRIS

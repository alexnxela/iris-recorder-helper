# About
The iris-recorder-helper application is an assistant in recording audio sessions with subsequent decoding of audio into text and summarizing up or other things (to your taste).

The application is based on InterSystems IRIS, Python (Flask, SQLALchemy ORM) and simple Javascript with jQuery and Bootstrap 5

# In practice
![Main](https://github.com/alexnxela/iris-recorder-helper/blob/master/demo/main.png?raw=true)


# Features
* Convert voice to text
* AI-powered text recognition
* Shortening text with your own settings and in different roles

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
docker-compose up -d 
```

## How to setup
 You should put the parameters file here **./rh/flask/config.json**
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

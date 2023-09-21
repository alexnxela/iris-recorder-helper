# Default config variables
import json
import os
import sys
import base64

APP_PATH = os.path.dirname(os.path.abspath(__file__))
JSON_CONFIG_PATH = APP_PATH+"/config.b64"
try:
    with open(JSON_CONFIG_PATH, 'r') as file:
        contents = file.read()
    JSON_CONFIG = json.loads(base64.b64decode(contents).decode('utf-8'))

except FileNotFoundError:
    print(f'{JSON_CONFIG_PATH} not found')
    sys.exit()

except json.JSONDecodeError as e:
    with open(JSON_CONFIG_PATH) as f:
        contents = f.read()
    print(f'{JSON_CONFIG_PATH} has error: {e}, {contents}')
    sys.exit()
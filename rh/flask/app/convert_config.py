import json
import base64
import os

APP_PATH = os.path.dirname(os.path.abspath(__file__))

try:
    with open(APP_PATH+'/config.json', 'r') as file:
        config_data = json.load(file)
except FileNotFoundError:
    print("File 'config.json' not found")
    exit(1)
except json.JSONDecodeError as e:
    print(f"Wrong format 'config.json': {e}")
    exit(1)

config_json_str = json.dumps(config_data)
config_base64 = base64.b64encode(config_json_str.encode('utf-8')).decode('utf-8')

print("Base64:")
print(config_base64)
# Default config variables
import json
import os
import sys

print('test')
print(os.environ.get('TEST_SECRET'))
print('test 123')

for key, value in os.environ.items():
    print(f'os:{key}: {value}')


APP_PATH = os.path.dirname(os.path.abspath(__file__))
JSON_CONFIG_PATH = APP_PATH+"/config.json"
try:
    with open(JSON_CONFIG_PATH, 'r') as file:
        JSON_CONFIG = json.load(file)

except FileNotFoundError:
    print(f'{JSON_CONFIG_PATH} not found')
    sys.exit()

except json.JSONDecodeError as e:
    print(f'{JSON_CONFIG_PATH} has error: {e}')
    sys.exit()

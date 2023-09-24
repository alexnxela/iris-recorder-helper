import json
import os
import sys


APP_PATH = os.path.dirname(os.path.abspath(__file__))

with open(APP_PATH + '/config.tpl.json', 'r') as tpl_file:
    questions = json.load(tpl_file)

print('Configure app')

answers = {}

for item in questions:
    answer = input(item['question'] + ' ')
    if not answer and "default" in item:
        answer = item['default']
    if not answer:
        print('Question is required')
        sys.exit()

    if item['type']:
        if item['type'] == "int":
            answer = int(answer)
        if item['type'] == "float":
            answer = float(answer)

    answers[item['key']] = answer

with open(APP_PATH + '/config.json', 'w') as config_file:
    json.dump(answers, config_file)

print('config.json created successfully')
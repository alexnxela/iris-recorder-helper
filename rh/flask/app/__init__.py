import time
import base64
import openai
from tempfile import NamedTemporaryFile
from datetime import datetime
from flask import Flask, send_file, request, jsonify
from flask_sqlalchemy import SQLAlchemy

from .config import *

db = SQLAlchemy()


def init_app():
    if not JSON_CONFIG['IRIS_URL']:
        print('config.json is empty')
        sys.exit()

    openai.api_key = JSON_CONFIG['OPENAI_KEY']

    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = JSON_CONFIG['IRIS_URL']
    app.app_context().push()

    from .models import Record

    db.init_app(app)
    with app.app_context():
        #db.drop_all()
        db.create_all()

    @app.route('/summary', methods=['POST'])
    def summary():
        try:
            key = request.form['key']
            prompt = request.form['prompt']

            if key is None:
                return jsonify({'message': 'key is empty'}), 400
            if prompt is None:
                return jsonify({'message': 'prompt is empty'}), 400

            records = Record.query.filter_by(key=key).order_by(Record.date_created).all()
            msgs = ''
            if records:
                for record in records:
                    if record.text:
                        msgs += "\n"+record.text
            else:
                raise "Msgs is empty"

            prompt = prompt.replace("${MSGS}", msgs)

            print('PROMPT:', prompt)

            response = openai.Completion.create(
                model="text-davinci-003",
                prompt=prompt,
                max_tokens=JSON_CONFIG['OPENAI_MAX_TOKENS'],
                temperature=JSON_CONFIG['OPENAI_MAX_TEMP']
            )

            msg = response.choices[0].text.strip()

            return jsonify({"msg":msg})
        except Exception as e:
            return f'Error: {str(e)}', 500

    @app.route('/save', methods=['POST'])
    def save():
        try:
            file_content = request.files['content']

            date_created = datetime.strptime(request.form['date_created'], '%Y-%m-%dT%H:%M:%S.%fZ')
            rec = Record(key=request.form['key'],
                         content=file_content,
                         text=None,
                         filepath=None,
                         date_created=date_created)

            db.session.add(rec)
            db.session.commit()

            tmp_file = NamedTemporaryFile(suffix=".wav")

            file_content.save(tmp_file)

            with open(tmp_file.name, "rb") as tmp_file_audio:
                transcript = openai.Audio.transcribe("whisper-1", tmp_file_audio)

            if transcript.text:
                rec.text = transcript.text

            db.session.commit()

            result = [{'id': rec.id, 'key': rec.key,
                       'date_created': rec.date_created,
                       'text': rec.text}]
            return jsonify(result)
        except Exception as e:
            return f'Error: {str(e)}', 500

    @app.route('/get', methods=['GET'])
    def get_records():
        key = request.args.get('key')
        if key is None:
            return jsonify({'message': 'key is empty'}), 400

        records = Record.query.filter_by(key=key).order_by(Record.date_created).all()
        if records:
            result = [{'id': record.id, 'key': record.key,
                       'date_created': record.date_created,
                       'text': record.text} for record in records]
            return jsonify(result)
        else:
            return jsonify([]), 200

    @app.route('/')
    def index():
        return send_file('./static/index.html')

    @app.route('/record.js')
    def record_js():
        return send_file('./static/record.js')

    return app

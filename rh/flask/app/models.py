from . import db
from sqlalchemy.sql import func


class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(36))
    content = db.Column(db.Text)
    filepath = db.Column(db.String(255))
    text = db.Column(db.Text)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())

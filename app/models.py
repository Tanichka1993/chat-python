from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from app import app

db = SQLAlchemy(app)

migrate = Migrate(app, db)


class Base(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())
    date_modified = db.Column(db.DateTime, default=db.func.current_timestamp(),
                              onupdate=db.func.current_timestamp())

    def _asdict(self):
        return {key: getattr(self, key) for key in self.__mapper__.c.keys()}


class User(Base):
    login = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    avatar_image_source = db.Column(db.String(255))
    messages = db.relationship('Message', backref='sender', lazy='dynamic')


class Message(Base):
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text_message = db.Column(db.String(1023), nullable=False)



# Import flask dependencies
from flask import jsonify, Blueprint, abort, request
from flask_api import status
# Import module models (i.e. User)
# from app import app
from sqlalchemy.orm.exc import NoResultFound

from app.models import Message, db, User

api_module = Blueprint('api', __name__, url_prefix='/api')


def jsonify_as_dict(data):
    if not isinstance(data, list):
        return jsonify(data._asdict())
    else:
        return jsonify([element._asdict() for element in data])


@api_module.route('/messages', methods=['GET'])
def get_messages():
    return jsonify_as_dict(Message.query.all())


@api_module.route('/message/<int:message_id>', methods=['GET'])
def get_message(message_id):
    try:
        return jsonify_as_dict(Message.query.filter(Message.id == message_id).one())
    except NoResultFound:
        return abort(status.HTTP_404_NOT_FOUND)


@api_module.route('/message', methods=['POST'])
def add_message():
    if not request.json.get('text_message', ''):
        return abort(status.HTTP_400_BAD_REQUEST)
    else:
        db.session.add(Message(sender_id=1, text_message=request.json['text_message']))
        db.session.commit()
        return 'Created', status.HTTP_201_CREATED


@api_module.route('/users', methods=['GET'])
def get_users():
    return jsonify_as_dict(User.query.all())
import config
from flask import Flask, render_template, send_from_directory

# Define the WSGI application object
app = Flask(__name__)

app.config.from_object(config)


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/node_modules/<path:path>')
def send_node_modules(path):
    return send_from_directory('static/node_modules', path)


@app.route('/javascripts/<path:path>')
def send_javascripts(path):
    return send_from_directory('static/javascripts', path)


@app.route('/stylesheets/<path:path>')
def send_stylesheet(path):
    return send_from_directory('static/stylesheets', path)


@app.route('/template/<path:path>')
def send_template(path):
    return send_from_directory('static/template', path)


@app.route('/images/<path:path>')
def send_images(path):
    return send_from_directory('static/images', path)


from app.module_api.controllers import api_module

app.register_blueprint(api_module)
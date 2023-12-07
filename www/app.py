# Just for local testing
from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Directory where your static files are located
root = os.path.dirname(os.path.realpath(__file__))

@app.route('/', methods=['GET'])
def index():
    path = 'index.html'
    return send_from_directory(root, path)

@app.route('/<path:path>', methods=['GET'])
def serve_file_in_dir(path):
    if path == "":
        path = os.path.join(path, 'index.html')

    return send_from_directory(root, path)

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')

from flask import Flask, request, jsonify, render_template
import re
from queue import Queue
import sqlite3
import pypdf

app = Flask(__name__, template_folder='Backend/templates')

@app.route('/')
def login():
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True)

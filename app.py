
import sqlite3
from flask import Flask, request, jsonify, render_template
import re
from queue import Queue
import sqlite3


app = Flask(__name__, template_folder='Backend/templates', static_folder='Backend/static')

@app.route('/')
def login():
    return render_template('login_registro.html')

@app.route('/registro')
def registro():
    return render_template('registro.html')

if __name__ == '__main__':
    app.run(debug=True)

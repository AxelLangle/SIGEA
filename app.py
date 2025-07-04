from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, template_folder='Backend/templates', static_folder='Backend/static')
app.secret_key = 'tu_clave_secreta'

def get_db_connection():
    db_dir = os.path.join(os.path.dirname(__file__), 'Database')
    db_path = os.path.join(db_dir, 'usuarios.db')
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)
    if not os.path.exists(db_path):
        # Create the database and table if they don't exist
        conn = sqlite3.connect(db_path)
        conn.execute('''CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido_paterno TEXT NOT NULL,
            apellido_materno TEXT NOT NULL,
            correo TEXT NOT NULL UNIQUE,
            contrasena TEXT NOT NULL
        )''')
        conn.commit()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET'])
def index():
    return render_template('login_registro.html')

@app.route('/registro', methods=['POST'])
def registro():
    nombre = request.form['nombre']
    apellido_paterno = request.form['apellido_pat']
    apellido_materno = request.form['apellido_mat']
    correo = request.form['correo_reg']
    contrasena = request.form['contrasena_reg']
    confirmar = request.form['confirmar_contrasena']

    # Validación de correo institucional
    if not correo.endswith('@uptecamac.edu.mx'):
        flash('Solo se permiten correos institucionales @uptecamac.edu.mx')
        return redirect(url_for('index'))

    # Validación de contraseñas iguales
    if contrasena != confirmar:
        flash('Las contraseñas no coinciden')
        return redirect(url_for('index'))

    hashed_password = generate_password_hash(contrasena)

    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, correo, contrasena) VALUES (?, ?, ?, ?, ?)',
            (nombre, apellido_paterno, apellido_materno, correo, hashed_password)
        )
        conn.commit()
        flash('Usuario registrado exitosamente')
    except sqlite3.IntegrityError:
        flash('El correo ya está registrado')
    finally:
        conn.close()
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    nombre = session.get('nombre', 'Usuario')
    return render_template('dashboard.html', nombre=nombre)

@app.route('/login', methods=['POST'])
def login():
    correo = request.form['correo']
    contrasena = request.form['contrasena']

    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM usuarios WHERE correo = ?',
        (correo,)
    ).fetchone()
    conn.close()

    if user and check_password_hash(user['contrasena'], contrasena):
        session['nombre'] = user['nombre']
        flash('Inicio de sesión exitoso')
        return redirect(url_for('dashboard'))
    else:
        flash('Correo o contraseña incorrectos')
        return redirect(url_for('index'))

@app.route('/registrar_evento')
def registrar_evento():
    return render_template('registrar_eventos.html')

if __name__ == '__main__':
    app.run(debug=True)

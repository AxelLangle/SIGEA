from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3

app = Flask(__name__, template_folder='Backend/templates', static_folder='Backend/static')
app.secret_key = 'tu_clave_secreta'

def get_db_connection():
    conn = sqlite3.connect('usuarios.db')
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

    conn = get_db_connection()
    try:
        conn.execute(
            'INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, correo, contrasena) VALUES (?, ?, ?, ?, ?)',
            (nombre, apellido_paterno, apellido_materno, correo, contrasena)
        )
        conn.commit()
        flash('Usuario registrado exitosamente')
    except sqlite3.IntegrityError:
        flash('El correo ya está registrado')
    finally:
        conn.close()
    return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    correo = request.form['correo']
    contrasena = request.form['contrasena']

    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?',
        (correo, contrasena)
    ).fetchone()
    conn.close()

    if user:
        flash('Inicio de sesión exitoso')
        # Aquí puedes redirigir a la página principal del sistema
        return redirect(url_for('index'))
    else:
        flash('Correo o contraseña incorrectos')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)

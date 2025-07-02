import sqlite3

conn = sqlite3.connect('usuarios.db')
c = conn.cursor()
c.execute('''
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido_paterno TEXT NOT NULL,
        apellido_materno TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        contrasena TEXT NOT NULL
    )
''')
conn.commit()
conn.close()

if __name__ == '__main__':
    print("Base de datos y tabla 'usuarios' creadas correctamente.")
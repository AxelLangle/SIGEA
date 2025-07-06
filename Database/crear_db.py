import sqlite3

conn = sqlite3.connect('usuarios.db')
c = conn.cursor()

# Tabla de usuarios (ya existente)
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

# Nueva tabla de docentes
c.execute('''
    CREATE TABLE IF NOT EXISTS docente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
    )
''')

# Nueva tabla de coordinadores
c.execute('''
    CREATE TABLE IF NOT EXISTS coordinador (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
    )
''')

# Nueva tabla de grupos
c.execute('''
    CREATE TABLE IF NOT EXISTS grupo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT UNIQUE NOT NULL
    )
''')

conn.commit()
conn.close()

if __name__ == '__main__':
    print("Base de datos y tablas 'usuarios', 'docente', 'coordinador' y 'grupo' creadas correctamente.")
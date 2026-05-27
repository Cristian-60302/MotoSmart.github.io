# MotoSmart - Inicio de sesion

El proyecto ahora tiene verificacion real de usuarios con PHP, sesiones y MySQL.

## Requisitos

- XAMPP o un servidor con PHP 8+.
- MySQL o MariaDB.

## Instalacion local con XAMPP

1. Copia la carpeta del proyecto dentro de `htdocs`.
2. Abre phpMyAdmin y ejecuta el archivo `database.sql`.
3. Revisa `api/config.php` y ajusta usuario, contrasena, host o puerto si tu MySQL no usa `root` sin contrasena.
4. Abre el proyecto desde Apache, por ejemplo:

```text
http://localhost/Proyecto%20Final/
```

## Como funciona

- `api/register.php` crea usuarios en la tabla `usuarios`.
- `api/login.php` busca el correo en la base de datos y valida la contrasena con `password_verify`.
- `api/me.php` devuelve el usuario activo si hay sesion.
- `api/logout.php` cierra la sesion.

## Azure

Para usar Azure Database for MySQL, crea el servidor y cambia `api/config.php` con los datos de Azure:

```php
return [
    'db_host' => 'tu-servidor.mysql.database.azure.com',
    'db_name' => 'motosmart',
    'db_user' => 'tu_usuario',
    'db_pass' => 'tu_contrasena',
    'db_port' => '3306',
];
```

Despues ejecuta `database.sql` en esa base de datos.

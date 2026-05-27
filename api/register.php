<?php
declare(strict_types=1);

require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Metodo no permitido.'], 405);
}

$data = get_json_input();

$nombre = trim((string) ($data['nombre'] ?? ''));
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');
$marca = trim((string) ($data['marca'] ?? ''));
$modelo = trim((string) ($data['modelo'] ?? ''));
$anio = isset($data['anio']) && $data['anio'] !== '' ? (int) $data['anio'] : null;
$kilometraje = isset($data['kilometraje']) && $data['kilometraje'] !== '' ? (int) $data['kilometraje'] : 0;

if ($nombre === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
    json_response(['ok' => false, 'message' => 'Completa nombre, correo valido y contrasena minima de 6 caracteres.'], 422);
}

$stmt = db()->prepare('SELECT id FROM usuarios WHERE email = ? LIMIT 1');
$stmt->execute([$email]);

if ($stmt->fetch()) {
    json_response(['ok' => false, 'message' => 'Ya existe un usuario con este correo.'], 409);
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = db()->prepare(
    'INSERT INTO usuarios (nombre, email, password_hash, marca, modelo, anio, kilometraje)
     VALUES (?, ?, ?, ?, ?, ?, ?)'
);

$stmt->execute([
    $nombre,
    $email,
    $passwordHash,
    $marca ?: null,
    $modelo ?: null,
    $anio,
    max(0, $kilometraje),
]);

json_response([
    'ok' => true,
    'message' => 'Usuario registrado correctamente.',
]);

<?php
declare(strict_types=1);

require __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'message' => 'Metodo no permitido.'], 405);
}

$data = get_json_input();
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    json_response(['ok' => false, 'message' => 'Correo o contrasena invalidos.'], 422);
}

$stmt = db()->prepare('SELECT * FROM usuarios WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['ok' => false, 'message' => 'El usuario no existe o la contrasena es incorrecta.'], 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int) $user['id'];

json_response([
    'ok' => true,
    'message' => 'Sesion iniciada.',
    'user' => public_user($user),
]);

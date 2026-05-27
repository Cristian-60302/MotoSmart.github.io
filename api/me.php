<?php
declare(strict_types=1);

require __DIR__ . '/db.php';

if (empty($_SESSION['user_id'])) {
    json_response(['ok' => true, 'user' => null]);
}

$stmt = db()->prepare('SELECT * FROM usuarios WHERE id = ? LIMIT 1');
$stmt->execute([(int) $_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    session_destroy();
    json_response(['ok' => true, 'user' => null]);
}

json_response([
    'ok' => true,
    'user' => public_user($user),
]);

<?php
declare(strict_types=1);

session_start();

header('Content-Type: application/json; charset=utf-8');

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);

    if (!is_array($data)) {
        json_response(['ok' => false, 'message' => 'Datos JSON invalidos.'], 400);
    }

    return $data;
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $configPath = __DIR__ . '/config.php';
    $config = file_exists($configPath)
        ? require $configPath
        : require __DIR__ . '/config.example.php';

    $host = $config['db_host'] ?? 'localhost';
    $port = $config['db_port'] ?? '3306';
    $name = $config['db_name'] ?? 'motosmart';
    $user = $config['db_user'] ?? 'root';
    $pass = $config['db_pass'] ?? '';

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4";

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $exception) {
        json_response([
            'ok' => false,
            'message' => 'No se pudo conectar con la base de datos.'
        ], 500);
    }

    return $pdo;
}

function public_user(array $user): array
{
    return [
        'id' => (int) $user['id'],
        'nombre' => $user['nombre'],
        'email' => $user['email'],
        'marca' => $user['marca'] ?? null,
        'modelo' => $user['modelo'] ?? null,
        'anio' => isset($user['anio']) ? (int) $user['anio'] : null,
        'kilometraje' => isset($user['kilometraje']) ? (int) $user['kilometraje'] : null,
    ];
}

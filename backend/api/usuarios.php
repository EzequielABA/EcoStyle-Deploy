<?php
// EcoStyle RD - API de Usuarios/Contactos
// GET /usuarios (listar), POST /usuarios (registrar contacto)

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . '/../config/database.php';
$db = new Database();
$pdo = $db->pdo;
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
  switch ($method) {
    case 'GET': {
      $stmt = $pdo->query('SELECT id, nombre, correo, mensaje, fecha FROM usuarios ORDER BY id DESC LIMIT 100');
      echo json_encode($stmt->fetchAll());
      break;
    }
    case 'POST': {
      $input = json_decode(file_get_contents('php://input'), true) ?? [];
      $nombre = $input['nombre'] ?? '';
      $correo = $input['correo'] ?? '';
      $mensaje = $input['mensaje'] ?? '';
      $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, correo, mensaje, fecha) VALUES (?, ?, ?, NOW())');
      $stmt->execute([$nombre, $correo, $mensaje]);
      echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
      break;
    }
    default:
      http_response_code(405);
      echo json_encode(['error' => 'Método no permitido']);
  }
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Error de servidor', 'message' => $e->getMessage()]);
}
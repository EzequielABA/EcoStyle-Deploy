<?php
// EcoStyle RD - API de Productos (PHP + MySQL)
// Endpoints REST: GET (lista / por id con filtros), POST (crear), PUT (actualizar), DELETE (borrar)

declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once __DIR__ . '/../config/database.php';
$db = new Database();
$pdo = $db->pdo;
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
  switch ($method) {
    case 'GET': {
      // GET /productos?id=X (por id) o /productos?categoria=X&precio_min=X&precio_max=X&disponible=X&buscar=...&orden=...&destacado=1&limite=...
      if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $pdo->prepare('SELECT p.id, p.nombre, p.descripcion, p.precio, p.precio_oferta, p.stock, p.disponible, p.destacado, p.imagen, p.categoria_id, c.nombre AS categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id WHERE p.id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        echo json_encode($row ?: null);
        break;
      }
      $categoriaId = isset($_GET['categoria']) && $_GET['categoria'] !== '' ? (int)$_GET['categoria'] : null;
      $min = isset($_GET['precio_min']) && $_GET['precio_min'] !== '' ? (float)$_GET['precio_min'] : null;
      $max = isset($_GET['precio_max']) && $_GET['precio_max'] !== '' ? (float)$_GET['precio_max'] : null;
      $disp = isset($_GET['disponible']) ? (string)$_GET['disponible'] : '';
      $q = isset($_GET['buscar']) ? trim((string)$_GET['buscar']) : (isset($_GET['q']) ? trim((string)$_GET['q']) : '');
      $orden = isset($_GET['orden']) ? (string)$_GET['orden'] : (isset($_GET['sort']) ? (string)$_GET['sort'] : '');
      $destacado = isset($_GET['destacado']) ? (string)$_GET['destacado'] : '';
      $limite = isset($_GET['limite']) && $_GET['limite'] !== '' ? (int)$_GET['limite'] : 100;

      $sql = 'SELECT p.id, p.nombre, p.descripcion, p.precio, p.precio_oferta, p.stock, p.disponible, p.destacado, p.imagen, p.categoria_id, c.nombre AS categoria_nombre FROM productos p LEFT JOIN categorias c ON p.categoria_id = c.id';
      $where = [];
      $params = [];

      if ($categoriaId !== null) { $where[] = 'p.categoria_id = ?'; $params[] = $categoriaId; }
      if ($min !== null) { $where[] = 'p.precio >= ?'; $params[] = $min; }
      if ($max !== null) { $where[] = 'p.precio <= ?'; $params[] = $max; }
      if ($disp !== '') {
        // disponible puede ser 1/0, true/false
        $where[] = 'p.disponible = ?';
        $params[] = ($disp === '1' || strtolower($disp) === 'true') ? 1 : 0;
      }
      if ($destacado !== '') {
        $where[] = 'p.destacado = ?';
        $params[] = ($destacado === '1' || strtolower($destacado) === 'true') ? 1 : 0;
      }
      if ($q !== '') { $where[] = '(LOWER(p.nombre) LIKE ? OR LOWER(p.descripcion) LIKE ?)'; $params[] = '%' . strtolower($q) . '%'; $params[] = '%' . strtolower($q) . '%'; }

      if (!empty($where)) { $sql .= ' WHERE ' . implode(' AND ', $where); }
      switch ($orden) {
        case 'precio_asc': $sql .= ' ORDER BY p.precio ASC'; break;
        case 'precio_desc': $sql .= ' ORDER BY p.precio DESC'; break;
        case 'nombre_asc': $sql .= ' ORDER BY p.nombre ASC'; break;
        case 'nombre_desc': $sql .= ' ORDER BY p.nombre DESC'; break;
        default: $sql .= ' ORDER BY p.id DESC';
      }
      $sql .= ' LIMIT ' . (int)$limite;
      $stmt = $pdo->prepare($sql);
      $stmt->execute($params);
      echo json_encode($stmt->fetchAll());
      break;
    }

    case 'POST': {
       // POST /productos (crear)
       $input = json_decode(file_get_contents('php://input'), true) ?? [];
       $nombre = $input['nombre'] ?? '';
       $descripcion = $input['descripcion'] ?? '';
       $categoria_id = isset($input['categoria_id']) ? (int)$input['categoria_id'] : null;
       $precio = isset($input['precio']) ? (float)$input['precio'] : 0.0;
       $precio_oferta = isset($input['precio_oferta']) ? (float)$input['precio_oferta'] : null;
       $stock = isset($input['stock']) ? (int)$input['stock'] : 0;
       $disponible = isset($input['disponible']) ? (int)$input['disponible'] : 1;
       $destacado = isset($input['destacado']) ? (int)$input['destacado'] : 0;
       $imagen = $input['imagen'] ?? '';

       $stmt = $pdo->prepare('INSERT INTO productos (nombre, descripcion, categoria_id, precio, precio_oferta, stock, disponible, destacado, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
       $stmt->execute([$nombre, $descripcion, $categoria_id, $precio, $precio_oferta, $stock, $disponible, $destacado, $imagen]);
       echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
       break;
     }

    case 'PUT': {
       // PUT /productos?id=X (actualizar)
       if (!isset($_GET['id'])) { http_response_code(400); echo json_encode(['error' => 'Falta id']); break; }
       $id = (int)$_GET['id'];
       $input = json_decode(file_get_contents('php://input'), true) ?? [];
       $stmt = $pdo->prepare('UPDATE productos SET nombre = ?, descripcion = ?, categoria_id = ?, precio = ?, precio_oferta = ?, stock = ?, disponible = ?, destacado = ?, imagen = ? WHERE id = ?');
       $stmt->execute([
         $input['nombre'] ?? '',
         $input['descripcion'] ?? '',
         isset($input['categoria_id']) ? (int)$input['categoria_id'] : null,
         isset($input['precio']) ? (float)$input['precio'] : 0.0,
         isset($input['precio_oferta']) ? (float)$input['precio_oferta'] : null,
         isset($input['stock']) ? (int)$input['stock'] : 0,
         isset($input['disponible']) ? (int)$input['disponible'] : 1,
         isset($input['destacado']) ? (int)$input['destacado'] : 0,
         $input['imagen'] ?? '',
         $id
       ]);
       echo json_encode(['ok' => true]);
       break;
     }

    case 'DELETE': {
      // DELETE /productos?id=X (borrar)
      if (!isset($_GET['id'])) { http_response_code(400); echo json_encode(['error' => 'Falta id']); break; }
      $id = (int)$_GET['id'];
      $stmt = $pdo->prepare('DELETE FROM productos WHERE id = ?');
      $stmt->execute([$id]);
      echo json_encode(['ok' => true]);
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
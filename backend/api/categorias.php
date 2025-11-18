<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/Categoria.php';

$categoria = new Categoria();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Obtener categoría por ID
            $id = intval($_GET['id']);
            $resultado = $categoria->obtenerPorId($id);
        } elseif (isset($_GET['conteo'])) {
            // Obtener categorías con conteo de productos
            $resultado = $categoria->obtenerConConteo();
        } else {
            // Obtener todas las categorías
            $resultado = $categoria->obtenerTodas();
        }
        break;
    
    default:
        $resultado = [
            'success' => false,
            'message' => 'Método no permitido'
        ];
        http_response_code(405);
        break;
}

echo json_encode($resultado, JSON_UNESCAPED_UNICODE);
?>
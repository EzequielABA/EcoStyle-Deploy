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

require_once __DIR__ . '/../models/Producto.php';

$producto = new Producto();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Parámetros de búsqueda
        $termino = isset($_GET['q']) ? trim($_GET['q']) : '';
        $categoria = isset($_GET['categoria']) ? intval($_GET['categoria']) : null;
        $precio_min = isset($_GET['precio_min']) ? floatval($_GET['precio_min']) : null;
        $precio_max = isset($_GET['precio_max']) ? floatval($_GET['precio_max']) : null;
        $orden = isset($_GET['orden']) ? $_GET['orden'] : 'nombre_asc';
        $limite = isset($_GET['limite']) ? intval($_GET['limite']) : 20;
        
        // Validar límite
        if ($limite > 100) $limite = 100;
        if ($limite < 1) $limite = 20;
        
        $resultado = $producto->buscar($termino, $categoria, $precio_min, $precio_max, $orden, $limite);
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
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/Contacto.php';

$contacto = new Contacto();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Crear nuevo mensaje de contacto
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            $resultado = [
                'success' => false,
                'message' => 'Datos no válidos'
            ];
            http_response_code(400);
        } else {
            $resultado = $contacto->crear($input);
            if (!$resultado['success']) {
                http_response_code(400);
            }
        }
        break;
    
    case 'GET':
        // Obtener mensajes (solo para administración)
        $limite = isset($_GET['limite']) ? intval($_GET['limite']) : 50;
        if ($limite > 100) $limite = 100;
        
        $resultado = $contacto->obtenerTodos($limite);
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
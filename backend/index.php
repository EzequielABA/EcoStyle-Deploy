<?php
// EcoStyle RD - Router Principal API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener la ruta solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$script_name = $_SERVER['SCRIPT_NAME'];
$path = str_replace(dirname($script_name), '', $request_uri);
$path = trim($path, '/');

// Remover parámetros de consulta de la ruta
$path = explode('?', $path)[0];

// Rutas disponibles
$routes = [
    'productos' => 'api/productos.php',
    'categorias' => 'api/categorias.php',
    'buscar' => 'api/buscar.php',
    'contacto' => 'api/contacto.php',
    'ordenes' => 'api/ordenes.php'
];

// Verificar si la ruta existe
if (array_key_exists($path, $routes)) {
    $relative = $routes[$path];
    $file = __DIR__ . '/' . $relative;
    
    // Verificar si el archivo existe (usar ruta absoluta relativa a este archivo)
    if (is_file($file)) {
        require $file;
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint no encontrado',
            'file' => $relative
        ]);
    }
} else {
    // Ruta no encontrada
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Ruta no válida',
        'available_routes' => array_keys($routes)
    ]);
}
?>
<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'status' => 'EcoStyle API',
    'version' => '0.1.0',
    'endpoints' => [
        '/api/productos.php',
        '/api/usuarios.php'
    ]
]);
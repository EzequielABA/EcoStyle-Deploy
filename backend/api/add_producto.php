<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../models/Producto.php';

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Instanciar el modelo (usa su propia conexión internamente)
$producto = new Producto();

$data = json_decode(file_get_contents("php://input"));

if (
    isset($data->nombre, $data->descripcion, $data->precio, $data->categoria_id, $data->stock) &&
    $data->nombre !== '' && $data->descripcion !== '' && is_numeric($data->precio) && is_numeric($data->categoria_id) && is_numeric($data->stock)
) {
    $producto->nombre = (string)$data->nombre;
    $producto->descripcion = (string)$data->descripcion;
    $producto->precio = (float)$data->precio;
    $producto->categoria_id = (int)$data->categoria_id;
    $producto->stock = (int)$data->stock;
    $producto->imagen = isset($data->imagen) && $data->imagen !== '' ? (string)$data->imagen : null;
    $producto->destacado = isset($data->destacado) ? (bool)$data->destacado : false;

    if ($producto->create()) {
        http_response_code(201);
        echo json_encode(array("success" => true, "message" => "El producto fue creado."), JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(503);
        echo json_encode(array("success" => false, "message" => "No se pudo crear el producto."), JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "No se pudo crear el producto. Datos incompletos."), JSON_UNESCAPED_UNICODE);
}
?>
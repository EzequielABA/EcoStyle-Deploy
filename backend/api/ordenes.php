<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
$db = new Database();
$pdo = $db->pdo;

function generarNumeroOrden() {
    return 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
}

function validarDatosOrden($datos) {
    $errores = [];
    
    if (empty($datos['cliente_nombre'])) {
        $errores[] = 'El nombre del cliente es requerido';
    }
    
    if (empty($datos['cliente_email']) || !filter_var($datos['cliente_email'], FILTER_VALIDATE_EMAIL)) {
        $errores[] = 'Email válido es requerido';
    }
    
    if (empty($datos['cliente_direccion'])) {
        $errores[] = 'La dirección es requerida';
    }
    
    if (empty($datos['items']) || !is_array($datos['items']) || count($datos['items']) === 0) {
        $errores[] = 'La orden debe contener al menos un producto';
    }
    
    return $errores;
}

function validarStock($pdo, $items) {
    $errores = [];
    
    foreach ($items as $item) {
        if (!isset($item['id']) || !isset($item['quantity'])) {
            $errores[] = 'Datos de producto inválidos';
            continue;
        }
        
        $stmt = $pdo->prepare("SELECT nombre, stock, disponible, precio FROM productos WHERE id = ? AND disponible = 1");
        $stmt->execute([$item['id']]);
        $producto = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$producto) {
            $errores[] = "Producto con ID {$item['id']} no encontrado o no disponible";
            continue;
        }
        
        if ($producto['stock'] < $item['quantity']) {
            $errores[] = "Stock insuficiente para {$producto['nombre']}. Disponible: {$producto['stock']}, solicitado: {$item['quantity']}";
        }
    }
    
    return $errores;
}

function enviarFactura($para, $datosCliente, $numeroOrden, $items, $subtotal, $total) {
    $fmt = function($n) { return 'DOP ' . number_format((float)$n, 2, '.', ','); };
    $filas = '';
    foreach ($items as $it) {
        $filas .= '<tr>'
            . '<td style="padding:8px;border-bottom:1px solid #eee;">' . htmlspecialchars($it['producto_nombre']) . '</td>'
            . '<td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">' . (int)$it['cantidad'] . '</td>'
            . '<td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">' . $fmt($it['producto_precio']) . '</td>'
            . '<td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">' . $fmt($it['subtotal']) . '</td>'
            . '</tr>';
    }
    $html = '<html><body style="font-family:Arial,Helvetica,sans-serif;color:#111;">'
        . '<div style="max-width:640px;margin:0 auto;padding:16px;">'
        . '<h2 style="margin:0 0 8px 0;color:#10b981;">EcoStyle RD</h2>'
        . '<p style="margin:4px 0;color:#555;">Factura de orden <strong>' . htmlspecialchars($numeroOrden) . '</strong></p>'
        . '<div style="margin:12px 0;padding:12px;background:#f9fafb;border:1px solid #eee;border-radius:8px;">'
        . '<p style="margin:4px 0;"><strong>Cliente:</strong> ' . htmlspecialchars($datosCliente['cliente_nombre']) . '</p>'
        . '<p style="margin:4px 0;"><strong>Email:</strong> ' . htmlspecialchars($datosCliente['cliente_email']) . '</p>'
        . '<p style="margin:4px 0;"><strong>Teléfono:</strong> ' . htmlspecialchars($datosCliente['cliente_telefono'] ?? '') . '</p>'
        . '<p style="margin:4px 0;"><strong>Dirección:</strong> ' . htmlspecialchars($datosCliente['cliente_direccion']) . '</p>'
        . '</div>'
        . '<table style="width:100%;border-collapse:collapse;margin-top:8px;">'
        . '<thead>'
        . '<tr>'
        . '<th style="text-align:left;padding:8px;border-bottom:2px solid #10b981;">Producto</th>'
        . '<th style="text-align:center;padding:8px;border-bottom:2px solid #10b981;">Cant.</th>'
        . '<th style="text-align:right;padding:8px;border-bottom:2px solid #10b981;">Precio</th>'
        . '<th style="text-align:right;padding:8px;border-bottom:2px solid #10b981;">Subtotal</th>'
        . '</tr>'
        . '</thead>'
        . '<tbody>' . $filas . '</tbody>'
        . '</table>'
        . '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #eee;">'
        . '<p style="margin:4px 0;text-align:right;color:#333;"><strong>Subtotal:</strong> ' . $fmt($subtotal) . '</p>'
        . '<p style="margin:4px 0;text-align:right;color:#111;font-size:16px;"><strong>Total:</strong> ' . $fmt($total) . '</p>'
        . '</div>'
        . '<p style="margin-top:16px;color:#777;font-size:13px;">Gracias por comprar de forma sostenible con EcoStyle RD.</p>'
        . '</div>'
        . '</body></html>';
    $subject = 'EcoStyle RD — Factura ' . $numeroOrden;

    $host = getenv('MAIL_HOST') ?: 'smtp.gmail.com';
    $user = getenv('MAIL_USER') ?: 'servidorminecratf6@gmail.com';
    $pass = getenv('MAIL_PASS') ?: 'iixgzydcmschajjt';
    $port = getenv('MAIL_PORT') ?: '587';
    $secure = getenv('MAIL_SECURE') ?: 'tls';

    if ($host && $user && $pass) {
        @require_once __DIR__ . '/../vendor/autoload.php';
        if (class_exists('\\PHPMailer\\PHPMailer\\PHPMailer')) {
            try {
                $mailerClass = '\\PHPMailer\\PHPMailer\\PHPMailer';
                $mailer = new $mailerClass(true);
                $mailer->isSMTP();
                $mailer->Host = $host;
                $mailer->SMTPAuth = true;
                $mailer->Username = $user;
                $mailer->Password = $pass;
                $mailer->Port = (int)$port;
                $mailer->SMTPSecure = $secure;
                $mailer->CharSet = 'UTF-8';
                $mailer->setFrom($user, 'EcoStyle RD');
                $mailer->addAddress($para);
                $mailer->Subject = $subject;
                $mailer->isHTML(true);
                $mailer->Body = $html;
                $mailer->AltBody = strip_tags('Factura ' . $numeroOrden . ' — Total: ' . $fmt($total));
                $mailer->send();
                return true;
            } catch (Exception $e) {
                // Fallback abajo
            }
        }
    }

    $headers = "MIME-Version: 1.0\r\n" .
        "Content-type: text/html; charset=UTF-8\r\n" .
        "From: EcoStyle RD <no-reply@ecostyle.local>\r\n" .
        "Reply-To: soporte@ecostyle.local\r\n";
    $ok = @mail($para, $subject, $html, $headers);
    return $ok ? true : false;
}

function crearOrden($pdo, $datosOrden) {
    try {
        $pdo->beginTransaction();
        
        // Generar número de orden único
        $numeroOrden = generarNumeroOrden();
        
        // Calcular totales
        $subtotal = 0;
        $itemsValidados = [];
        
        foreach ($datosOrden['items'] as $item) {
            $stmt = $pdo->prepare("SELECT nombre, precio, precio_oferta FROM productos WHERE id = ? AND disponible = 1");
            $stmt->execute([$item['id']]);
            $producto = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$producto) {
                throw new Exception("Producto no encontrado: {$item['id']}");
            }
            
            $precio = $producto['precio_oferta'] ?? $producto['precio'];
            $itemSubtotal = $precio * $item['quantity'];
            $subtotal += $itemSubtotal;
            
            $itemsValidados[] = [
                'producto_id' => $item['id'],
                'producto_nombre' => $producto['nombre'],
                'producto_precio' => $precio,
                'cantidad' => $item['quantity'],
                'subtotal' => $itemSubtotal
            ];
        }
        
        $total = $subtotal; // Por ahora sin impuestos ni envío
        
        // Insertar orden
        $stmt = $pdo->prepare("
            INSERT INTO ordenes (
                numero_orden, cliente_nombre, cliente_email, cliente_telefono, 
                cliente_direccion, subtotal, total, notas
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $numeroOrden,
            $datosOrden['cliente_nombre'],
            $datosOrden['cliente_email'],
            $datosOrden['cliente_telefono'] ?? null,
            $datosOrden['cliente_direccion'],
            $subtotal,
            $total,
            $datosOrden['notas'] ?? null
        ]);
        
        $ordenId = $pdo->lastInsertId();
        
        // Insertar items de la orden
        $stmt = $pdo->prepare("
            INSERT INTO orden_items (
                orden_id, producto_id, producto_nombre, producto_precio, cantidad, subtotal
            ) VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        foreach ($itemsValidados as $item) {
            $stmt->execute([
                $ordenId,
                $item['producto_id'],
                $item['producto_nombre'],
                $item['producto_precio'],
                $item['cantidad'],
                $item['subtotal']
            ]);
            
            // Actualizar stock
            $stmtStock = $pdo->prepare("UPDATE productos SET stock = stock - ? WHERE id = ?");
            $stmtStock->execute([$item['cantidad'], $item['producto_id']]);
        }
        
        $pdo->commit();
        
        $sentCliente = enviarFactura($datosOrden['cliente_email'], $datosOrden, $numeroOrden, $itemsValidados, $subtotal, $total);
        $sentAdmin = enviarFactura('Ezequielabad03@gmail.com', $datosOrden, $numeroOrden, $itemsValidados, $subtotal, $total);
        
        return [
            'success' => true,
            'orden_id' => $ordenId,
            'numero_orden' => $numeroOrden,
            'total' => $total,
            'mensaje' => 'Orden creada exitosamente',
            'email_cliente' => $sentCliente,
            'email_admin' => $sentAdmin
        ];
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
}

// Manejar diferentes métodos HTTP
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                throw new Exception('Datos JSON inválidos');
            }
            
            // Validar datos de la orden
            $errores = validarDatosOrden($input);
            if (!empty($errores)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'errores' => $errores
                ]);
                exit();
            }
            
            // Validar stock
            $erroresStock = validarStock($pdo, $input['items']);
            if (!empty($erroresStock)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'errores' => $erroresStock
                ]);
                exit();
            }
            
            // Crear la orden
            $resultado = crearOrden($pdo, $input);
            
            http_response_code(201);
            echo json_encode($resultado);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
        
    case 'GET':
        try {
            // Obtener órdenes (opcional, para administración)
            $stmt = $pdo->prepare("
                SELECT o.*, COUNT(oi.id) as total_items 
                FROM ordenes o 
                LEFT JOIN orden_items oi ON o.id = oi.orden_id 
                GROUP BY o.id 
                ORDER BY o.fecha_creacion DESC 
                LIMIT 50
            ");
            $stmt->execute();
            $ordenes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode([
                'success' => true,
                'ordenes' => $ordenes
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'error' => 'Método no permitido'
        ]);
        break;
}
?>

<?php
require_once __DIR__ . '/../config/database.php';

class Contacto {
    private $conn;
    private $table = 'contactos';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function crear($datos) {
        try {
            // Validar datos requeridos
            if (empty($datos['nombre']) || empty($datos['email']) || 
                empty($datos['asunto']) || empty($datos['mensaje'])) {
                return [
                    'success' => false,
                    'message' => 'Todos los campos obligatorios deben ser completados'
                ];
            }

            // Validar email
            if (!$this->validarEmail($datos['email'])) {
                return [
                    'success' => false,
                    'message' => 'El formato del email no es válido'
                ];
            }

            $query = "INSERT INTO " . $this->table . " 
                     (nombre, email, telefono, asunto, mensaje) 
                     VALUES (:nombre, :email, :telefono, :asunto, :mensaje)";
            
            $stmt = $this->conn->prepare($query);
            
            // Limpiar y preparar datos
            $nombre = htmlspecialchars(strip_tags($datos['nombre']));
            $email = htmlspecialchars(strip_tags($datos['email']));
            $telefono = isset($datos['telefono']) ? htmlspecialchars(strip_tags($datos['telefono'])) : null;
            $asunto = htmlspecialchars(strip_tags($datos['asunto']));
            $mensaje = htmlspecialchars(strip_tags($datos['mensaje']));
            
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':telefono', $telefono);
            $stmt->bindParam(':asunto', $asunto);
            $stmt->bindParam(':mensaje', $mensaje);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Mensaje enviado correctamente. Te contactaremos pronto.',
                    'id' => $this->conn->lastInsertId()
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Error al enviar el mensaje'
                ];
            }
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al procesar el mensaje: ' . $e->getMessage()
            ];
        }
    }

    public function validarEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function obtenerTodos($limite = 50) {
        try {
            $query = "SELECT * FROM " . $this->table . " 
                     ORDER BY fecha_envio DESC 
                     LIMIT :limite";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':limite', $limite, PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener mensajes: ' . $e->getMessage()
            ];
        }
    }

    public function marcarComoLeido($id) {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET leido = 1 
                     WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            
            if ($stmt->execute()) {
                return [
                    'success' => true,
                    'message' => 'Mensaje marcado como leído'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Error al marcar mensaje como leído'
                ];
            }
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al actualizar mensaje: ' . $e->getMessage()
            ];
        }
    }
}
?>
<?php
require_once __DIR__ . '/../config/database.php';

class Categoria {
    private $conn;
    private $table = 'categorias';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function obtenerTodas() {
        try {
            $query = "SELECT * FROM " . $this->table . " 
                     WHERE activa = 1 
                     ORDER BY nombre ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener categorías: ' . $e->getMessage()
            ];
        }
    }

    public function obtenerPorId($id) {
        try {
            $query = "SELECT * FROM " . $this->table . " 
                     WHERE id = :id AND activa = 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $categoria = $stmt->fetch();
            
            if ($categoria) {
                return [
                    'success' => true,
                    'data' => $categoria
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Categoría no encontrada'
                ];
            }
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener categoría: ' . $e->getMessage()
            ];
        }
    }

    public function obtenerConConteo() {
        try {
            $query = "SELECT c.*, COUNT(p.id) as total_productos 
                     FROM " . $this->table . " c 
                     LEFT JOIN productos p ON c.id = p.categoria_id AND p.disponible = 1
                     WHERE c.activa = 1 
                     GROUP BY c.id 
                     ORDER BY c.nombre ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener categorías con conteo: ' . $e->getMessage()
            ];
        }
    }
}
?>
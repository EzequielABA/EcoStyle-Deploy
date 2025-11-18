<?php
require_once __DIR__ . '/../config/database.php';

class Producto {
    private $conn;
    private $table = 'productos';

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function obtenerTodos() {
        try {
            $query = "SELECT p.*, c.nombre as categoria_nombre 
                     FROM " . $this->table . " p 
                     LEFT JOIN categorias c ON p.categoria_id = c.id 
                     WHERE p.disponible = 1 
                     ORDER BY p.fecha_creacion DESC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener productos: ' . $e->getMessage()
            ];
        }
    }

    public function obtenerPorId($id) {
        try {
            $query = "SELECT p.*, c.nombre as categoria_nombre 
                     FROM " . $this->table . " p 
                     LEFT JOIN categorias c ON p.categoria_id = c.id 
                     WHERE p.id = :id AND p.disponible = 1";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $producto = $stmt->fetch();
            
            if ($producto) {
                return [
                    'success' => true,
                    'data' => $producto
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Producto no encontrado'
                ];
            }
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener producto: ' . $e->getMessage()
            ];
        }
    }

    public function obtenerDestacados() {
        try {
            $query = "SELECT p.*, c.nombre as categoria_nombre 
                     FROM " . $this->table . " p 
                     LEFT JOIN categorias c ON p.categoria_id = c.id 
                     WHERE p.destacado = 1 AND p.disponible = 1 
                     ORDER BY p.fecha_creacion DESC 
                     LIMIT 6";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener productos destacados: ' . $e->getMessage()
            ];
        }
    }

    public function buscar($termino = '', $categoria = null, $precio_min = null, $precio_max = null, $orden = 'nombre_asc', $limite = 20) {
        try {
            $query = "SELECT p.*, c.nombre as categoria_nombre 
                     FROM " . $this->table . " p 
                     LEFT JOIN categorias c ON p.categoria_id = c.id 
                     WHERE p.disponible = 1";
            
            $params = [];
            
            // Filtro por término de búsqueda
            if (!empty($termino)) {
                $query .= " AND (p.nombre LIKE :termino OR p.descripcion LIKE :termino)";
                $params[':termino'] = '%' . $termino . '%';
            }
            
            // Filtro por categoría
            if ($categoria !== null) {
                $query .= " AND p.categoria_id = :categoria";
                $params[':categoria'] = $categoria;
            }
            
            // Filtro por precio mínimo
            if ($precio_min !== null) {
                $query .= " AND p.precio >= :precio_min";
                $params[':precio_min'] = $precio_min;
            }
            
            // Filtro por precio máximo
            if ($precio_max !== null) {
                $query .= " AND p.precio <= :precio_max";
                $params[':precio_max'] = $precio_max;
            }
            
            // Ordenamiento
            switch ($orden) {
                case 'precio_asc':
                    $query .= " ORDER BY p.precio ASC";
                    break;
                case 'precio_desc':
                    $query .= " ORDER BY p.precio DESC";
                    break;
                case 'nombre_desc':
                    $query .= " ORDER BY p.nombre DESC";
                    break;
                default:
                    $query .= " ORDER BY p.nombre ASC";
            }
            
            $query .= " LIMIT :limite";
            
            $stmt = $this->conn->prepare($query);
            
            // Bind de parámetros
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll(),
                'total' => $stmt->rowCount()
            ];
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error en la búsqueda: ' . $e->getMessage()
            ];
        }
    }

    public function obtenerPorCategoria($categoria_id, $limite = 20) {
        try {
            $query = "SELECT p.*, c.nombre as categoria_nombre 
                     FROM " . $this->table . " p 
                     LEFT JOIN categorias c ON p.categoria_id = c.id 
                     WHERE p.categoria_id = :categoria_id AND p.disponible = 1 
                     ORDER BY p.nombre ASC 
                     LIMIT :limite";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':categoria_id', $categoria_id, PDO::PARAM_INT);
            $stmt->bindParam(':limite', $limite, PDO::PARAM_INT);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll()
            ];
        } catch(PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error al obtener productos por categoría: ' . $e->getMessage()
            ];
        }
    }
}
?>
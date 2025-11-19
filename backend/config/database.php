<?php
declare(strict_types=1);

class Database {
    private string $host = '127.0.0.1';
    private string $db   = 'ecostyle_new';
    private string $user = 'root';
    private string $pass = '';
    private string $charset = 'utf8mb4';
    private int $port = 3306;

    public \PDO $pdo;
    private $conn;

    public function __construct() {
        $options = [
            \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            \PDO::ATTR_EMULATE_PREPARES => false,
        ];
        // Conectar únicamente al puerto 3307
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db};charset={$this->charset}";
            $this->pdo = new \PDO($dsn, $this->user, $this->pass, $options);
            $this->conn = $this->pdo;
            return;
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Error de conexión a la base de datos',
                'message' => 'No fue posible conectar al puerto 3307',
                'detail' => $e->getMessage()
            ]);
            exit;
        }
    }

    public function getConnection() {
        return $this->conn;
    }
}
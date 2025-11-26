<?php
declare(strict_types=1);

class Database {

    private string $host;
    private string $db;
    private string $user;
    private string $pass;
    private int $port;
    private string $charset = 'utf8mb4';

    public \PDO $pdo;

    public function __construct() {

        // Variables de entorno de Render
        $this->host = getenv('MYSQLHOST');
        $this->db   = getenv('MYSQLDATABASE');
        $this->user = getenv('MYSQLUSER');
        $this->pass = getenv('MYSQLPASSWORD');
        $this->port = intval(getenv('MYSQLPORT'));

        // Configuraciones PDO
        $options = [
            \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            \PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db};charset={$this->charset}";
            $this->pdo = new \PDO($dsn, $this->user, $this->pass, $options);

        } catch (\PDOException $e) {

            http_response_code(500);

            echo json_encode([
                'error'   => 'Error de conexión a la base de datos',
                'message' => 'No fue posible conectar al servidor MySQL',
                'detail'  => $e->getMessage()
            ]);
            exit;
        }
    }

    public function getConnection() {
        return $this->pdo;
    }
}

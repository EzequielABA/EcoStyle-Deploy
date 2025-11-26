<?php
require_once "Database.php";

$db = new Database();
$conn = $db->getConnection();

$stmt = $conn->query("SHOW TABLES");
echo json_encode($stmt->fetchAll());

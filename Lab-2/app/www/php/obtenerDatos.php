<?php
// Devuelve los datos en formato JSON
header('Content-Type: application/json');
// Realiza la conexión a la base de datos y consulta los datos
require_once('../conexion.php');

// Consulta para obtener los datos de la tabla "Person"
$sql = "SELECT ID, Nombre, Apellido FROM Person";
$result = $conn->query($sql);

// Construye un array de resultados
$data = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Cierra la conexión a la base de datos
$conn->close();

// Devuelve los datos en formato JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
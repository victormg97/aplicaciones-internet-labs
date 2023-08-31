<?php
// Verifica si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Conexión a la base de datos MySQL
    $servername = "db";
    $username = "root";
    $password = "test";
    $dbname = "dbname";

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Se verifica si la conexión se estableció correctamente
    if ($conn->connect_error) {
        die("La conexión a la base de datos falló: " . $conn->connect_error);
    }

    // Obtiene los datos del formulario
    $nombre = $_POST["nombre"];
    $apellido = $_POST["apellido"];

    // Inserta los datos en la base de datos
    $sql = "INSERT INTO Person (name, last_name) VALUES ('$nombre', '$apellido')";

    if ($conn->query($sql) === TRUE) {
        echo "Registro exitoso";
    } else {
        echo "Error al registrar: " . $conn->error;
    }

    // Cierra la conexión a la base de datos
    $conn->close();
}
?>

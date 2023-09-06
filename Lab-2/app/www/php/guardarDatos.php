<?php
// Verifica que la solicitud sea de tipo POST y contiene datos JSON
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    if (json_last_error() === JSON_ERROR_NONE) {
        // Realiza la conexión a tu base de datos y otras configuraciones necesarias
        require_once('../conexion.php');

        // Itera sobre los datos recibidos y guarda en la base de datos
        foreach ($data as $item) {
            $id = $item["id"];
            $nombre = $item["nombre"];
            $apellido = $item["apellido"];

            // Validar los datos
            if (empty($id) || empty($nombre) || empty($apellido)) {
                // Si los datos no son válidos
                echo json_encode(array("success" => false));
                $conn->close();
                exit();
            }

            // Realiza una consulta para verificar si ya existe un registro con estos datos
            $sql = "SELECT ID FROM Person WHERE Nombre = '$nombre' AND Apellido = '$apellido'";
            $result = $conn->query($sql);

            if ($result->num_rows == 0) {
                // Si no existe un registro con estos datos, realiza la inserción
                $sql_insert = "INSERT INTO Person (Nombre, Apellido) VALUES ('$nombre', '$apellido')";
                if ($conn->query($sql_insert) !== TRUE) {
                    // Si ocurre un error en la inserción
                    echo json_encode(array("success" => false, "message" => "Error al guardar los datos."));
                    $conn->close();
                    exit();
                }
            }
        }

        // Cierra la conexión a la base de datos
        $conn->close();

        // Si todo fue exitoso, envía una respuesta JSON de éxito
        echo json_encode(array("success" => true));
    } else {
        // Si los datos JSON no son válidos, envía una respuesta de error
        echo json_encode(array("success" => false));
    }
} else {
    // Si la solicitud no es de tipo POST, envía una respuesta de error
    echo json_encode(array("success" => false));
}
?>
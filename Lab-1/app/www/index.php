
<html>
    <head>
        <title>Aplicaciones de Internet</title>
        <meta charset="utf-8">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                <h1>Aplicaciones de Internet</h1>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>id</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                        </tr>
                    </thead>
                    <?php

                        $conn = mysqli_connect('db', 'root', 'test', "dbname");

                        $query = 'SELECT * From Person';
                        $result = mysqli_query($conn, $query);

                        while($value = $result->fetch_array(MYSQLI_ASSOC)){
                            echo '<tr>';
                            echo '<td><a href="#"><span class="glyphicon glyphicon-search"></span></a></td>';
                            foreach($value as $element){
                                echo '<td>' . $element . '</td>';
                            }

                            echo '</tr>';
                        }

                        $result->close();
                        mysqli_close($conn);
                    ?>
                </table>
            </div>
            <h2>Formulario de Registro</h2>
            <form action="procesar_registro.php" method="POST">
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre:</label>
                    <input type="text" class="form-control" id="nombre" name="nombre" required>
                </div>
                <div class="mb-3">
                    <label for="apellido" class="form-label">Apellido:</label>
                    <input type="text" class="form-control" id="apellido" name="apellido" required>
                </div>
                <button type="submit" class="btn btn-primary">Registrar</button>
            </form>
        </div>
    </body>
</html>

document.getElementById("usuariosP").addEventListener("change", function() {
    document.getElementById("codigoSucursalGroup").style.display = this.checked ? "block" : "none";
});

function generateSQL() {
    const idUsuarioPrivado = document.getElementById("idUsuarioPrivado").value;
    const cedula = document.getElementById("cedula").value;
    const primerNombre = document.getElementById("primerNombre").value.toUpperCase(); // Nombres en mayúsculas
    const segundoNombre = document.getElementById("segundoNombre").value.toUpperCase(); // Nombres en mayúsculas
    const primerApellido = document.getElementById("primerApellido").value.toUpperCase(); // Apellidos en mayúsculas
    const segundoApellido = document.getElementById("segundoApellido").value.toUpperCase(); // Apellidos en mayúsculas
    const email = document.getElementById("email").value;
    const usuario = document.getElementById("usuario").value;
    const idUsuarioRegional = parseInt(document.getElementById("idUsuarioRegional").value); // Toma el valor ingresado
    const idUsuarioRol = document.getElementById("idUsuarioRol").value;
    const idRol = document.getElementById("idRol").value;

    const insertUser = `-- CREAR USUARIO\ninsert into usuarios.usuarioprivado 
    (idusuarioprivado, idtipousuario, numerodocumento, primernombre, segundonombre, primerapellido, segundoapellido, usuario, "password", email, habilitado, usuariocreacion, fechacreacion, contestapqrs) 
    values (${idUsuarioPrivado}, 1, ${cedula}, '${primerNombre}', '${segundoNombre}', '${primerApellido}', '${segundoApellido}', '${usuario}', '${cedula}', '${email}', true, 'davila', current_timestamp, false);`;

    let sqlQueries = [insertUser];

    if (document.getElementById("usuariosP").checked) {
        const codigoSucursal = document.getElementById("codigoSucursal").value;
        const nombreCompleto = `${capitalizar(primerNombre)} ${capitalizar(segundoNombre)} ${capitalizar(primerApellido)} ${capitalizar(segundoApellido)}`; // Formato correcto para nombres

        const insertUsuarioP = `-- USUARIOSP\ninsert into usuariosp
        (codigousuario, nombresapellidos, dispositivoimp, codigosucursal, habilitado, nitcliente, iddepartamento, email)
        values ('${usuario}', '${nombreCompleto}', '', ${codigoSucursal}, TRUE, 0, 0, '${email}');`;
        sqlQueries.push(insertUsuarioP);
    }

    const regionales = [
        { id: 1, name: "CALI" },
        { id: 2, name: "BOGOTA" },
        { id: 3, name: "PEREIRA" },
        { id: 4, name: "BARRANQUILLA" },
        { id: 5, name: "MEDELLIN" },
        { id: 6, name: "IBAGUE" },
        { id: 7, name: "BUCARAMANGA" }
    ];

    let currentIdUsuarioRegional = idUsuarioRegional; // Inicializa el ID a partir del valor ingresado

    regionales.forEach(regional => {
        if (document.getElementById(`regional${regional.id}`).checked) {
            const insertRegional = `-- REGIONALES\ninsert into usuarios.usuarioregionales 
            (idusuarioregional, idusuario, idregional, nombre, habilitado, usuariocreacion, fechacreacion)
            values (${currentIdUsuarioRegional}, ${idUsuarioPrivado}, ${regional.id}, '${regional.name}', true, 'davila', current_timestamp);`;
            sqlQueries.push(insertRegional);
            currentIdUsuarioRegional++; // Incrementa el ID para la siguiente regional
        }
    });

    const insertRol = `-- ROL\ninsert into usuarios.usuariosrol 
    (idusuariorol, idusuario, idrol) 
    values (${idUsuarioRol}, ${idUsuarioPrivado}, ${idRol});`;
    sqlQueries.push(insertRol);

    document.getElementById("sqlOutput").innerText = sqlQueries.join("\n\n");
}

// Función para capitalizar la primera letra de cada palabra (solo para la consulta de usuariosP)
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase(); // Cambia el resto a minúsculas
}

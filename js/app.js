let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente')
btnGuardarCliente.addEventListener('click', guardarCliente)

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value
    const hora = document.querySelector('#hora').value

    //Revisar campos vacios
    const camposVacios = [mesa, hora].some(campo => campo === '')

    if (camposVacios) {
        // Verificar si existe la alerta
        const existeAlerta = document.querySelector('.existe')

        if (!existeAlerta) {
            const alerta = document.createElement('DIV')
            alerta.classList.add('existe', 'invalid-feedback', 'd-block', 'text-center')
            alerta.textContent = 'Todos los campos son obligatorios'
            document.querySelector('.modal-body form').appendChild(alerta)

            setTimeout(() => {
                alerta.remove()
            }, 3000);
        }
        return

    }

    // Asginar datos del formulario al objeto de cliente
    cliente = { ...cliente, mesa, hora }

    // Ocultar Modal
    const modalFormulario = document.querySelector('#formulario')
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario)
    modalBootstrap.hide()


    //Mostrar las secciones
    mostrarSecciones()
    //Obtener platillos de la API de json-server
    obtenerPlatillos()
}

function mostrarSecciones() {
    const seccionOculta = document.querySelectorAll('.d-none')
    seccionOculta.forEach(seccion => seccion.classList.remove('d-none'))
}

function obtenerPlatillos() {
    const url = 'http://localhost:4000/platillos'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostarPlatillos(resultado))
        .catch(error => console.log(error))
}

function mostarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido')

    platillos.forEach(platillo => {
        const row = document.createElement('DIV')
        row.classList.add('row', 'py-3', 'border-top')

        const nombre = document.createElement('DIV')
        nombre.classList.add('col-md-4')
        nombre.textContent = platillo.nombre

        const precio = document.createElement('DIV')
        precio.classList.add('col-md-3', 'fw-bold')
        precio.textContent = `$${platillo.precio}`

        const categoria = document.createElement('DIV')
        categoria.classList.add('col-md-3')
        categoria.textContent = categorias[platillo.categoria]

        const inputCantidad = document.createElement('INPUT')
        inputCantidad.type = 'number'
        inputCantidad.min = 0
        inputCantidad.value = 0
        inputCantidad.id = `producto-${platillo.id}`
        inputCantidad.classList.add('form-control')

        // Funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value)
            agregarPlatillo({ ...platillo, cantidad })
        }

        const agregar = document.createElement('DIV')
        agregar.classList.add('col-md-2')
        agregar.appendChild(inputCantidad)

        row.appendChild(nombre)
        row.appendChild(precio)
        row.appendChild(categoria)
        row.appendChild(agregar)

        contenido.appendChild(row)
    })
}

function agregarPlatillo(producto) {
    // Extraer el pedido actual
    let { pedido } = cliente

    // Revisar que la cantidad sea mayor a 0
    if (producto.cantidad > 0) {
        // Comprueba si el elemeonto ya existe en el array
        if (pedido.some(articulo => articulo.id === producto.id)) {
            // El pedido ya existe, Actualizar la cantidad
            const pedidoActualizado = pedido.map(articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad
                }
                return articulo
            })
            // se asigna el nuevo array
            cliente.pedido = [...pedidoActualizado]

        } else {
            // El articulo no existe, lo agregamos al array de pedido
            cliente.pedido = [...pedido, producto]
        }
    } else {
        const resultado = pedido.filter(articulo => articulo.id !== producto.id)
        cliente.pedido = [...resultado]
    }

    //Limpiar codifo HTML previo
    limpiarHTML()

    // Mostramos el resumen en pantalla
    actualizarResumen()
}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido')

    const resumen = document.createElement('DIV')
    resumen.classList.add('col-md-6')

    // Infomacion de la mesa
    const mesa = document.createElement('P')
    mesa.textContent = 'Mesa: '
    mesa.classList.add('fw-bold')

    const mesaSpan = document.createElement('SPAN')
    mesaSpan.textContent = cliente.mesa
    mesaSpan.classList.add('fw-normal')

    //Informacion de la hora
    const hora = document.createElement('P')
    hora.textContent = 'Hora: '
    hora.classList.add('fw-bold')

    const horaSpan = document.createElement('SPAN')
    horaSpan.textContent = cliente.hora
    horaSpan.classList.add('fw-normal')

    //Agragar elementos padre
    mesa.appendChild(mesaSpan)
    hora.appendChild(horaSpan)

    resumen.appendChild(mesa)
    resumen.appendChild(hora)

    contenido.appendChild(resumen)

}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido')

    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild)
    }
}
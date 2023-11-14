let cliente = {
    mesa: '',
    hora: '',
    pedido: []
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

        }


    } else {
        console.log(' Todos los campos estan llenops')
    }
}
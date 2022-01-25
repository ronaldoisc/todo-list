const d = document;
let tareas = {};
const $formulario = d.getElementById('form');
const $template = d.getElementById('template-task').content;
const $fragment = d.createDocumentFragment();
const $listTask = d.getElementById('list-task');
const $alerta = d.getElementById('alerta');
let alerta = "";
const $formu = d.querySelector('.formu');
d.addEventListener("submit", e => {
    if (e.target == $formulario) {
        e.preventDefault();
        setTarea(e);

    }
});
d.addEventListener("DOMContentLoaded", () => {

    const getTareas=localStorage.getItem('tareas');
    tareas=JSON.parse(getTareas) || {}
   
    showListTask();
})
const setTarea = (e) => {

    if (e.target[0].value.trim() === '') {
        alert("Mensaje vacio");
        return;
    }
    Swal.fire({
        title: '¿Estas Seguro de almacenar la tarea?',
        text: "Si estas seguro,presiona la tecla aceptar",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        if (result.isConfirmed) {
            const objTarea = {
                id: Date.now(),
                mensaje: e.target[0].value,
                estado: false
            }
            tareas[objTarea.id] = objTarea;
            

            $formulario.reset();


            showListTask();
            Swal.fire(
                'Correcto!',
                'Tarea almacenada exitosamente',
                'success'
            )
        }
    })


};

const showListTask = () => {

    localStorage.setItem('tareas',JSON.stringify(tareas));
    
    if (Object.values(tareas).length === 0) {
        $listTask.innerHTML = `
        <div class="alert-desing" id="alerta">
        No hay Tareas 😥
        </div>`
        return;
    }

    $listTask.innerHTML = "";
    alerta = "";
    
   
    Object.values(tareas).forEach(el => {
      
        $template.querySelector('p').textContent = el.mensaje;
        if (el.estado) {
            $template.getElementById('tema').classList.remove("task-alert-false");
            $template.getElementById('tema').classList.add("task-alert-true");
            $template.querySelectorAll('.fas')[0].classList.replace("fa-check-circle", "fa-undo-alt")
        } else {
            $template.getElementById('tema').classList.remove("task-alert-true");
            $template.getElementById('tema').classList.add("task-alert-false");
            $template.querySelectorAll('.fas')[0].classList.replace("fa-undo-alt", "fa-check-circle")
        }
        $template.querySelector('.edit').dataset.id = el.id;
        $template.querySelector('.delete').dataset.id = el.id;

        let clone = d.importNode($template, true);
        $fragment.appendChild(clone);
    });
    $listTask.appendChild($fragment);

};

d.addEventListener("click", e => {

    if (e.target.matches(".edit")) {
       

        tareas[e.target.dataset.id].estado=true;
        showListTask();
    }
    if (e.target.classList.contains("fa-undo-alt")) {
       
        tareas[e.target.dataset.id].estado = false
        showListTask();
    }
    if (e.target.matches(".delete")) {
        Swal.fire({
            title: '¿Estas Seguro de eliminar la tarea?',
            text: "Si estas seguro,presiona la tecla aceptar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                delete tareas[e.target.dataset.id];
                showListTask();
                Swal.fire(
                    'Correcto!',
                    'Tarea eliminada exitosamente',
                    'success'
                )
            }
        })

    }
    e.stopPropagation();
});
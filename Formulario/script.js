

const disciplinas = ["algebra", "geometria", "biologia", "quimica", "fisica", "filosofia", "sociologia", "geografia", "historia", "portugues", "redacao", "ingles", "ed_fisica", "artes", "literatura"];
const campos = ["escrita", "pratica", "participacao", "simulado"];
const maximos = {escrita: 3, pratica: 2, participacao:2, simulado: 2};

//Atualizar total sempre que um campo for alterado
window.addEventListener('DOMContentLoaded', () => {

    let form = document.getElementById("form");

    form.addEventListener("submit", (e) => {
        e.preventDefault()
    })

    campos.forEach(campo => {
        document.getElementById(campo).addEventListener("input", atualizarTotal);
    });
});


function atualizarTotal() {
    const escrita = parseFloat(document.getElementById('escrita').value) || 0;
    const pratica = parseFloat(document.getElementById('pratica').value) || 0;
    const participacao = parseFloat(document.getElementById('participacao').value) || 0;
    const simulado = parseFloat(document.getElementById('simulado').value) || 0;
    const total = escrita + pratica + participacao + simulado;
    document.getElementById('total').textContent = `Total: ${total.toFixed(1)} / 10`;
}

function salvarNotas() {
    let disciplina = document.getElementById("notaForm").value;
    const notas = {};
    campos.forEach(campo => {
        notas[campo] = document.getElementById(campo).value;
    });
    localStorage.setItem("notas_" + disciplina, JSON.stringify(notas));
    atualizarHistorico();
}

function carregarNotas(disciplina) {
    const notasSalvas = localStorage.getItem("notas_" + disciplina);
    if (notasSalvas) {
        const notas = JSON.parse(notasSalvas);
        campos.forEach((campo) => {
            document.getElementById(campo).value = notas[campo] || "";
        });
    } else {
        campos.forEach((campo) => {
            document.getElementById(campo).value = "";
        });
    }
    atualizarTotal();
}

function atualizarHistorico() {
    const ul = document.getElementById("historicoBody");
    ul.innerHTML = "";
    disciplinas.forEach((disciplina) => {
        const notasSalvas = localStorage.getItem("notas_" + disciplina);
        if (notasSalvas) {
            const notas = JSON.parse(notasSalvas);
            const total =
            (parseFloat(notas.escrita) || 0) +
            (parseFloat(notas.pratica) || 0) +
            (parseFloat(notas.participacao) || 0) +
            (parseFloat(notas.simulado) || 0);

        const li = document.createElement("li");
        li.innerHTML = ` 
        <strong>${capitalize(disciplina)}</strong>
        Escrita: ${notas.escrita || "-"},
        Prática: ${notas.pratica || "-"},
        Participação: ${notas.participacao || "-"},
        Simulado: ${notas.simulado || "-"},
        Total: ${total.toFixed(1)}
        <button onclick="editarNotas('${disciplina}')">Editar</button>
        <button onclick="apagarNotas('${disciplina}')">Apagar</button>
        `;
        ul.appendChild(li);
        }
    });
    if (ul.innerHTML === "") {
        ul.innerHTML = `<li>Nenhuma nota salva ainda.</li>`;
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

document.getElementById("disciplina").addEventListener("change", function (){
    carregarNotas(this.value);
});

document
    .getElementById("notaForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();
        const disciplina = Document.getElementById("disciplina").value;
        if (!validarNotas()) return;
        salvarNotas(disciplina);
        mostrarMensagem("Notas salvas para " + capitalize(disciplina) + "!");
    });

window.editarNotas = function (disciplina) {
    document.getElementById("disciplina").value = disciplina;
    carregarNotas(disciplina);
    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.apagarNotas = function (disciplina) {
    if (
        confirm(
            "Deseja realmente apagar as notas de " + capitalize(disciplina) + "?"
        )
    ) {
        localStorage.removeItem("notas_" + disciplina);
        atualizarHistorico();
        mostrarMensagem("Notas apagadas para " + capitalize(disciplina) + ".");
        if (document.getElementById("disciplina").value === disciplina) {
            carregarNotas(disciplina);
        }
    }
};

window.limparTodasNotas = function () {
    if (confirm("Deseja realmente apagar TODAS as notas?")) {
        disciplinas.forEach((disciplina) => 
            localStorage.removeItem("notas_" + disciplina)
        );
        atualizarHistorico();
        mostrarMensagem("Todas as notas foram apagadas.");
        carregarNotas(document.getElementById("disciplina").value);
    }
};

function mostrarMensagem(msg) {
    const section = document.getElementById("msg");
    section.textContent = msg;
    setTimeout(() => {
        section.textContent = ""
    }, 2500);
}

function validarNotas() {
    for (let campo of campos) {
        const valor = parseFloat(document.getElementById(campo).value);
        if (isNaN(valor) || valor < 0 || valor > maximos[campo]) {
            mostrarMensagem(
                `O valor de "${capitalize(campo)}" deve ser entre 0 e ${maximos[campo]}`
            );
            return false;
        }
    }
    return true;
}

window.onload = function () {
    carregarNotas(document.getElementById("disciplina").value);
    atualizarHistorico();
};
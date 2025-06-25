
const disciplinas = ["algebra", "geometria", "biologia", "quimica", "fisica", "filosofia", "sociologia", "geografia", "historia", "portugues", "redacao", "ingles", "ed_fisica", "artes", "literatura"];
const campos = ["escrita", "pratica", "partipacao", "simulado"];
const maximos = {escrita: 3, pratica: 2, participacao:2, simulado: 2};

//Atualizar total sempre que um campo for alterado
campos.forEach(campo => {
    document.getElementById(campo).addEventListener("input", atualizarTotal);
})

function atualizarTotal() {
    const escrita = parseFloat(document.getElementById('escrita').value) || 0;
    const pratica = parseFloat(document.getElementById('pratica').value) || 0;
    const participacao = parseFloat(document.getElementById('participacao').value) || 0;
    const simulado = parseFloat(document.getElementById('simulado').value) || 0;
    const total = escrita + pratica + participacao + simulado;
    document.getElementById('total').textContent = `Total: ${total.toFixed(1)} / 10`;
}

function salvarNotas(disciplinas) {
    const notas = {};
    campos.forEach(campos => {
        notas[campo] = document.getElementById(campo).value;
    });
    localStorage.setItem("notas_" + disciplinas, JSON.stringify(notas));
    atualizarHistorico();
}

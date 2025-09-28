let alunoAtual = ""; 
let serieAtual = "";

function abrirAba(nome) {
  document.querySelectorAll(".aba").forEach(a => a.classList.remove("ativa"));
  document.getElementById("aba-" + nome).classList.add("ativa");
}

function pedirSenha() {
  let senha = prompt("Digite a senha para acessar a área dos criadores:");
  if(senha === "2anoA") {
    abrirAba('criadores');
    mostrarCriadores();
  } else {
    alert("Senha incorreta!");
  }
}

// LOGIN
document.getElementById("formLogin").addEventListener("submit", function(e){
  e.preventDefault();
  alunoAtual = document.getElementById("nome").value;
  serieAtual = document.getElementById("serie").value;
  alert("Login realizado com sucesso!");
  abrirAba("calculo");
});

// CÁLCULO
document.getElementById('formCalculo').addEventListener('submit', function(e){
  e.preventDefault();

  let peso = parseFloat(document.getElementById('peso').value);
  let altura = parseFloat(document.getElementById('altura').value);
  let pesoDesejado = parseFloat(document.getElementById('pesoDesejado').value);
  let atividade = document.getElementById('atividade').value;
  let objetivo = document.getElementById('objetivo').value;

  let imc = peso / (altura * altura);
  let diferenca = pesoDesejado - peso;

  // Classificação IMC
  let classificacao = "";
  if(imc < 18.5) classificacao = "Abaixo do peso";
  else if(imc < 25) classificacao = "Peso normal";
  else if(imc < 30) classificacao = "Sobrepeso";
  else classificacao = "Obesidade";

  // Sugestões de alimentos
  let alimentos = [];
  if(objetivo === "massa") {
    alimentos = ["Ovos", "Frango", "Peixe", "Arroz integral", "Aveia", "Oleaginosas"];
  } else if(objetivo === "gordura") {
    alimentos = ["Frutas", "Vegetais", "Peito de frango", "Peixes", "Iogurte natural", "Oleaginosas"];
  } else if(objetivo === "manter") {
    alimentos = ["Frutas", "Vegetais", "Carnes magras", "Cereais integrais", "Oleaginosas"];
  }

  // Tabela de resultados
  let resultado = `
    <table>
      <tr><th>IMC</th><td>${imc.toFixed(2)}</td></tr>
      <tr><th>Classificação</th><td>${classificacao}</td></tr>
      <tr><th>Diferença até o peso desejado</th><td>${diferenca.toFixed(1)} kg</td></tr>
      <tr><th>Alimentos sugeridos</th><td>${alimentos.join(', ')}</td></tr>
    </table>
  `;

  document.getElementById('respostas').innerHTML = resultado;
  abrirAba('respostas');

  // Salvar histórico
  let historico = JSON.parse(localStorage.getItem('historicoRespostas') || "[]");
  historico.push({
    nome: alunoAtual,
    serie: serieAtual,
    peso,
    altura,
    pesoDesejado,
    atividade,
    objetivo,
    imc: imc.toFixed(2),
    classificacao
  });
  localStorage.setItem('historicoRespostas', JSON.stringify(historico));
});

// Mostrar histórico
function mostrarCriadores() {
  let dados = document.getElementById('dadosCriadores');
  let historico = JSON.parse(localStorage.getItem('historicoRespostas') || "[]");
  if(historico.length === 0){
    dados.innerHTML = "<p>Nenhum histórico salvo.</p>";
    return;
  }

  let html = "<div class='table-wrap'><table><thead><tr><th>#</th><th>Aluno</th><th>Série</th><th>Peso (kg)</th><th>Altura (m)</th><th>Peso desejado</th><th>Atividade</th><th>Objetivo</th><th>IMC</th><th>Classificação</th></tr></thead><tbody>";
  historico.forEach((item, i) => {
    html += `<tr>
      <td>${i+1}</td>
      <td>${item.nome || "-"}</td>
      <td>${item.serie || "-"}</td>
      <td>${item.peso}</td>
      <td>${item.altura}</td>
      <td>${item.pesoDesejado}</td>
      <td>${item.atividade}</td>
      <td>${item.objetivo}</td>
      <td>${item.imc}</td>
      <td>${item.classificacao}</td>
    </tr>`;
  });
  html += "</tbody></table></div>";
  dados.innerHTML = html;
}

function limparHistorico() {
  localStorage.removeItem('historicoRespostas');
  mostrarCriadores();
}

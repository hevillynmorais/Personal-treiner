// Controle de abas
function abrirAba(nome) {
  const abas = document.querySelectorAll('.aba');
  abas.forEach(aba => aba.classList.remove('ativa'));
  document.getElementById('aba-' + nome).classList.add('ativa');
}

// Área dos criadores com senha
function pedirSenha() {
  let senha = prompt("Digite a senha para acessar a aba dos criadores:");
  if(senha === "2anoA") {
    abrirAba('criadores');
    mostrarCriadores();
  } else {
    alert("Senha incorreta!");
  }
}

// Limpar histórico dos criadores
function limparHistorico() {
  localStorage.removeItem('historicoRespostas');
  mostrarCriadores();
}

// Login
document.getElementById('formLogin').addEventListener('submit', function(e){
  e.preventDefault();
  alert("Login efetuado com sucesso!");
  abrirAba('calculo');
});

// Função de cálculo e respostas
document.getElementById('formCalculo').addEventListener('submit', function(e){
  e.preventDefault();

  let peso = parseFloat(document.getElementById('peso').value);
  let altura = parseFloat(document.getElementById('altura').value);
  let pesoDesejado = parseFloat(document.getElementById('pesoDesejado').value);
  let atividade = document.getElementById('atividade').value;
  let objetivo = document.getElementById('objetivo').value;

  let imc = peso / (altura * altura);
  let diferenca = pesoDesejado - peso;

  let resultado = `<p>Seu IMC atual: ${imc.toFixed(1)}</p>`;
  resultado += `<p>Diferença para peso desejado: ${diferenca.toFixed(1)} kg</p>`;

  // Sugestões de alimentos
  let alimentos = [];
  if(objetivo === "massa") {
    alimentos = ["Ovos", "Frango", "Peixe", "Arroz integral", "Aveia", "Oleaginosas"];
  } else if(objetivo === "gordura") {
    alimentos = ["Frutas", "Vegetais", "Peito de frango", "Peixes", "Iogurte natural", "Oleaginosas"];
  } else if(objetivo === "manter") {
    alimentos = ["Frutas", "Vegetais", "Carnes magras", "Cereais integrais", "Oleaginosas"];
  }

  resultado += `<p>Alimentos sugeridos para seu objetivo: ${alimentos.join(', ')}</p>`;

  // Mostrar resultados
  document.getElementById('respostas').innerHTML = resultado;
  abrirAba('respostas');

  // Salvar no histórico dos criadores
  let historico = JSON.parse(localStorage.getItem('historicoRespostas') || "[]");
  historico.push({peso, altura, pesoDesejado, atividade, objetivo, imc: imc.toFixed(1)});
  localStorage.setItem('historicoRespostas', JSON.stringify(historico));
});

// Mostrar histórico dos criadores
function mostrarCriadores() {
  let dados = document.getElementById('dadosCriadores');
  let historico = JSON.parse(localStorage.getItem('historicoRespostas') || "[]");
  if(historico.length === 0){
    dados.innerHTML = "<p>Nenhum histórico salvo.</p>";
    return;
  }

  let html = "<ul>";
  historico.forEach((item, i) => {
    html += `<li>${i+1}. Peso: ${item.peso} kg, Altura: ${item.altura} m, Peso desejado: ${item.pesoDesejado} kg, Atividade: ${item.atividade}, Objetivo: ${item.objetivo}, IMC: ${item.imc}</li>`;
  });
  html += "</ul>";
  dados.innerHTML = html;
}

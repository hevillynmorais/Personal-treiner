let usuarios = [];
let alunoAtual = null;

function mostrarLogin(){
  document.getElementById('telaInicio').style.display='none';
  document.querySelectorAll('.aba').forEach(a=>a.style.display='none');
  document.getElementById('abaLogin').style.display='block';
}

// Botão da tela inicial
document.getElementById('btnLoginInicio').addEventListener('click', mostrarLogin);

// Login
document.getElementById('formLogin').addEventListener('submit', function(e){
  e.preventDefault();
  let email = document.getElementById('email').value;
  let altura = parseFloat(document.getElementById('altura').value);
  let peso = parseFloat(document.getElementById('peso').value);
  let serie = document.getElementById('serie').value;

  alunoAtual = {email, altura, peso, serie};
  mostrarAba('abaCalculo');
  this.reset();
});

// Mostrar aba específica
function mostrarAba(id){
  document.querySelectorAll('.aba').forEach(a=>a.style.display='none');
  document.getElementById(id).style.display='block';
}

// Cálculo IMC
document.getElementById('btnCalcular').addEventListener('click', function(){
  if(!alunoAtual) return;

  let imc = alunoAtual.peso / (alunoAtual.altura * alunoAtual.altura);
  let status = (imc > 25) ? "Acima do peso" : "Normal";
  alunoAtual.status = status;

  // Atualiza tabela aluno
  let tabela = document.getElementById('tabelaResultado');
  tabela.innerHTML = `<tr><td>${alunoAtual.email}</td><td>${alunoAtual.altura.toFixed(3)}</td><td>${alunoAtual.peso.toFixed(1)}</td><td>${status}</td></tr>`;

  // Adiciona ao histórico geral
  usuarios.push(alunoAtual);
  let tabelaC = document.getElementById('tabelaCriador');
  tabelaC.innerHTML = '';
  usuarios.forEach(u=>{
    tabelaC.innerHTML += `<tr><td>${u.email}</td><td>${u.email}</td><td>${u.altura.toFixed(3)}</td><td>${u.peso.toFixed(1)}</td><td>${u.status}</td></tr>`;
  });

  mostrarAba('abaResposta');
});

// Área do Criador com senha
function acessarCriador(){
  let senha = prompt("Digite a senha do criador:");
  if(senha === "2anoA"){
    mostrarAba('abaCriador');
  } else{
    alert("Senha incorreta!");
  }
}

let usuarios = [];

function mostrarLogin(){
  document.getElementById('telaInicio').style.display = 'none';
  mostrarAba('abaLogin');
}

function mostrarAba(id){
  document.querySelectorAll('.aba').forEach(a=>a.style.display='none');
  document.getElementById(id).style.display='block';
}

document.getElementById('formLogin').addEventListener('submit', function(e){
  e.preventDefault();
  let email = document.getElementById('email').value;
  let altura = parseFloat(document.getElementById('altura').value);
  let peso = parseFloat(document.getElementById('peso').value);

  let status = (peso / (altura * altura) > 25) ? "Acima do peso" : "Normal";

  let usuario = {email, altura, peso, status};
  usuarios.push(usuario);

  // Atualiza tabela aluno
  let tabela = document.getElementById('tabelaResultado');
  let tr = document.createElement('tr');
  tr.innerHTML = `<td>${email}</td><td>${altura.toFixed(3)}</td><td>${peso.toFixed(1)}</td><td>${status}</td>`;
  tabela.appendChild(tr);

  // Atualiza tabela criador
  let tabelaC = document.getElementById('tabelaCriador');
  let trC = document.createElement('tr');
  trC.innerHTML = `<td>${email}</td><td>${email}</td><td>${altura.toFixed(3)}</td><td>${peso.toFixed(1)}</td><td>${status}</td>`;
  tabelaC.appendChild(trC);

  mostrarAba('abaAluno');
  this.reset();
});

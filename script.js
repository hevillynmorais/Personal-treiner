function abrirAba(nome){
  document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
  const el = document.getElementById('aba-'+nome);
  if(el) el.classList.add('ativa');
}

// --- armazenamento ---
let usuarioAtual = null;
let historico = JSON.parse(localStorage.getItem('pt_historico') || '[]');

// --- LOGIN ---
const formLogin = document.getElementById('formLogin');
if(formLogin){
  formLogin.addEventListener('submit', e=>{
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const serie = document.getElementById('serie').value;
    const sexo = document.getElementById('sexo').value;
    const email = document.getElementById('email').value.trim();

    usuarioAtual = { nome, serie, sexo, email };
    localStorage.setItem('pt_usuario', JSON.stringify(usuarioAtual));

    abrirAba('calculo');
  });
}

// --- CÁLCULO ---
const formCalculo = document.getElementById('formCalculo');
const respostasDiv = document.getElementById('respostas');

if(formCalculo){
  formCalculo.addEventListener('submit', e=>{
    e.preventDefault();
    const peso = parseFloat(document.getElementById('peso').value);
    const altura = parseFloat(document.getElementById('altura').value);
    const atividade = document.getElementById('atividade').value;
    const objetivo = document.getElementById('objetivo').value;

    if(!usuarioAtual){ alert('Faça login primeiro!'); return; }

    const imc = peso / (altura*altura);
    let status = '';
    if(imc<18.5) status='Abaixo do peso';
    else if(imc<25) status='Normal';
    else status='Acima do peso';

    let exercicio, sono, alimentacao;

    switch(atividade){
      case 'sedentario': exercicio='30 min/dia caminhada'; break;
      case 'leve': exercicio='30-60 min/dia exercícios leves'; break;
      case 'moderado': exercicio='60 min/dia moderado'; break;
      case 'intenso': exercicio='60-90 min/dia intenso'; break;
    }

    switch(objetivo){
      case 'massa': alimentacao='Proteínas + carboidratos saudáveis'; break;
      case 'gordura': alimentacao='Reduzir carboidratos + proteínas moderadas'; break;
      case 'manter': alimentacao='Equilibrada e variada'; break;
    }

    sono='7-9 horas/dia';

    // Armazenar no histórico
    const registro = {
      ...usuarioAtual,
      peso, altura, imc:imc.toFixed(2),
      status, exercicio, sono, alimentacao
    }
    historico.push(registro);
    localStorage.setItem('pt_historico', JSON.stringify(historico));

    // Mostrar tabela de respostas
    respostasDiv.innerHTML = `<table>
      <tr><th>Nome</th><th>Email</th><th>Peso</th><th>Altura</th><th>IMC</th><th>Status</th><th>Exercício</th><th>Sono</th><th>Alimentação</th></tr>
      <tr>
        <td>${registro.nome}</td>
        <td>${registro.email}</td>
        <td>${registro.peso}</td>
        <td>${registro.altura}</td>
        <td>${registro.imc}</td>
        <td>${registro.status}</td>
        <td>${registro.exercicio}</td>
        <td>${registro.sono}</td>
        <td>${registro.alimentacao}</td>
      </tr>
    </table>`;

    abrirAba('respostas');
  });
}

// --- ÁREA DO CRIADOR ---
function pedirSenha(){
  const senha = prompt('Digite a senha de acesso:');
  if(senha==='2anoA'){
    mostrarCriadores();
    abrirAba('criadores');
  } else alert('Senha incorreta!');
}

function mostrarCriadores(){
  const div = document.getElementById('dadosCriadores');
  if(historico.length===0){
    div.innerHTML='<p>Nenhum registro encontrado.</p>';
    return;
  }

  let tabela = `<table>
    <tr><th>Nome</th><th>Email</th><th>Série</th><th>Sexo</th><th>Peso</th><th>Altura</th><th>IMC</th><th>Status</th><th>Exercício</th><th>Sono</th><th>Alimentação</th></tr>`;

  historico.forEach(r=>{
    tabela+=`<tr>
      <td>${r.nome}</td>
      <td>${r.email}</td>
      <td>${r.serie}</td>
      <td>${r.sexo}</td>
      <td>${r.peso}</td>
      <td>${r.altura}</td>
      <td>${r.imc}</td>
      <td>${r.status}</td>
      <td>${r.exercicio}</td>
      <td>${r.sono}</td>
      <td>${r.alimentacao}</td>
    </tr>`;
  });
  tabela+='</table>';
  div.innerHTML=tabela;
}

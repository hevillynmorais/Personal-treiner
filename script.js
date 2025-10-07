function abrirAba(nome){
  document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
  const el = document.getElementById('aba-'+nome);
  if(el) el.classList.add('ativa');
}

// --- armazenamento ---
let usuarioAtual = JSON.parse(localStorage.getItem('pt_usuario')); // Tenta carregar o usuário ao iniciar
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

    // Variáveis para o cálculo na tela do aluno
    const imcFormula = `IMC = Peso (kg) / [Altura (m)]²`;
    const imcCalculo = `IMC = ${peso} / (${altura.toFixed(3)} * ${altura.toFixed(3)}) = ${imc.toFixed(2)}`;

    // Mostrar a tabela de respostas no formato Campo/Valor
    respostasDiv.innerHTML = `
      <h3>Detalhamento do Cálculo</h3>
      <p><b>Fórmula utilizada:</b> ${imcFormula}</p>
      <p><b>Seu cálculo:</b> ${imcCalculo}</p>
      <hr>
      
      <h3>Seus Resultados e Recomendações</h3>
      
      <table>
        <tr><th>CAMPO</th><th>VALOR</th></tr>
        
        <tr><td>Nome</td><td>${registro.nome}</td></tr>
        <tr><td>Email</td><td>${registro.email}</td></tr>
        <tr><td>Série</td><td>${registro.serie}</td></tr>
        <tr><td>Sexo</td><td>${registro.sexo}</td></tr>
        
        <tr><td>Peso</td><td>${registro.peso} kg</td></tr>
        <tr><td>Altura</td><td>${registro.altura} m</td></tr>
        <tr><td>IMC</td><td>${registro.imc}</td></tr>
        <tr><td>Status</td><td>${registro.status}</td></tr>
        
        <tr><td>Exercício</td><td>${registro.exercicio}</td></tr>
        <tr><td>Sono</td><td>${registro.sono}</td></tr>
        <tr><td>Alimentação</td><td>${registro.alimentacao}</td></tr>
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

// Gerar lista de nomes clicáveis
function mostrarCriadores(){
  const div = document.getElementById('dadosCriadores');
  
  if(historico.length === 0){
    div.innerHTML = '<p>Nenhum registro encontrado.</p>';
    return;
  }

  // Cria a lista de nomes clicáveis
  let listaHTML = '<h3>Selecione um Aluno:</h3><ul>';
  
  historico.forEach((registro, index) => {
    // Chama a função mostrarDetalheRegistro ao clicar
    listaHTML += `<li><button class="link-btn" onclick="mostrarDetalheRegistro(${index})">${registro.nome} (${registro.email})</button></li>`;
  });
  
  // O div #detalheRegistro vai aparecer abaixo da lista
  listaHTML += '</ul><hr><div id="detalheRegistro"></div>';
  div.innerHTML = listaHTML;
}

// Exibir a tabela de detalhes do registro selecionado (Formato Campo/Valor)
function mostrarDetalheRegistro(index) {
  const registro = historico[index];
  const detalheDiv = document.getElementById('detalheRegistro');

  if (!registro) {
    detalheDiv.innerHTML = '<p>Registro não encontrado.</p>';
    return;
  }

  // Monta a tabela de detalhes
  let tabela = `
    <h4>Detalhes de ${registro.nome}</h4>
    <table>
      <tr><th>CAMPO</th><th>VALOR</th></tr>
      <tr><td>Nome</td><td>${registro.nome}</td></tr>
      <tr><td>Email</td><td>${registro.email}</td></tr>
      <tr><td>Série</td><td>${registro.serie}</td></tr>
      <tr><td>Sexo</td><td>${registro.sexo}</td></tr>
      <tr><td>Peso</td><td>${registro.peso} kg</td></tr>
      <tr><td>Altura</td><td>${registro.altura} m</td></tr>
      <tr><td>IMC</td><td>${registro.imc}</td></tr>
      <tr><td>Status</td><td>${registro.status}</td></tr>
      <tr><td>Exercício</td><td>${registro.exercicio}</td></tr>
      <tr><td>Sono</td><td>${registro.sono}</td></tr>
      <tr><td>Alimentação</td><td>${registro.alimentacao}</td></tr>
    </table>
  `;
  
  detalheDiv.innerHTML = tabela;
}

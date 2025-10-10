function abrirAba(nome){
  document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
  const el = document.getElementById('aba-'+nome);
  if(el) el.classList.add('ativa');
}

// --- armazenamento ---
let usuarioAtual = JSON.parse(localStorage.getItem('pt_usuario'));
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

    if(!nome || !email){
      alert('Por favor, preencha nome e email.');
      return;
    }

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

    const pesoStr = document.getElementById('peso').value;
    const alturaStr = document.getElementById('altura').value;

    const peso = parseFloat(pesoStr.replace(',', '.'));
    const altura = parseFloat(alturaStr.replace(',', '.'));

    if(!usuarioAtual){ alert('Faça login primeiro!'); return; }
    if(isNaN(peso) || peso <= 0){
      alert('Por favor, insira um peso válido.');
      return;
    }
    if(isNaN(altura) || altura <= 0){
      alert('Por favor, insira uma altura válida.');
      return;
    }

    const atividade = document.getElementById('atividade').value;
    const objetivo = document.getElementById('objetivo').value;

    const imc = peso / (altura * altura);
    let status = '';
    if(imc < 18.5) status = 'Abaixo do peso';
    else if(imc < 25) status = 'Normal';
    else status = 'Acima do peso';

    let exercicio, sono, alimentacao;

    switch(atividade){
      case 'sedentario': exercicio = '30 min/dia caminhada'; break;
      case 'leve': exercicio = '30-60 min/dia exercícios leves'; break;
      case 'moderado': exercicio = '60 min/dia moderado'; break;
      case 'intenso': exercicio = '60-90 min/dia intenso'; break;
    }

    switch(objetivo){
      case 'massa': alimentacao = 'Proteínas + carboidratos saudáveis'; break;
      case 'gordura': alimentacao = 'Reduzir carboidratos + proteínas moderadas'; break;
      case 'manter': alimentacao = 'Equilibrada e variada'; break;
      case 'definir': alimentacao = 'Proteínas + controle de carboidratos'; break;
      case 'emagrecer': alimentacao = 'Dieta hipocalórica, mais fibras'; break;
      case 'ganhar_forca': alimentacao = 'Proteínas + carboidratos complexos'; break;
      default: alimentacao = 'Equilibrada e variada'; break;
    }

    sono = '7-9 horas/dia';

    // Armazenar no histórico
    const registro = {
      ...usuarioAtual,
      peso, altura,
      imc: imc.toFixed(2),
      status, exercicio, sono, alimentacao
    };
    historico.push(registro);
    localStorage.setItem('pt_historico', JSON.stringify(historico));

    const imcFormula = `IMC = Peso (kg) / [Altura (m)]²`;
    const imcCalculo = `IMC = ${peso} / (${altura.toFixed(3)} * ${altura.toFixed(3)}) = ${imc.toFixed(2)}`;

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
  if(senha === '2anoA'){
    mostrarCriadores();
    abrirAba('criadores');
  } else alert('Senha incorreta!');
}

function mostrarCriadores(){
  const div = document.getElementById('dadosCriadores');
  if(historico.length === 0){
    div.innerHTML = '<p>Nenhum registro encontrado.</p>';
    return;
  }

  let listaHTML = '<h3>Selecione um Aluno:</h3><ul>';
  historico.forEach((registro, index) => {
    listaHTML += `<li><button class="link-btn" onclick="mostrarDetalheRegistro(${index})">${registro.nome} (${registro.email})</button></li>`;
  });
  listaHTML += '</ul><hr><div id="detalheRegistro"></div>';
  div.innerHTML = listaHTML;
}

function mostrarDetalheRegistro(index) {
  const registro = historico[index];
  const detalheDiv = document.getElementById('detalheRegistro');

  if(!registro){
    detalheDiv.innerHTML = '<p>Registro não encontrado.</p>';
    return;
  }

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

// --- ALIMENTAÇÃO (Nova aba) ---
const formAlimentacao = document.getElementById('formAlimentacao');
const resultadoAlimentacao = document.getElementById('resultadoAlimentacao');

if(formAlimentacao){
  formAlimentacao.addEventListener('submit', e => {
    e.preventDefault();
    const alimentos = document.getElementById('alimentos').value.trim();

    if(!alimentos){
      resultadoAlimentacao.innerHTML = '<p style="color:#ffc107;">Por favor, insira seus alimentos.</p>';
      return;
    }

    // Simples exemplo: só lista os alimentos informados e dá uma dica genérica
    resultadoAlimentacao.innerHTML = `
      <h3>Sua lista de alimentos:</h3>
      <p>${alimentos.replace(/\n/g, '<br>')}</p>
      <hr>
      <h3>Dica para sua alimentação:</h3>
      <p>Para uma alimentação equilibrada, tente variar as fontes de proteínas, carboidratos e incluir muitas frutas e vegetais.</p>
    `;

    // Aqui você pode colocar lógica para analisar os alimentos e dar dicas mais específicas
  });
}

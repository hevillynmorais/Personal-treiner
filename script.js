/**
 * script.js
 * Lógica para o Escritório Personal Trainer
 */

// --- Funções de Navegação ---
function abrirAba(nome){
  document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
  const el = document.getElementById('aba-'+nome);
  if(el) el.classList.add('ativa');
  // Se for a aba criadores, garante que o histórico seja carregado
  if(nome === 'criadores') mostrarCriadores();
}


// --- Armazenamento Global e LocalStorage ---
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
    // Após o login, abre a aba de alimentação (novo fluxo)
    abrirAba('alimentacao'); 
});
}


// --- CÁLCULO e RESPOSTAS ---
const formCalculo = document.getElementById('formCalculo');
const respostasDiv = document.getElementById('respostas');

if(formCalculo){
  formCalculo.addEventListener('submit', e=>{
    e.preventDefault();

    const pesoStr = document.getElementById('peso').value;
    const alturaStr = document.getElementById('altura').value;

    // Permite vírgula ou ponto para números
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
    if(imc < 18.5) status = 'Abaixo do peso (Busque orientação profissional)';
    else if(imc < 25) status = 'Peso Normal (Ótimo!)';
    else if(imc < 30) status = 'Sobrepeso (Atenção)';
    else status = 'Obesidade (Busque orientação profissional)';

    let exercicio, sono, alimentacaoRecomendada;

    switch(atividade){
      case 'sedentario': exercicio = '30 min/dia de atividade leve (caminhada, alongamento)'; break;
      case 'leve': exercicio = '30-60 min/dia, 3x na semana (qualquer exercício)'; break;
      case 'moderado': exercicio = '60 min/dia, 5x na semana (combinação de força e cardio)'; break;
      case 'intenso': exercicio = '60-90 min/dia, 6-7x na semana (não esqueça do descanso!)'; break;
      default: exercicio = 'Siga as recomendações de saúde para sua idade.';
    }

    switch(objetivo){
      case 'massa': alimentacaoRecomendada = 'Foco em proteínas de alto valor biológico e calorias suficientes (superávit controlado).'; break;
      case 'gordura':
      case 'emagrecer': alimentacaoRecomendada = 'Priorize alimentos integrais e vegetais, mantenha proteínas altas e controle a ingestão calórica (déficit controlado).'; break;
      case 'manter': alimentacaoRecomendada = 'Dieta equilibrada, focando em variedade e moderação.'; break;
      case 'definir': alimentacaoRecomendada = 'Combinação de proteínas altas (para massa) e controle calórico (para redução de gordura).'; break;
      case 'ganhar_forca': alimentacaoRecomendada = 'Proteínas e carboidratos complexos ao redor do treino para energia e recuperação.'; break;
      default: alimentacaoRecomendada = 'Equilibrada e variada'; break;
    }

    sono = '7-9 horas/dia (crucial para recuperação muscular e hormonal)';

    // Armazenar no histórico
    const registro = {
      ...usuarioAtual,
      peso, altura,
      imc: imc.toFixed(2),
      status, exercicio, sono, alimentacaoRecomendada
    };
    
    // Atualiza ou adiciona o registro no histórico
    const historicoIndex = historico.findIndex(r => r.email === usuarioAtual.email);
    if(historicoIndex > -1){
        historico[historicoIndex] = registro;
    } else {
        historico.push(registro);
    }

    localStorage.setItem('pt_historico', JSON.stringify(historico));

    const imcFormula = `IMC = Peso (kg) / [Altura (m)]²`;
    const imcCalculo = `IMC = ${peso} / (${altura.toFixed(3)} \u00D7 ${altura.toFixed(3)}) = ${imc.toFixed(2)}`;

    respostasDiv.innerHTML = `
      <h3>Detalhamento do Cálculo</h3>
      <p><b>Fórmula utilizada:</b> ${imcFormula}</p>
      <p><b>Seu cálculo:</b> ${imcCalculo}</p>
      <hr>
      <h3>Seus Resultados e Recomendações</h3>
      <table>
        <tr><th>CAMPO</th><th>VALOR</th></tr>
        <tr><td>Nome</td><td>${registro.nome}</td></tr>
        <tr><td>Série</td><td>${registro.serie}</td></tr>
        <tr><td>IMC</td><td>${registro.imc}</td></tr>
        <tr><td>Status</td><td>${registro.status}</td></tr>
        <tr><td>Objetivo</td><td>${objetivo.charAt(0).toUpperCase() + objetivo.slice(1).replace('_', ' ')}</td></tr>
        <tr><td>Exercício</td><td>${registro.exercicio}</td></tr>
        <tr><td>Sono</td><td>${registro.sono}</td></tr>
        <tr><td>Alimentação</td><td>${registro.alimentacaoRecomendada}</td></tr>
      </table>
      <p class="alerta">
          ⚠️ <strong>ATENÇÃO:</strong> Estes resultados são educacionais. Para um plano seguro e eficaz, consulte um profissional de Educação Física e um Nutricionista.
      </p>
      `;

    abrirAba('respostas');
  });
}

// --- ÁREA DO CRIADOR (Histórico) ---
function pedirSenha(){
  const senha = prompt('Digite a senha de acesso:');
  if(senha === '2anoA'){ // Senha para o modo criador/admin
    abrirAba('criadores');
  } else if(senha !== null) {
      alert('Senha incorreta!');
  }
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
  // Usa o mesmo formato de tabela da aba Respostas para consistência
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
      <tr><td>Alimentação</td><td>${registro.alimentacaoRecomendada}</td></tr>
    </table>
  `;
  detalheDiv.innerHTML = tabela;
}

// --- ABA DE ALIMENTAÇÃO (Cardápio e Análise) ---

// NOVO OBJETO: LISTA DE ALIMENTOS COM VARIAÇÕES EXPANDIDA
const listaAlimentos = {
    'Pães e Cereais (Carboidratos)': {
        'Pão': ['Integral (melhor opção)', 'Australiano', 'De forma (moderado)', 'Francês (com moderação)', 'Pão Sírio/Pita'],
        'Arroz': ['Integral (melhor opção)', 'Parboilizado', 'Branco (com moderação)'],
        'Massas e Tubérculos': ['Batata Doce (melhor opção)', 'Mandioca/Aipim', 'Inhame', 'Macarrão Integral', 'Macarrão Branco (com moderação)'],
        'Cereais Matinais': ['Aveia (melhor opção)', 'Farinha de Milho/Fubá', 'Granola caseira sem açúcar', 'Cereais industrializados (evitar)'],
    },
    'Leguminosas e Sementes': {
        'Feijão': ['Preto', 'Carioca', 'Fradinho', 'Verde (todos excelentes fontes de fibras e ferro)'],
        'Outras Leguminosas': ['Lentilha', 'Grão de Bico', 'Ervilha'],
        'Sementes e Oleaginosas': ['Castanhas', 'Amendoim', 'Chia', 'Linhaça', 'Semente de Girassol'],
    },
    'Proteínas Animais (Magras)': {
        'Aves': ['Peito de frango (sem pele)', 'Cortes de peru'],
        'Peixes e Frutos do Mar': ['Salmão (rico em ômega-3)', 'Sardinha', 'Tilápia', 'Atum (conservado em água)'],
        'Carnes Vermelhas': ['Patinho', 'Alcatra', 'Músculo (cortes magros, com moderação)'],
        'Ovo': ['Cozido (excelente)', 'Mexido', 'Omelete (use pouco óleo/manteiga)'],
    },
    'Laticínios e Derivados': {
        'Leite': ['Desnatado', 'Semi-desnatado'],
        'Queijos (Priorize Magros)': ['Ricota', 'Cottage', 'Queijo Minas Frescal', 'Muçarela (com moderação)'],
        'Iogurte': ['Natural integral', 'Natural desnatado', 'Iogurte Grego (natural, sem açúcar)'],
    },
    'Vegetais e Verduras (Fibras e Vitaminas)': {
        'Folhas': ['Alface (todos os tipos)', 'Rúcula', 'Agrião', 'Espinafre', 'Couve'],
        'Legumes Cozidos': ['Brócolis', 'Couve-flor', 'Cenoura', 'Abobrinha', 'Berinjela', 'Beterraba'],
        'Legumes Crús': ['Tomate', 'Pepino', 'Pimentão', 'Cebola'],
    },
    'Fontes de Gordura Saudável': {
        'Óleos': ['Azeite de Oliva Extra Virgem', 'Óleo de Coco (com moderação)'],
        'Frutas/Sementes': ['Abacate', 'Azeitonas'],
    },
};


/**
 * Gera e exibe o cardápio detalhado de opções na aba de Alimentação.
 */
function mostrarCardapioOpcoes() {
    const cardapioDiv = document.getElementById('cardapioOpcoes');
    let html = '<h3>Guia de Opções Alimentares</h3>';
    
    // Para cada categoria principal (ex: Pães e Cereais)
    for (const categoria in listaAlimentos) {
        html += `<h4>${categoria}</h4>`;
        
        // Para cada alimento dentro da categoria (ex: Pão, Arroz)
        for (const alimento in listaAlimentos[categoria]) {
            html += `<h5>• ${alimento}:</h5>`;
            
            // Lista de variações
            const variacoes = listaAlimentos[categoria][alimento];
            html += `<ul>`;
            variacoes.forEach(variacao => {
                html += `<li>${variacao}</li>`;
            });
            html += `</ul>`;
        }
    }
    
    html += `<p class="alerta">
        **DICA:** Tente montar suas refeições com uma variedade de cores e texturas, priorizando as opções integrais e as proteínas magras!
    </p>`;

    cardapioDiv.innerHTML = html;
}


// --- ANÁLISE DE ALIMENTAÇÃO ---
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
    
    // Palavras-chave para análise simples e educativa
    const texto = alimentos.toLowerCase();
    let feedback = '';

    const bonsSinais = ['integral', 'aveia', 'ovo', 'frango', 'peixe', 'salada', 'fruta', 'vegetal', 'legume', 'grão de bico', 'lentilha'];
    const atencaoSinais = ['fritura', 'refrigerante', 'doce', 'fast food', 'salgadinho', 'refresco', 'salsicha', 'embutido'];

    let contBons = bonsSinais.filter(s => texto.includes(s)).length;
    let contAtencao = atencaoSinais.filter(s => texto.includes(s)).length;

    if (contBons >= 3 && contAtencao <= 1) {
        feedback = `
            <h3>Análise Preliminar</h3>
            <p>Seus hábitos demonstram **bons sinais** (${contBons} itens). Você está priorizando alimentos como proteínas magras e fibras. Continue buscando a variedade e a hidratação!</p>
        `;
    } else if (contAtencao >= 2) {
        feedback = `
            <h3>Análise Preliminar</h3>
            <p>Encontramos alguns itens (${contAtencao}) que sugerem um consumo elevado de **gorduras saturadas e açúcares** (como frituras e doces). Tente usar o "Guia de Opções Alimentares" acima para fazer trocas mais saudáveis e equilibradas.</p>
        `;
    } else {
        feedback = `
            <h3>Análise Preliminar</h3>
            <p>Não foi possível analisar detalhadamente. Lembre-se que uma alimentação saudável deve ser **variada** e incluir os três pilares: carboidratos (energia), proteínas (construção) e gorduras saudáveis (funções vitais).</p>
        `;
    }

    resultadoAlimentacao.innerHTML = feedback + `<p class="alerta">
    ⚠️ <strong>DISCLAIMER:</strong> Esta análise é simplificada e educacional. Apenas um **Nutricionista** pode montar um plano alimentar adequado, seguro e personalizado para você!
    </p>`;
  });
}


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Abrir a aba de início
    abrirAba('inicio');

    // 2. Pré-preencher o formulário de login se houver um usuário atual
    if (usuarioAtual) {
        document.getElementById('nome').value = usuarioAtual.nome || '';
        document.getElementById('serie').value = usuarioAtual.serie || '6';
        document.getElementById('sexo').value = usuarioAtual.sexo || 'M';
        document.getElementById('email').value = usuarioAtual.email || '';
    }
});

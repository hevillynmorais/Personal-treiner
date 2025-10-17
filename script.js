/**
 * script.js
 * Lógica para o Escritório Personal Trainer (Site do Aluno).
 * Inclui login, cálculo de IMC, recomendações e seleção de cardápio.
 */

// --- DADOS DO CARDÁPIO EXPANDIDO ---
const cardapioCompleto = {
    'Pães e Cereais (Carboidratos)': {
        'Pão': ['Integral (melhor opção)', 'Australiano', 'De forma (moderado)', 'Francês (com moderação)', 'Pão Sírio/Pita', 'Baguete', 'Pão de Centeio'],
        'Arroz': ['Integral (melhor opção)', 'Parboilizado', 'Branco (com moderação)', 'Arroz com legumes', 'Risoto (com moderação)'],
        'Massas e Tubérculos': ['Batata Doce (melhor opção)', 'Mandioca/Aipim', 'Inhame', 'Macarrão Integral', 'Macarrão Branco (com moderação)', 'Batata Inglesa (com casca)'],
        'Cereais e Grãos': ['Aveia (melhor opção)', 'Farinha de Milho/Fubá', 'Granola caseira sem açúcar', 'Cuscuz', 'Quinoa', 'Chia'],
        'Diversos': ['Tortillas de milho', 'Tapioca', 'Biscoito integral (sem açúcar)'],
    },
    'Leguminosas e Sementes': {
        'Feijão': ['Preto', 'Carioca', 'Fradinho', 'Verde', 'Branco (todos excelentes)'],
        'Outras Leguminosas': ['Lentilha', 'Grão de Bico', 'Ervilha', 'Soja e Tofu'],
        'Sementes e Oleaginosas': ['Castanha de Caju', 'Castanha do Pará', 'Amendoim', 'Nozes', 'Linhaça', 'Semente de Girassol', 'Gergelim'],
    },
    'Proteínas Animais (Magras)': {
        'Aves': ['Peito de frango (sem pele)', 'Cortes de peru', 'Coxa e Sobrecoxa (sem pele, assada)'],
        'Peixes e Frutos do Mar': ['Salmão (rico em ômega-3)', 'Sardinha', 'Tilápia', 'Atum (conservado em água)', 'Camarão', 'Bacalhau'],
        'Carnes Vermelhas': ['Patinho', 'Alcatra', 'Músculo', 'Filé Mignon (cortes magros, com moderação)'],
        'Ovo': ['Cozido (excelente)', 'Mexido', 'Omelete', 'Frito (com pouco óleo)'],
    },
    'Laticínios e Derivados': {
        'Leite': ['Desnatado', 'Semi-desnatado', 'Integral (com moderação)', 'Bebidas vegetais (amêndoa, coco)'],
        'Queijos (Priorize Magros)': ['Ricota', 'Cottage', 'Queijo Minas Frescal', 'Muçarela (com moderação)', 'Queijo Prato (com moderação)'],
        'Iogurte': ['Natural integral', 'Natural desnatado', 'Iogurte Grego (natural, sem açúcar)', 'Kefir'],
    },
    'Vegetais e Verduras (Fibras e Vitaminas)': {
        'Folhas': ['Alface (todos os tipos)', 'Rúcula', 'Agrião', 'Espinafre', 'Couve', 'Acelga', 'Repolho'],
        'Legumes Cozidos': ['Brócolis', 'Couve-flor', 'Cenoura', 'Abobrinha', 'Berinjela', 'Beterraba', 'Vagem', 'Quiabo'],
        'Legumes Crús': ['Tomate', 'Pepino', 'Pimentão', 'Cebola', 'Alho-poró'],
    },
    'Fontes de Gordura Saudável': {
        'Óleos': ['Azeite de Oliva Extra Virgem', 'Óleo de Coco (com moderação)', 'Óleo de Abacate'],
        'Frutas/Sementes': ['Abacate', 'Azeitonas', 'Óleo de Linhaça'],
    },
    'Frutas (Vitaminas e Açúcares Naturais)': {
        'Frutas Cítricas': ['Laranja', 'Limão', 'Tangerina', 'Kiwi'],
        'Frutas Vermelhas': ['Morango', 'Mirtilo (Blueberry)', 'Amora'],
        'Outras': ['Banana', 'Maçã (com casca)', 'Pêra', 'Mamão', 'Melancia', 'Melão', 'Uva', 'Abacaxi'],
    },
};


// --- Variáveis Globais ---
let usuarioAtual = JSON.parse(localStorage.getItem('pt_usuario'));
let historico = JSON.parse(localStorage.getItem('pt_historico') || '[]');

const cardapioDiv = document.getElementById('cardapioInterativo');
const listaSelecionadosP = document.getElementById('listaSelecionados');
const formSelecaoAlimentos = document.getElementById('formSelecaoAlimentos');
const formLogin = document.getElementById('formLogin');
const formCalculo = document.getElementById('formCalculo');
const respostasDiv = document.getElementById('respostas');


// --- Funções de Navegação ---
function abrirAba(nome){
    document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
    const el = document.getElementById('aba-'+nome);
    if(el) el.classList.add('ativa');
    // Se abrir a aba de alimentação, garante que o cardápio esteja carregado
    if (nome === 'alimentacao' && cardapioDiv && cardapioDiv.children.length === 0) {
        gerarCardapioInterativo();
    }
}


// --- LOGIN ---
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

        usuarioAtual = { nome, serie, sexo, email, selecaoAlimentos: [] }; // Reset ou inicializa seleção
        localStorage.setItem('pt_usuario', JSON.stringify(usuarioAtual));
        
        // Se a pessoa logar de novo, recarrega a seleção
        if(document.getElementById('cardapioInterativo').children.length > 0){
            carregarSelecaoSalva(); 
        }

        abrirAba('alimentacao'); 
    });
}


// --- LÓGICA DE CARDÁPIO (Alimentação) ---

/**
 * Gera o HTML dinâmico com todas as categorias e alimentos em checkboxes.
 */
function gerarCardapioInterativo() {
    let html = '';
    
    for (const categoria in cardapioCompleto) {
        html += `<div class="categoria-alimento card" style="margin-bottom: 20px; padding: 15px; border: 1px solid #ffc107;">
                    <h3>${categoria}</h3>`;
        
        for (const subgrupo in cardapioCompleto[categoria]) {
            html += `<h4>${subgrupo}:</h4><div style="display: flex; flex-wrap: wrap; gap: 10px 20px;">`;
            
            cardapioCompleto[categoria][subgrupo].forEach(alimento => {
                const id = 'alimento-' + alimento.replace(/[^a-zA-Z0-9]/g, '_'); 
                
                html += `
                    <label for="${id}" style="display: flex; align-items: center; margin-bottom: 5px; width: auto; font-weight: normal;">
                        <input type="checkbox" name="alimento" value="${alimento}" id="${id}" onchange="atualizarResumoSelecao()" style="width: 20px; height: 20px; margin-right: 5px; cursor: pointer;">
                        ${alimento}
                    </label>
                `;
            });
            html += `</div>`;
        }
        html += `</div>`;
    }
    cardapioDiv.innerHTML = html;
    
    carregarSelecaoSalva(); 
}

/**
 * Atualiza a lista de alimentos selecionados em tempo real na aba.
 */
function atualizarResumoSelecao() {
    const selecionados = Array.from(document.querySelectorAll('#cardapioInterativo input[name="alimento"]:checked'))
                                .map(checkbox => checkbox.value);
    
    if (selecionados.length > 0) {
        listaSelecionadosP.innerHTML = selecionados.join('; ');
    } else {
        listaSelecionadosP.innerHTML = 'Nenhum alimento selecionado.';
    }
}

/**
 * Carrega e marca os alimentos que o aluno salvou na última vez.
 */
function carregarSelecaoSalva() {
    if (usuarioAtual && usuarioAtual.selecaoAlimentos) {
        const checkboxes = document.querySelectorAll('#cardapioInterativo input[name="alimento"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = usuarioAtual.selecaoAlimentos.includes(checkbox.value);
        });
        atualizarResumoSelecao(); 
    }
}

// --- Listener para salvar os alimentos selecionados ---
if(formSelecaoAlimentos) {
    formSelecaoAlimentos.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!usuarioAtual) {
            alert('Por favor, faça Login primeiro na aba "Login".');
            abrirAba('login');
            return;
        }

        const alimentosSelecionados = Array.from(document.querySelectorAll('#cardapioInterativo input[name="alimento"]:checked'))
                                            .map(checkbox => checkbox.value);

        if (alimentosSelecionados.length === 0) {
            alert('Selecione pelo menos um alimento antes de salvar.');
            return;
        }

        // 1. Salva a seleção no objeto global do usuário
        usuarioAtual.selecaoAlimentos = alimentosSelecionados;
        localStorage.setItem('pt_usuario', JSON.stringify(usuarioAtual));
        
        // 2. Atualiza o registro no Histórico (importante para o Criador)
        const alimentosStr = alimentosSelecionados.join('; ');
        
        let registro = historico.find(r => r.email === usuarioAtual.email);
        if (registro) {
            registro.alimentosConsumidos = alimentosStr;
        } else {
             // Caso a pessoa vá para a alimentação antes de calcular IMC
             registro = {...usuarioAtual, alimentosConsumidos: alimentosStr};
             historico.push(registro);
        }
        
        // Salva o histórico atualizado
        localStorage.setItem('pt_historico', JSON.stringify(historico)); 
        
        alert('Seleção de alimentos salva com sucesso! Prossiga para a aba "Cálculo".');
        abrirAba('calculo'); // Redireciona para o cálculo
    });
}


// --- CÁLCULO e RESPOSTAS ---
if(formCalculo){
    formCalculo.addEventListener('submit', e=>{
        e.preventDefault();
        
        const pesoStr = document.getElementById('peso').value;
        const alturaStr = document.getElementById('altura').value;
        const peso = parseFloat(pesoStr.replace(',', '.'));
        const altura = parseFloat(alturaStr.replace(',', '.'));

        if(!usuarioAtual || isNaN(peso) || peso <= 0 || isNaN(altura) || altura <= 0){
            alert('Dados inválidos ou faça login primeiro!'); 
            return; 
        }

        const atividade = document.getElementById('atividade').value;
        const objetivo = document.getElementById('objetivo').value;

        // Lógica de cálculo
        const imc = peso / (altura * altura);
        let status = '';
        if(imc < 18.5) status = 'Abaixo do peso (Busque orientação profissional)';
        else if(imc < 25) status = 'Peso Normal (Ótimo!)';
        else if(imc < 30) status = 'Sobrepeso (Atenção)';
        else status = 'Obesidade (Busque orientação profissional)';

        // Lógica de recomendação
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

        // --- SALVANDO TUDO NO LOCALSTORAGE PARA O CRIADOR LER ---
        const alimentosConsumidos = usuarioAtual.selecaoAlimentos ? usuarioAtual.selecaoAlimentos.join('; ') : 'N/A - Selecione na aba Alimentação';

        const registro = {
            ...usuarioAtual,
            peso, altura,
            imc: imc.toFixed(2),
            status, exercicio, sono, alimentacaoRecomendada,
            alimentosConsumidos: alimentosConsumidos // Adiciona os alimentos
        };
        
        const historicoIndex = historico.findIndex(r => r.email === usuarioAtual.email);
        if(historicoIndex > -1){
            historico[historicoIndex] = registro; // Atualiza registro existente
        } else {
            historico.push(registro); // Adiciona novo registro
        }

        localStorage.setItem('pt_historico', JSON.stringify(historico)); 

        // Geração do HTML de Respostas
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
                <tr><td>Email</td><td>${registro.email}</td></tr>
                <tr><td>IMC</td><td>${registro.imc}</td></tr>
                <tr><td>Status</td><td>${registro.status}</td></tr>
                <tr><td>Objetivo</td><td>${objetivo.charAt(0).toUpperCase() + objetivo.slice(1).replace('_', ' ')}</td></tr>
                <tr><td>Alimentos Selecionados</td><td>${registro.alimentosConsumidos}</td></tr>
                <tr><td>Exercício</td><td>${registro.exercicio}</td></tr>
                <tr><td>Sono</td><td>${registro.sono}</td></tr>
                <tr><td>Alimentação Recomendada</td><td>${registro.alimentacaoRecomendada}</td></tr>
            </table>
            <p class="alerta">
                ⚠️ <strong>ATENÇÃO:</strong> Estes resultados são educacionais. Para um plano seguro e eficaz, consulte um profissional de Educação Física e um Nutricionista.
            </p>
        `;

        abrirAba('respostas');
    });
}


// --- REDIRECIONAMENTO PARA O SITE DO CRIADOR ---
function pedirSenhaCriador(){
    const senha = prompt('Digite a senha de acesso:');
    if(senha === '2anoA'){ // Senha para o modo criador/admin
        window.location.href = 'criador.html';
    } else if(senha !== null) {
        alert('Senha incorreta!');
    }
}


// --- INICIALIZAÇÃO GERAL ---
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a aba Início
    abrirAba('inicio'); 
    
    // Pré-preenche o formulário de login se houver dados salvos
    if (usuarioAtual) {
        document.getElementById('nome').value = usuarioAtual.nome || '';
        document.getElementById('serie').value = usuarioAtual.serie || '6';
        document.getElementById('sexo').value = usuarioAtual.sexo || 'M';
        document.getElementById('email').value = usuarioAtual.email || '';
    }

    // Gera o cardápio interativo na aba Alimentação
    gerarCardapioInterativo();
});

// Torna as funções globais (necessário para o onchange nos checkboxes)
window.pedirSenhaCriador = pedirSenhaCriador;
window.abrirAba = abrirAba;
window.atualizarResumoSelecao = atualizarResumoSelecao; 
window.gerarCardapioInterativo = gerarCardapioInterativo;

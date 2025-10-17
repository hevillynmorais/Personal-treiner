/**
 * criador.js
 * Lógica para o Painel do Criador.
 * Lê o 'pt_historico' do localStorage e exibe os dados dos alunos.
 * Funciona na mesma origem (mesma pasta/domínio) do index.html.
 */

const listaAlunosContainer = document.getElementById('listaAlunosContainer');
const detalhesAlunoDiv = document.getElementById('detalhesAluno');

// Tenta ler o histórico completo de alunos
// O 'pt_historico' é salvo pelo script.js do site do aluno
const historico = JSON.parse(localStorage.getItem('pt_historico') || '[]');


// --- FUNÇÃO PRINCIPAL: CARREGAR LISTA DE ALUNOS ---
function carregarListaAlunos() {
    listaAlunosContainer.innerHTML = ''; // Limpa o "Carregando dados..."
    
    if (historico.length === 0) {
        listaAlunosContainer.innerHTML = '<p style="color: #ffc107;">Nenhum aluno registrou dados ainda.</p>';
        return;
    }

    // Cria a estrutura de lista
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';

    historico.forEach((aluno, index) => {
        const li = document.createElement('li');
        li.style.marginBottom = '8px';
        
        // Cria um botão (link-btn estilizado no style.css)
        const btn = document.createElement('button');
        btn.className = 'link-btn';
        // Exibe Nome e Série
        btn.textContent = `${aluno.nome} (${aluno.serie}º ano) - ${aluno.email || 'Sem Email'}`; 
        
        // Chama a função de exibição de detalhes ao clicar
        btn.onclick = () => exibirDetalhesAluno(index);
        
        li.appendChild(btn);
        ul.appendChild(li);
    });

    listaAlunosContainer.appendChild(ul);
}


// --- FUNÇÃO: EXIBIR DETALHES DO ALUNO SELECIONADO ---
function exibirDetalhesAluno(index) {
    const aluno = historico[index];
    if (!aluno) {
        detalhesAlunoDiv.innerHTML = '<p>Erro: Aluno não encontrado.</p>';
        return;
    }

    // Pega os dados, usando 'N/A' se não foram preenchidos
    const imc = aluno.imc || 'N/A';
    const status = aluno.status || 'N/A';
    const peso = aluno.peso || 'N/A';
    const altura = aluno.altura || 'N/A';
    // Divide os alimentos selecionados em um array para melhor formatação
    const alimentos = aluno.alimentosConsumidos || 'Nenhum alimento selecionado.';
    const exercicio = aluno.exercicio || 'N/A - Cálculo não realizado';
    const sono = aluno.sono || 'N/A - Cálculo não realizado';
    const alimentacaoRecomendada = aluno.alimentacaoRecomendada || 'N/A - Cálculo não realizado';
    const email = aluno.email || 'Não informado';
    // Formata o objetivo
    const objetivo = aluno.objetivo ? aluno.objetivo.charAt(0).toUpperCase() + aluno.objetivo.slice(1).replace(/_/g, ' ') : 'N/A';
    
    // Geração do HTML detalhado
    detalhesAlunoDiv.innerHTML = `
        <h3>Dados Principais: ${aluno.nome}</h3>
        <table>
            <tr><th>Campo</th><th>Valor</th></tr>
            <tr><td>Nome</td><td>${aluno.nome}</td></tr>
            <tr><td>Email</td><td>${email}</td></tr>
            <tr><td>Série / Sexo</td><td>${aluno.serie}º ano / ${aluno.sexo}</td></tr>
            <tr><td>Peso (kg) / Altura (m)</td><td>${peso} / ${altura}</td></tr>
        </table>

        <hr>

        <h3>Resultados do IMC e Metas</h3>
        <table>
            <tr><th>Campo</th><th>Valor</th></tr>
            <tr style="background-color: #555555;">
                <td>IMC Calculado</td>
                <td><strong>${imc}</strong></td>
            </tr>
            <tr style="background-color: #555555;">
                <td>Status do IMC</td>
                <td><strong>${status}</strong></td>
            </tr>
            <tr><td>Objetivo Declarado</td><td>${objetivo}</td></tr>
        </table>
        
        <hr>

        <h3>Recomendações e Hábitos</h3>
        <table>
            <tr><th colspan="2">Análise de Hábito Alimentar (Selecionados)</th></tr>
            <tr>
                <td colspan="2" style="font-size: 0.9em; font-style: italic; color: #ccc;">
                    ${alimentos.split(';').map(item => `<span style="display: inline-block; margin-right: 15px;">• ${item.trim()}</span>`).join('')}
                </td>
            </tr>
            <tr><th>Recomendação de Exercício</th><td>${exercicio}</td></tr>
            <tr><th>Recomendação de Alimentação</th><td>${alimentacaoRecomendada}</td></tr>
            <tr><th>Recomendação de Sono</th><td>${sono}</td></tr>
        </table>

        <p class="alerta" style="margin-top: 20px;">
            📢 Dados provenientes do último registro feito pelo aluno.
        </p>
    `;
}


// --- INICIALIZAÇÃO ---
// Inicia o carregamento da lista quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarListaAlunos);

// Torna a função global para que o onclick no HTML (criado dinamicamente) possa chamá-la
window.exibirDetalhesAluno = exibirDetalhesAluno;

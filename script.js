function abrirAba(nome){
  document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
  const el = document.getElementById('aba-'+nome);
  if(el) el.classList.add('ativa');
}

// --- armazenamento temporário ---
let usuarioAtual = null;
let historico = JSON.parse(localStorage.getItem('pt_historico') || '[]');

// --- login ---
const formLogin = document.getElementById('formLogin');
if(formLogin){
  formLogin.addEventListener('submit', e=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const idade = document.getElementById('idade').value.trim();
    const serie = document.getElementById('serie').value.trim();
    const sexo = document.getElementById('sexo').value;

    usuarioAtual = { email, nome, idade, serie, sexo };
    // salva último usuário (opcional)
    localStorage.setItem('pt_usuario', JSON.stringify(usuarioAtual));

    // navegação automática para cálculo
    abrirAba('calculo');
  });
}

// --- cálculo ---
const formCalculo = document.getElementById('formCalculo');
const respostasDiv = document.getElementById('respostas');

if(formCalculo){
  formCalculo.addEventListener('submit', e=>{
    e.preventDefault();
    if(!usuarioAtual){
      alert('Por favor, faça o login primeiro.');
      abrirAba('login');
      return;
    }

    const peso = parseFloat(document.getElementById('peso').value);
    const alturaCm = parseFloat(document.getElementById('altura').value);
    const pesoDesejado = parseFloat(document.getElementById('pesoDesejado').value);
    const atividade = document.getElementById('atividade').value;
    const objetivo = document.getElementById('objetivo').value;

    const alturaM = alturaCm / 100;
    const imc = +(peso / (alturaM * alturaM)).toFixed(2);
    const diferenca = +(pesoDesejado - peso).toFixed(1);

    // classificação IMC
    let classificacao = '';
    if(imc < 18.5) classificacao = 'Abaixo do peso';
    else if(imc < 24.9) classificacao = 'Peso normal';
    else if(imc < 29.9) classificacao = 'Sobrepeso';
    else classificacao = 'Obesidade';

    // dicas baseadas em objetivo + atividade + sexo
    let dicas = [];

    // objetivo
    if(objetivo === 'massa'){
      dicas.push('Foque em treinos de força (musculação) e aumento gradual de calorias com proteínas.');
    } else if(objetivo === 'gordura'){
      dicas.push('Crie um leve déficit calórico e aumente atividade aeróbica; reduza açúcares/ultraprocessados.');
    } else {
      dicas.push('Mantenha hábitos equilibrados: alimentação variada e atividade regular.');
    }

    // atividade
    if(atividade === 'sedentario') dicas.push('Inicie com caminhadas 2x/semana e aumente progressivamente.');
    else if(atividade === 'leve') dicas.push('Mantenha 1-2 treinos semanais e tente evoluir para 3x.');
    else if(atividade === 'moderado') dicas.push('Boa rotina — mantenha 3-5 treinos e varie intensidade.');
    else if(atividade === 'intenso') dicas.push('Alto volume: priorize recuperação e sono adequado.');

    // sexo ajustes simples (educativo)
    if(usuarioAtual.sexo === 'F' && objetivo === 'massa') {
      dicas.push('Mulheres podem ganhar massa mais devagar; consistência e proteína são chave.');
    }
    if(usuarioAtual.sexo === 'M' && objetivo === 'gordura') {
      dicas.push('Homens tendem a acumular gordura abdominal; inclua treinos aeróbicos e força.');
    }

    // montando mensagem
    let html = `<p><b>Email:</b> ${usuarioAtual.email} | <b>Nome:</b> ${usuarioAtual.nome} | <b>Idade:</b> ${usuarioAtual.idade} | <b>Série:</b> ${usuarioAtual.serie} | <b>Sexo:</b> ${usuarioAtual.sexo}</p>`;
    html += `<p><b>IMC:</b> ${imc} — <i>${classificacao}</i></p>`;
    if(diferenca > 0) html += `<p>Você precisa <b>ganhar ${diferenca} kg</b> para atingir a meta.</p>`;
    else if(diferenca < 0) html += `<p>Você precisa <b>perder ${Math.abs(diferenca)} kg</b> para atingir a meta.</p>`;
    else html += `<p>Parabéns — você está no peso desejado!</p>`;

    html += `<p><b>Objetivo:</b> ${objetivo} | <b>Nível atividade:</b> ${atividade}</p>`;
    html += `<h3>Dicas rápidas</h3><ul>`;
    dicas.forEach(d => html += `<li>${d}</li>`);
    html += `</ul>`;

    // estimativa de tempo simples: 0.5 kg/semana
    const semanas = Math.max(0, Math.round(Math.abs(diferenca) / 0.5));
    if(semanas > 0) html += `<p><b>Estimativa (taxa 0.5 kg/semana):</b> cerca de ${semanas} semanas</p>`;

    html += `<p style="color:var(--muted);font-size:0.95rem">As dicas são educacionais — para acompanhamento profissional específico consulte um especialista.</p>`;

    respostasDiv.innerHTML = html;

    // salvar no histórico (localStorage)
    const registro = {
      timestamp: Date.now(),
      email: usuarioAtual.email,
      nome: usuarioAtual.nome,
      idade: usuarioAtual.idade,
      serie: usuarioAtual.serie,
      sexo: usuarioAtual.sexo,
      peso,
      alturaCm,
      pesoDesejado,
      imc,
      classificacao,
      objetivo,
      atividade,
      diferenca
    };
    historico.push(registro);
    localStorage.setItem('pt_historico', JSON.stringify(historico));

    // navegação automática para respostas
    abrirAba('respostas');
  });
}

// --- área dos criadores (senha) ---
function pedirSenha(){
  const senha = prompt('Digite a senha de acesso dos criadores:');
  if(senha === '2anoA'){
    abrirAba('criadores');
    mostrarDadosCriadores();
  } else {
    if(senha !== null) alert('Senha incorreta!');
  }
}

function mostrarDadosCriadores(){
  const div = document.getElementById('dadosCriadores');
  if(!historico || historico.length === 0){
    div.innerHTML = '<p>Nenhum cálculo realizado ainda.</p>';
    return;
  }
  let html = '<table><thead><tr><th>Email</th><th>Nome</th><th>Idade</th><th>Série</th><th>Sexo</th><th>Peso</th><th>Altura(cm)</th><th>Peso Meta</th><th>IMC</th><th>Classif.</th><th>Objetivo</th><th>Atividade</th><th>Diff(kg)</th></tr></thead><tbody>';
  historico.forEach(h=>{
    html += `<tr>
      <td>${h.email}</td>
      <td>${h.nome}</td>
      <td>${h.idade}</td>
      <td>${h.serie}</td>
      <td>${h.sexo}</td>
      <td>${h.peso}</td>
      <td>${h.alturaCm}</td>
      <td>${h.pesoDesejado}</td>
      <td>${h.imc}</td>
      <td>${h.classificacao}</td>
      <td>${h.objetivo}</td>
      <td>${h.atividade}</td>
      <td>${h.diferenca}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  html += '<p style="margin-top:8px"><button onclick="limparHistorico()">Limpar histórico</button></p>';
  div.innerHTML = html;
}

function limparHistorico(){
  if(confirm('Tem certeza que deseja apagar todo o histórico?')){
    historico = [];
    localStorage.removeItem('pt_historico');
    document.getElementById('dadosCriadores').innerHTML = '<p>Histórico limpo.</p>';
  }
}

// --- filtro alimentos ---
function filtrarAlimentos(){
  const termo = document.getElementById('pesquisaAlimento').value.trim().toLowerCase();
  const linhas = document.querySelectorAll('#tabelaAlimentos tbody tr');
  linhas.forEach(row=>{
    const texto = row.innerText.toLowerCase();
    row.style.display = texto.includes(termo) ? '' : 'none';
  });
}

// --- iniciar aba inicial (caso queira abrir login automaticamente se já há usuário) ---
document.addEventListener('DOMContentLoaded', ()=>{
  // se já existir usuário salvo, recarrega
  const u = localStorage.getItem('pt_usuario');
  if(u){
    try {
      usuarioAtual = JSON.parse(u);
    } catch {}
  }
  // se já houver historico salvo nas storage, usa
  const h = localStorage.getItem('pt_historico');
  if(h){
    try{ historico = JSON.parse(h); }catch{}
  }
});

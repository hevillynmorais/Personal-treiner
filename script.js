// --- navegação ---
function abrirAba(id){
  document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
  const aba=document.getElementById('aba-'+id);
  if(aba) aba.classList.add('ativa');
}

// --- login ---
document.getElementById('formLogin')?.addEventListener('submit', e=>{
  e.preventDefault();
  const nome=document.getElementById('nome').value;
  alert(`Bem-vindo(a), ${nome}!`);
  abrirAba('calculo');
});

// --- calculo ---
document.getElementById('formCalculo')?.addEventListener('submit', e=>{
  e.preventDefault();
  const peso=parseFloat(document.getElementById('peso').value);
  const altura=parseFloat(document.getElementById('altura').value)/100;
  const pesoDesejado=parseFloat(document.getElementById('pesoDesejado').value);
  const atividade=document.getElementById('atividade').value;
  const objetivo=document.getElementById('objetivo').value;

  const imc=(peso/(altura*altura)).toFixed(1);

  let gasto;
  switch(atividade){
    case 'sedentario': gasto=peso*25; break;
    case 'leve': gasto=peso*30; break;
    case 'moderado': gasto=peso*35; break;
    case 'intenso': gasto=peso*40; break;
  }

  let meta='';
  switch(objetivo){
    case 'massa': meta='Consuma proteína adequada e calorias extras.'; break;
    case 'gordura': meta='Deficit calórico moderado e exercícios regulares.'; break;
    case 'manter': meta='Mantenha equilíbrio alimentar e atividade física.'; break;
  }

  document.getElementById('respostas').innerHTML=
    `<p>IMC: <b>${imc}</b></p>
     <p>Gasto calórico aproximado: <b>${gasto.toFixed(0)} kcal/dia</b></p>
     <p>Meta: ${meta}</p>`;

  abrirAba('respostas');
});

// --- tabela alimentos ---
function filtrarAlimentos(){
  const filtro=document.getElementById('pesquisaAlimento').value.toLowerCase();
  document.querySelectorAll('#tabelaAlimentos tbody tr').forEach(tr=>{
    tr.style.display=tr.innerText.toLowerCase().includes(filtro)?'':'none';
  });
}

// --- criadores ---
function pedirSenha(){
  const senha=prompt('Digite a senha:');
  if(senha==='1234'){
    abrirAba('criadores');
    document.getElementById('dadosCriadores').innerHTML=
      `<ul>
         <li>Maomo — Desenvolvedor Front-end</li>
         <li>Akari — Designer de UI</li>
       </ul>`;
  } else alert('Senha incorreta');
}

function limparHistorico(){
  if(confirm('Tem certeza que deseja limpar o histórico?')){
    document.getElementById('dadosCriadores').innerHTML='';
  }
}

// --- diário alimentar livre ---
let diarioAlimentar = [];

function adicionarAlimentoDiario() {
  const nome = document.getElementById('nomeAlimentoDiario').value.trim();
  const qtd = parseFloat(document.getElementById('quantidadeAlimentoDiario').value);
  let cal100 = parseFloat(document.getElementById('caloriasAlimentoDiario').value);

  if (!nome || !qtd || qtd <= 0) {
    alert('Preencha corretamente o nome e a quantidade.');
    return;
  }

  // Verifica se o alimento existe na tabela
  const linhas = document.querySelectorAll('#tabelaAlimentos tbody tr');
  let encontrado = false;

  linhas.forEach(row => {
    if (row.cells[0].innerText.toLowerCase() === nome.toLowerCase()) {
      cal100 = parseFloat(row.cells[4].innerText);
      encontrado = true;
    }
  });

  if (!encontrado && (!cal100 || cal100 <= 0)) {
    alert('Informe as calorias por 100g para alimentos fora da tabela.');
    return;
  }

  const kg = qtd / 1000;
  const calorias = +(cal100 * qtd / 100).toFixed(1);

  diarioAlimentar.push({ nome, qtd, kg, calorias });

  atualizarResumoDiario();

  // Limpar inputs
  document.getElementById('nomeAlimentoDiario').value = '';
  document.getElementById('quantidadeAlimentoDiario').value = '';
  document.getElementById('caloriasAlimentoDiario').value = '';
}

function atualizarResumoDiario() {
  const resumo = document.getElementById('resumoDiario');

  if (!resumo) return;

  if (diarioAlimentar.length === 0) {
    resumo.innerHTML = '<p>Nenhum alimento registrado ainda.</p>';
    return;
  }

  let html = '<h4>Resumo do que você comeu</h4><ul>';
  diarioAlimentar.forEach(d => {
    html += `<li>${d.nome} — ${d.qtd} g — ${d.kg.toFixed(2)} kg — ${d.calorias} kcal</li>`;
  });
  html += '</ul>';

  const totalCal = diarioAlimentar.reduce((sum, d) => sum + d.calorias, 0);
  const totalGramas = diarioAlimentar.reduce((sum, d) => sum + d.qtd, 0);
  const totalKg = diarioAlimentar.reduce((sum, d) => sum + d.kg, 0);

  html += `<p><b>Total:</b> ${totalGramas} g — ${totalKg.toFixed(2)} kg — ${totalCal.toFixed(1)} kcal</p>`;

  resumo.innerHTML = html;
}

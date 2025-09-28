let diario = []; // histórico diário temporário

function filtrarAlimentos(){
  const filtro = document.getElementById('pesquisaAlimento').value.toLowerCase();
  const linhas = document.querySelectorAll('#tabelaAlimentos tbody tr');
  linhas.forEach(row => {
    const nome = row.cells[0].innerText.toLowerCase();
    const categoria = row.cells[1].innerText.toLowerCase();
    if(nome.includes(filtro) || categoria.includes(filtro)){
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function adicionarAlimento() {
  const tipo = document.getElementById('tipoRefeicao').value;
  const nome = document.getElementById('alimentoEntrada').value.trim();
  const qtd = parseFloat(document.getElementById('quantidadeEntrada').value);

  if(!nome || !qtd || qtd <= 0){
    return alert('Preencha corretamente o alimento e a quantidade.');
  }

  const linhas = document.querySelectorAll('#tabelaAlimentos tbody tr');
  let achou = false;

  linhas.forEach(row => {
    if(row.cells[0].innerText.toLowerCase() === nome.toLowerCase()){
      const calPor100g = parseFloat(row.cells[4].innerText);
      const kg = qtd / 1000;
      const calorias = (calPor100g * qtd / 100).toFixed(1);

      diario.push({tipo, nome, qtd, kg, calorias: parseFloat(calorias) });
      achou = true;
    }
  });

  if(!achou){
    return alert('Alimento não encontrado na tabela. Digite exatamente como está escrito.');
  }

  atualizarResumo();
  document.getElementById('alimentoEntrada').value = '';
  document.getElementById('quantidadeEntrada').value = '';
}

function atualizarResumo(){
  if(diario.length === 0){
    document.getElementById('resumoAlimentacao').innerHTML = '<p>Nenhum alimento registrado ainda.</p>';
    return;
  }

  let html = '<h4>Resumo diário</h4>';
  const tipos = [...new Set(diario.map(d=>d.tipo))];

  tipos.forEach(t=>{
    html += `<strong>${t}:</strong><ul>`;
    diario.filter(d=>d.tipo===t).forEach(d=>{
      html += `<li>${d.nome} — ${d.qtd}g (${d.kg.toFixed(2)}kg) — ${d.calorias} kcal</li>`;
    });
    html += '</ul>';
  });

  const totalCal = diario.reduce((sum,d)=>sum+d.calorias,0);
  html += `<p><b>Total de calorias até agora:</b> ${totalCal.toFixed(1)} kcal</p>`;

  const metaCal = 2000; // valor educativo
  const restante = metaCal - totalCal;
  if(restante > 0){
    html += `<p>Você ainda pode consumir <b>${restante.toFixed(0)} kcal</b> para alcançar sua meta.</p>`;
  } else {
    html += `<p>Você atingiu ou ultrapassou a meta calórica do dia.</p>`;
  }

  document.getElementById('resumoAlimentacao').innerHTML = html;
}

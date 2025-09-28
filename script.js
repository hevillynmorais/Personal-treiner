// --- navegação ---
function abrirAba(id){
  document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));
  const aba=document.getElementById('aba-'+id);
  if(aba) aba.classList.add('ativa');
}

function esconderHeader(){
  document.getElementById('header').style.display='none';
}

// --- login ---
document.getElementById('formLogin')?.addEventListener('submit', e=>{
  e.preventDefault();
  const nome=document.getElementById('nome').value;
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
  let alimentosSugestao=[];
  switch(objetivo){
    case 'massa': 
      meta='Consuma proteína adequada e calorias extras.'; 
      alimentosSugestao=['Peito de frango', 'Ovos', 'Atum', 'Arroz integral', 'Aveia', 'Banana'];
      break;
    case 'gordura': 
      meta='Deficit calórico moderado e exercícios regulares.'; 
      alimentosSugestao=['Frango grelhado', 'Peixes', 'Legumes', 'Verduras', 'Ovos', 'Frutas'];
      break;
    case 'manter': 
      meta='Mantenha equilíbrio alimentar e atividade física.'; 
      alimentosSugestao=['Arroz', 'Feijão', 'Frango', 'Legumes', 'Frutas', 'Oleaginosas'];
      break;
  }

  abrirAba('respostas');

  document.getElementById('respostas').innerHTML=
    `<p>IMC: <b>${imc}</b></p>
     <p>Gasto calórico aproximado: <b>${gasto.toFixed(0)} kcal/dia</b></p>
     <p>Meta: ${meta}</p>
     <p>Alimentos sugeridos para seu objetivo:</p>
     <ul>${alimentosSugestao.map(a=>`<li>${a}</li>`).join('')}</ul>`;
});

// --- criadores ---
function pedirSenha(){
  const senha=prompt('Digite a senha:');
  if(senha==='2anoA'){
    abrirAba('criadores');
    document.getElementById('dadosCriadores').innerHTML=
      `<ul>
         <li>Maomo — Desenvolvedor Front-end</li>
         <li>Akari — Designer de UI</li>
       </ul>`;
  } else alert('Senha incorreta');
}

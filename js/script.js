const SECTIONS=['hero','platform','quiz','result','dashboard','phishing','lgpd','incidents'];

function showSection(name){
  SECTIONS.forEach(s=>{
    const el=document.getElementById(s+'-section')||document.getElementById(s);
    if(el){
      if(s===name){el.classList.remove('hidden');el.scrollIntoView({behavior:'smooth',block:'start'})}
      else el.classList.add('hidden');
    }
  });
}

function startQuiz(){
  showSection('quiz');
  initQuiz();
}

// QUIZ DATA
const questions=[
  {cat:'Controle de Acessos',q:'Sua empresa aplica o princípio do menor privilégio nos acessos?',exp:'Usuários devem ter apenas os acessos estritamente necessários para suas funções.',risk:'Acesso excessivo aumenta o impacto de credenciais comprometidas.',weight:4},
  {cat:'Controle de Acessos',q:'Existe revisão periódica dos acessos concedidos a colaboradores?',exp:'Revisões trimestrais identificam acessos desnecessários ou indevidos.',risk:'Colaboradores desligados ou transferidos podem reter acessos críticos.',weight:4},
  {cat:'Controle de Acessos',q:'Há controle de acesso físico a servidores e equipamentos críticos?',exp:'Salas de servidores devem ter acesso restrito e rastreável.',risk:'Acesso físico não controlado permite roubo ou sabotagem direta.',weight:3},
  {cat:'Senhas e Autenticação',q:'Sua empresa utiliza autenticação multifator (MFA)?',exp:'A MFA reduz significativamente o risco de invasões causadas por vazamento de senhas.',risk:'Contas protegidas apenas por senha são facilmente comprometidas em ataques de credential stuffing.',weight:5},
  {cat:'Senhas e Autenticação',q:'Existe uma política de senhas com complexidade mínima definida?',exp:'Senhas fortes combinam letras, números e caracteres especiais com comprimento mínimo de 12 caracteres.',risk:'Senhas fracas são a principal porta de entrada em ataques de força bruta.',weight:4},
  {cat:'Senhas e Autenticação',q:'É utilizado um gerenciador de senhas corporativo?',exp:'Gerenciadores evitam reutilização de senhas e facilitam gestão segura de credenciais.',risk:'Reutilização de senhas permite que um vazamento comprometa múltiplos sistemas.',weight:3},
  {cat:'Backup e Continuidade',q:'Backups são realizados regularmente e testados periodicamente?',exp:'Backups sem teste de restauração não garantem a recuperação dos dados.',risk:'Sem backup validado, um ataque de ransomware pode causar perda total de dados críticos.',weight:5},
  {cat:'Backup e Continuidade',q:'Existe um Plano de Continuidade de Negócios (PCN) documentado?',exp:'O PCN define como a organização opera durante e após incidentes graves.',risk:'Sem planejamento, incidentes podem paralisar operações por dias ou semanas.',weight:4},
  {cat:'Backup e Continuidade',q:'Os backups são armazenados em local separado da infraestrutura principal (offsite/cloud)?',exp:'Armazenamento offsite protege contra incêndios, enchentes e ataques ransomware.',risk:'Backups no mesmo ambiente podem ser criptografados junto com os dados originais.',weight:4},
  {cat:'Conscientização',q:'Os colaboradores recebem treinamento periódico sobre segurança da informação?',exp:'Treinamentos regulares mantêm a equipe atualizada sobre novas ameaças e boas práticas.',risk:'Colaboradores desinformados são o principal vetor de ataques de engenharia social.',weight:5},
  {cat:'Conscientização',q:'A empresa realiza simulações de phishing para testar a prontidão dos colaboradores?',exp:'Simulações identificam vulnerabilidades humanas antes que atacantes reais o façam.',risk:'Sem treinamento prático, colaboradores caem em 30% das simulações de phishing.',weight:4},
  {cat:'Conscientização',q:'Existe um canal claro para relato de suspeitas de incidentes de segurança?',exp:'Um canal de reporte facilita identificação precoce de ameaças.',risk:'Incidentes não reportados se propagam silenciosamente pela organização.',weight:3},
  {cat:'LGPD',q:'Sua empresa possui um mapeamento dos dados pessoais que coleta e trata?',exp:'O mapeamento (ROPA) é exigido pela LGPD e essencial para gestão de privacidade.',risk:'Sem mapeamento, é impossível responder adequadamente a incidentes ou solicitações de titulares.',weight:5},
  {cat:'LGPD',q:'Existe uma Política de Privacidade clara e acessível ao público?',exp:'A LGPD exige transparência sobre o tratamento de dados pessoais.',risk:'Ausência de política pode resultar em sanções da ANPD e danos à reputação.',weight:4},
  {cat:'LGPD',q:'A empresa possui um Encarregado de Dados (DPO) designado?',exp:'O DPO é o ponto de contato entre a empresa, titulares e a ANPD.',risk:'Empresas sem DPO estão mais expostas a sanções e menos preparadas para incidentes de privacidade.',weight:3},
  {cat:'Gestão de Ativos',q:'Existe inventário atualizado de todos os ativos de TI (hardware e software)?',exp:'O inventário é a base da gestão de vulnerabilidades e controle de ativos.',risk:'Ativos desconhecidos são pontos cegos que atacantes exploram com frequência.',weight:4},
  {cat:'Gestão de Ativos',q:'As atualizações de segurança são aplicadas de forma regular e oportuna?',exp:'Patches corrigem vulnerabilidades conhecidas exploradas em ataques direcionados.',risk:'A maioria dos ataques bem-sucedidos explora vulnerabilidades com patches disponíveis há meses.',weight:5},
  {cat:'Gestão de Ativos',q:'Há um processo formal para descarte seguro de equipamentos e mídias?',exp:'Descarte inadequado pode expor dados sensíveis armazenados em dispositivos.',risk:'HDDs e pendrives descartados sem formatação segura são fontes frequentes de vazamentos.',weight:3}
];

let currentQ=0,answers=[];

function initQuiz(){
  currentQ=0;answers=[];
  renderQuestion();
}

function renderQuestion(){
  const q=questions[currentQ];
  const total=questions.length;
  const pct=Math.round((currentQ/total)*100);
  document.getElementById('progressBar').style.width=pct+'%';
  document.querySelector('.quiz-progress').setAttribute('aria-valuenow',pct);

  const container=document.getElementById('quizSteps');
  const yesChecked=answers[currentQ]==='sim';
  const noChecked=answers[currentQ]==='nao';
  container.innerHTML=`
    <div class="quiz-step active">
      <div class="category-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        ${q.cat}
      </div>
      <div class="question-card">
        <p class="question-text">${q.q}</p>
        <div class="question-meta">
          <div class="meta-item">
            <label>Por que isso importa</label>
            <p>${q.exp}</p>
          </div>
          <div class="meta-item">
            <label>Risco associado</label>
            <p>${q.risk}</p>
          </div>
        </div>
        <div class="question-options" role="radiogroup" aria-label="Opções de resposta">
          <button class="option-btn ${yesChecked?'selected':''}" onclick="selectAnswer('sim')" role="radio" aria-checked="${yesChecked}">
            <span class="opt-icon" aria-hidden="true">${yesChecked?'✓':''}</span>
            Sim, aplicamos esta prática
          </button>
          <button class="option-btn ${noChecked?'selected':''}" onclick="selectAnswer('nao')" role="radio" aria-checked="${noChecked}">
            <span class="opt-icon" aria-hidden="true">${noChecked?'✓':''}</span>
            Não aplicamos ainda
          </button>
        </div>
        <div class="quiz-nav">
          <button class="btn-back" onclick="prevQuestion()" ${currentQ===0?'disabled style="opacity:0.3;pointer-events:none"':''}>← Anterior</button>
          <span class="quiz-counter">${currentQ+1} de ${total}</span>
          <button class="btn-next ${answers[currentQ]?'enabled':''}" id="btnNext" onclick="nextQuestion()">
            ${currentQ===total-1?'Ver Resultado →':'Próxima →'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function selectAnswer(val){
  answers[currentQ]=val;
  renderQuestion();
}

function nextQuestion(){
  if(!answers[currentQ])return;
  if(currentQ<questions.length-1){currentQ++;renderQuestion()}
  else showResult();
}

function prevQuestion(){
  if(currentQ>0){currentQ--;renderQuestion()}
}

// RESULT
function showResult(){
  let score=0,maxScore=0;
  questions.forEach((q,i)=>{
    maxScore+=q.weight;
    if(answers[i]==='sim')score+=q.weight;
  });
  const pct=Math.round((score/maxScore)*100);

  let level,badgeClass,text;
  if(pct>=75){level='RISCO BAIXO';badgeClass='high';text='Sua organização demonstra boas práticas de segurança e maturidade satisfatória. Continue evoluindo e revise periodicamente seus controles.'}
  else if(pct>=45){level='RISCO MÉDIO';badgeClass='medium';text='Sua organização possui boas práticas de segurança, porém ainda existem pontos importantes que podem ser fortalecidos para reduzir exposição a ameaças.'}
  else{level='RISCO ALTO';badgeClass='low';text='Sua organização possui lacunas críticas em segurança da informação que exigem atenção imediata. Priorize os itens com maior impacto.'}

  document.getElementById('scoreCard').innerHTML=`
    <div class="score-number" aria-label="Score: ${pct} de 100">${pct}</div>
    <p class="score-label">pontos de 100</p>
    <span class="score-badge ${badgeClass}">${level}</span>
    <p class="score-text">${text}</p>
  `;

  const recs=buildRecs(pct);
  document.getElementById('recommendations').innerHTML=`
    <h3 class="rec-title">Recomendações Prioritárias</h3>
    ${recs.map(r=>`
      <div class="rec-item">
        <div class="rec-icon" aria-hidden="true">${r.icon}</div>
        <div class="rec-body">
          <h4>${r.title}</h4>
          <p>${r.desc}</p>
        </div>
      </div>
    `).join('')}
  `;

  window._quizScore=pct;
  window._quizLevel=level;
  window._quizAnswers=answers.slice();
  buildDashboard(pct);
  showSection('result');
}

function buildRecs(pct){
  const all=[
    {title:'Implemente MFA em todos os sistemas',desc:'A autenticação multifator é o controle com melhor custo-benefício contra invasões. Priorize sistemas críticos e e-mail corporativo.',icon:svgLock()},
    {title:'Estruture um programa de conscientização',desc:'Treinamentos trimestrais e simulações de phishing reduzem drasticamente o risco humano, principal vetor de ataques.',icon:svgShield()},
    {title:'Valide seus backups regularmente',desc:'Execute testes de restauração mensalmente. Um backup não testado é apenas esperança, não uma garantia de recuperação.',icon:svgFile()},
    {title:'Mapeie seus dados pessoais (LGPD)',desc:'Inicie o ROPA (Registro de Atividades de Tratamento) identificando quais dados são coletados, por quê e por quanto tempo.',icon:svgDoc()},
    {title:'Implante política de gestão de vulnerabilidades',desc:'Defina um processo para aplicação de patches dentro de 30 dias para críticos e 90 dias para demais atualizações.',icon:svgGear()},
    {title:'Revise os acessos concedidos',desc:'Realize revisão semestral de todos os acessos. Revogue imediatamente acessos de colaboradores desligados.',icon:svgUser()},
  ];
  return pct>=75?all.slice(0,3):pct>=45?all.slice(0,4):all;
}

function svgLock(){return`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`}
function svgShield(){return`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`}
function svgFile(){return`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`}
function svgDoc(){return`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`}
function svgGear(){return`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`}
function svgUser(){return`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`}

// DASHBOARD
function buildDashboard(pct){
  const conformidade=Math.round(pct*0.85);
  const riscos=pct>=75?2:pct>=45?4:7;

  document.getElementById('dashCards').innerHTML=`
    <div class="dash-card">
      <div class="label">Maturidade Geral</div>
      <div class="value">${pct}<span style="font-size:1.2rem;color:var(--text2)">/100</span></div>
      <div class="sublabel">${pct>=75?'Nível avançado':pct>=45?'Nível intermediário':'Nível inicial'}</div>
    </div>
    <div class="dash-card">
      <div class="label">Conformidade</div>
      <div class="value">${conformidade}%</div>
      <div class="sublabel">Controles implementados</div>
    </div>
    <div class="dash-card">
      <div class="label">Riscos Críticos</div>
      <div class="value" style="color:${riscos<=2?'var(--success)':riscos<=5?'var(--warning)':'var(--danger)'}">${riscos}</div>
      <div class="sublabel">Identificados na avaliação</div>
    </div>
    <div class="dash-card">
      <div class="label">Questões Respondidas</div>
      <div class="value">${questions.length}</div>
      <div class="sublabel">6 categorias avaliadas</div>
    </div>
  `;

  const cats=[...new Set(questions.map(q=>q.cat))];
  const catScores=cats.map(cat=>{
    const catQs=questions.filter(q=>q.cat===cat);
    const catMax=catQs.reduce((a,q)=>a+q.weight,0);
    const catScore=catQs.reduce((a,q,i)=>{
      const idx=questions.indexOf(q);
      return a+(answers[idx]==='sim'?q.weight:0);
    },0);
    return{cat,pct:Math.round((catScore/catMax)*100)};
  });

  const riskItems=catScores.filter(c=>c.pct<70).sort((a,b)=>a.pct-b.pct);
  document.getElementById('riskList').innerHTML=`
    <div class="risk-list-header">Análise por Categoria</div>
    ${catScores.map(c=>`
      <div class="risk-item">
        <span class="risk-name">${c.cat}</span>
        <span class="risk-sev ${c.pct>=70?'baixo':c.pct>=40?'medio':'alto'}">${c.pct>=70?'Adequado':c.pct>=40?'Atenção':'Crítico'} · ${c.pct}%</span>
      </div>
    `).join('')}
  `;
}

// PHISHING
const phishingEmails=[
  {
    id:'e1',
    from:'Banco Bradesco',
    addr:'noreply@bradesco.com.br',
    subject:'Comprovante de transferência PIX recebida',
    avatar:'BB',
    body:`Olá, segue o comprovante de transferência PIX recebida em sua conta.<br><br>Valor: <strong>R$ 1.247,00</strong><br>Data: 23/06/2025 às 14:32<br><br>Acesse o aplicativo Bradesco para visualizar todos os detalhes da transação.<br><br>Atenciosamente,<br>Banco Bradesco S.A.`,
    hasBtn:false,
    type:'legit',
    feedback:'Este e-mail é legítimo. Observe: domínio oficial @bradesco.com.br, sem links externos, linguagem formal e sem urgência. Comprovantes de PIX são informativos.',
    warnings:['Domínio oficial verificado','Sem links externos suspeitos','Sem urgência ou ameaça'],
    warningType:'safe'
  },
  {
    id:'e2',
    from:'Suporte Microsoft',
    addr:'security-alert@microsoft-account.serv.br',
    subject:'URGENTE: Sua conta será suspensa em 24 horas',
    avatar:'M!',
    body:`<strong>AVISO DE SEGURANÇA CRÍTICO</strong><br><br>Detectamos atividade suspeita na sua conta Microsoft. Sua conta será <strong>bloqueada permanentemente</strong> em 24 horas caso não verifique seus dados.<br><br>Clique no botão abaixo IMEDIATAMENTE para confirmar sua identidade:`,
    hasBtn:true,
    btnText:'Verificar Conta Agora',
    type:'phishing',
    feedback:'Este é um e-mail de PHISHING! Nunca clique em links desse tipo.',
    warnings:['Domínio falso: microsoft-account.serv.br','Urgência artificial e ameaça de suspensão','Botão com destino desconhecido','Linguagem alarmista para pressionar a vítima'],
    warningType:'danger'
  },
  {
    id:'e3',
    from:'RH - Recursos Humanos',
    addr:'rh-corporativo@empresa-grupo.info',
    subject:'Planilha de salários atualizada — Todos os colaboradores',
    avatar:'RH',
    body:`Prezados colaboradores,<br><br>Seguem os novos valores de salários para o próximo exercício. <strong>Documento confidencial</strong> — não compartilhe externamente.<br><br>Acesse o arquivo com sua senha corporativa:`,
    hasBtn:true,
    btnText:'Acessar Planilha de Salários',
    type:'suspicious',
    feedback:'Este e-mail é altamente suspeito. Características de engenharia social típicas.',
    warnings:['Domínio externo não corporativo','Assunto usa curiosidade e ganância','Apelo à confidencialidade para gerar urgência','RH legítimo usa sistemas internos, não links externos'],
    warningType:'danger'
  }
];

function initPhishing(){
  document.getElementById('phishingCards').innerHTML=phishingEmails.map(e=>`
    <div class="email-card" id="card-${e.id}">
      <div class="email-header">
        <div class="email-sender">
          <div class="email-avatar">${e.avatar}</div>
          <div class="email-meta">
            <div class="name">${e.from}</div>
            <div class="address">&lt;${e.addr}&gt;</div>
            <div class="subject">${e.subject}</div>
          </div>
        </div>
        <div class="email-date">Hoje, 14:32</div>
      </div>
      <div class="email-body">
        <p>${e.body}</p>
        ${e.hasBtn?`<span class="cta-link" style="cursor:default">${e.btnText}</span>`:''}
      </div>
      <div class="email-actions">
        <button class="classify-btn legit" onclick="classifyEmail('${e.id}','legit')">Legítimo</button>
        <button class="classify-btn suspicious" onclick="classifyEmail('${e.id}','suspicious')">Suspeito</button>
        <button class="classify-btn phishing" onclick="classifyEmail('${e.id}','phishing')">Phishing</button>
      </div>
      <div class="phishing-feedback" id="fb-${e.id}"></div>
    </div>
  `).join('');
}

function classifyEmail(id,chosen){
  const email=phishingEmails.find(e=>e.id===id);
  const correct=chosen===email.type;
  const fb=document.getElementById('fb-'+id);
  const isWarn=email.warningType==='danger';
  const badges=email.warnings.map(w=>isWarn?
    `<span class="warning-badge">⚠ ${w}</span>`:
    `<span class="safe-badge">✓ ${w}</span>`
  ).join('');
  fb.innerHTML=`
    <p class="feedback-result ${correct?'correct':'incorrect'}">${correct?'✓ Correto!':'✗ Incorreto — veja por quê:'}</p>
    <p class="feedback-body" style="margin-bottom:0.75rem">${email.feedback}</p>
    <div>${badges}</div>
  `;
  fb.classList.add('show');
  const card=document.getElementById('card-'+id);
  const btns=card.querySelectorAll('.classify-btn');
  btns.forEach(b=>b.disabled=true);
}

// LGPD
const lgpdPrincipios=[
  {
    num:'Art. 5',
    title:'Definições',
    desc:'Define os conceitos fundamentais usados em toda a lei: dado pessoal, dado sensível, titular, controlador, operador e agentes de tratamento.',
    full:'O Art. 5 é o glossário da LGPD. Antes de entender qualquer obrigação, é essencial saber o que cada termo significa. Dado pessoal é qualquer informação que identifica ou pode identificar uma pessoa. Dado sensível inclui origem racial, saúde, biometria, religião e orientação sexual — recebendo proteção reforçada. O titular é a pessoa a quem os dados pertencem. O controlador decide como e por que os dados são tratados. O operador realiza o tratamento a mando do controlador.',
    example:'Um cadastro de cliente com nome, CPF, telefone e endereço é um conjunto de dados pessoais. O CPF, por si só, já identifica uma pessoa — logo, é dado pessoal protegido pela LGPD.'
  },
  {
    num:'Art. 6',
    title:'Finalidade',
    desc:'Os dados só podem ser coletados para propósitos legítimos, específicos e informados ao titular. Sem finalidade clara, não há tratamento válido.',
    full:'O princípio da finalidade é um dos pilares da LGPD. Ele determina que toda coleta de dados deve ter um objetivo definido, legítimo e comunicado ao titular antes ou no momento da coleta. Não é permitido coletar dados "por precaução" ou reutilizá-los para fins diferentes sem nova base legal. O princípio da necessidade complementa: coletar apenas o mínimo necessário para atingir aquela finalidade.',
    example:'Uma loja online precisa do endereço para entrega — isso é legítimo. Mas usar esse mesmo endereço para enviar publicidade de terceiros sem autorização viola o princípio da finalidade.'
  },
  {
    num:'Art. 7',
    title:'Bases Legais',
    desc:'Toda operação de tratamento de dados precisa de uma das 10 bases legais previstas na lei, como consentimento, obrigação legal ou legítimo interesse.',
    full:'A LGPD não proíbe o uso de dados — ela exige que cada tratamento tenha um fundamento jurídico válido. As 10 bases legais incluem: consentimento do titular, cumprimento de obrigação legal, execução de contrato, proteção da vida, tutela da saúde, exercício de direitos em processo judicial, proteção ao crédito, legítimo interesse e políticas públicas. O consentimento, embora o mais conhecido, não é sempre obrigatório — há situações em que outras bases são mais adequadas.',
    example:'Ao criar uma conta em um app, você consente com o uso dos seus dados (base: consentimento). Quando uma empresa guarda dados para emitir nota fiscal, ela não precisa de consentimento — há obrigação legal.'
  },
  {
    num:'Art. 18',
    title:'Direitos do Titular',
    desc:'Você tem o direito de saber, acessar, corrigir, apagar ou transferir seus dados. Também pode revogar o consentimento a qualquer momento.',
    full:'O Art. 18 garante ao titular o controle sobre suas próprias informações. São direitos previstos: confirmação de que seus dados estão sendo tratados, acesso a eles, correção de dados incompletos ou desatualizados, anonimização ou eliminação de dados desnecessários, portabilidade para outro fornecedor, eliminação dos dados tratados com consentimento, informação sobre com quem seus dados foram compartilhados, e revogação do consentimento. As empresas devem responder essas solicitações de forma gratuita e em prazo razoável.',
    example:'Um cliente liga para uma operadora e solicita que todos os seus dados pessoais sejam apagados após o encerramento do contrato. A empresa tem a obrigação legal de atender ou justificar por que não pode.'
  },
  {
    num:'Art. 41',
    title:'Encarregado (DPO)',
    desc:'Responsável pela comunicação entre a organização, os titulares dos dados e a ANPD. Atua como ponto de contato para assuntos relacionados à proteção de dados.',
    full:'O Encarregado de Dados, também chamado de DPO (Data Protection Officer), é a pessoa ou área responsável por ser a ponte entre a empresa, os clientes e a ANPD. Ele orienta internamente sobre a LGPD, recebe reclamações dos titulares, e comunica a ANPD em caso de incidentes. A ANPD prevê exceções à obrigatoriedade de nomeação, especialmente para empresas de menor porte ou baixo risco no tratamento de dados. A identidade e o contato do encarregado devem ser divulgados publicamente.',
    example:'Uma empresa designa um canal de e-mail específico (ex: privacidade@empresa.com.br) gerenciado pelo DPO para receber pedidos de titulares, como solicitações de exclusão de dados ou dúvidas sobre política de privacidade.'
  },
  {
    num:'Art. 46',
    title:'Segurança',
    desc:'Empresas devem adotar medidas técnicas e administrativas para proteger dados pessoais contra acessos não autorizados, vazamentos e perdas acidentais.',
    full:'A LGPD não especifica quais tecnologias usar, mas exige que as empresas adotem medidas "aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão". Na prática, isso inclui criptografia, controle de acesso baseado em função, autenticação multifator, backups regulares, gestão de vulnerabilidades e treinamento de equipes. A segurança deve ser considerada desde a concepção dos sistemas (privacy by design).',
    example:'Uma empresa de saúde criptografa os prontuários dos pacientes, exige autenticação em dois fatores para acesso ao sistema e revisa permissões de acesso periodicamente para garantir que só quem precisa acessa os dados.'
  },
  {
    num:'Art. 48',
    title:'Comunicação de Incidentes',
    desc:'Incidentes de segurança que possam causar risco aos titulares devem ser comunicados à ANPD e às pessoas afetadas em prazo razoável.',
    full:'Quando ocorre um incidente de segurança que possa gerar risco ou dano relevante aos titulares — como vazamento de senhas, exposição de dados de saúde ou acesso indevido a informações financeiras — a empresa tem a obrigação de notificar tanto a ANPD quanto as pessoas afetadas. A comunicação deve ser feita em prazo razoável (a ANPD orienta sobre os prazos em regulamentos específicos) e deve descrever a natureza dos dados afetados, os titulares envolvidos e as medidas adotadas para mitigar os danos.',
    example:'Uma fintech sofre um ataque que expõe dados bancários de 10.000 clientes. A empresa tem a obrigação de informar a ANPD sobre o incidente e comunicar diretamente os clientes afetados, explicando o que aconteceu e quais medidas foram tomadas.'
  },
];

function openLgpdModal(idx){
  const p=lgpdPrincipios[idx];
  document.getElementById('lgpdModalNum').textContent=p.num;
  document.getElementById('lgpdModalTitle').textContent=p.title;
  document.getElementById('lgpdModalDesc').textContent=p.full;
  document.getElementById('lgpdModalExample').textContent=p.example;
  const modal=document.getElementById('lgpdModal');
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeLgpdModal(){
  document.getElementById('lgpdModal').classList.remove('open');
  document.body.style.overflow='';
}

document.addEventListener('keydown',function(e){
  if(e.key==='Escape') closeLgpdModal();
});

function initLGPD(){
  document.getElementById('lgpdGrid').innerHTML=lgpdPrincipios.map((p,i)=>`
    <div class="lgpd-card" onclick="openLgpdModal(${i})" role="button" tabindex="0" aria-label="Ver detalhes: ${p.title}" onkeydown="if(event.key==='Enter'||event.key===' ')openLgpdModal(${i})">
      <div class="lgpd-num">${p.num}</div>
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <span class="lgpd-card-hint">Ver explicação e exemplo →</span>
    </div>
  `).join('');
}

// INCIDENTS
let incidents=[];
function addIncident(){
  const type=document.getElementById('inc-type').value;
  const date=document.getElementById('inc-date').value;
  const sev=document.getElementById('inc-sev').value;
  const status=document.getElementById('inc-status').value;
  const desc=document.getElementById('inc-desc').value;
  const action=document.getElementById('inc-action').value;
  if(!desc){showToast('Preencha a descrição do incidente.');return}
  incidents.unshift({id:Date.now(),type,date:date||new Date().toLocaleDateString('pt-BR'),sev,status,desc,action});
  renderIncidents();
  document.getElementById('inc-desc').value='';
  document.getElementById('inc-action').value='';
  showToast('Incidente registrado com sucesso!');
}
function renderIncidents(){
  const el=document.getElementById('incidentList');
  if(!incidents.length){el.innerHTML='<p style="text-align:center;color:var(--text3);padding:2rem;font-size:14px">Nenhum incidente registrado ainda.</p>';return}
  const statusMap={'Aberto':'aberto','Em andamento':'andamento','Resolvido':'resolvido'};
  el.innerHTML=incidents.map(i=>`
    <div class="incident-item">
      <div class="inc-info">
        <div class="inc-type">${i.type} · Severidade: ${i.sev}</div>
        <div class="inc-desc">${i.desc}</div>
        ${i.action?`<div class="inc-desc" style="margin-top:4px;color:var(--text3)">Ação: ${i.action}</div>`:''}
      </div>
      <div class="inc-meta">
        <span class="date">${i.date}</span>
        <span class="status-badge ${statusMap[i.status]||'aberto'}">${i.status}</span>
      </div>
    </div>
  `).join('');
}

// TOAST
function showToast(msg){
  document.getElementById('toastMsg').textContent=msg;
  const t=document.getElementById('toast');
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// INIT
initPhishing();
initLGPD();
renderIncidents();

// Set today's date on incident form
const today=new Date().toISOString().split('T')[0];
document.getElementById('inc-date').value=today;
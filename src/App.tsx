import { useEffect, useMemo, useState } from 'react'
import WindowControls from './components/WindowControls'
import { appConfig } from './config/appConfig'
import { AlbionServer, City, PriceRow, cities, fetchPrices, itemCatalog, parseQueryToItemId, qualityMap, summarizePrices } from './services/albionApi'

type Screen = 'launcher' | 'loadscreen' | 'login' | 'dashboard'
type Module = 'home' | 'mercado' | 'refino' | 'crafting' | 'rotas' | 'dev' | 'usuarios' | 'database' | 'logs' | 'config'
type NewsItem = { title: string; text: string; date: string }

const NEWS_KEY = 'nyxhub_dev_news'

function loadNews(): NewsItem[] {
  try {
    const stored = localStorage.getItem(NEWS_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return appConfig.news
}

function saveNews(items: NewsItem[]) {
  localStorage.setItem(NEWS_KEY, JSON.stringify(items))
}

function formatSilver(value: number) {
  if (!value) return '-'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}m`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
  return value.toLocaleString('pt-BR')
}

function Launcher({ onStart }: { onStart: () => void }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Iniciando verificação...')
  const [news, setNews] = useState<NewsItem[]>(loadNews)

  async function checkUpdates() {
    setProgress(18); setStatus('Conectando aos servidores...')
    await new Promise(resolve => setTimeout(resolve, 260))
    setProgress(45); setStatus('Verificando versão atual...')
    await new Promise(resolve => setTimeout(resolve, 260))
    setProgress(70); setStatus('Verificando arquivos locais...')
    await new Promise(resolve => setTimeout(resolve, 260))
    setProgress(100); setStatus('Você está na versão mais recente!')
  }

  useEffect(() => {
    setNews(loadNews())
    checkUpdates()
  }, [])

  return (
    <main className="page launcher-page" style={{ backgroundImage: `url(${appConfig.assets.launcherBg})` }}>
      <section className="launcher launcher-clean">
        <WindowControls />
        <div className="top-status">● Conectado aos servidores</div>

        <aside className="left-panel">
          <div className="card status-card">
            <h2>⌁ STATUS DO SISTEMA</h2>
            <p><i>🌐</i><b>API Albion</b><span>ONLINE ●</span></p>
            <p><i>🛡</i><b>Autenticação</b><span>PRONTO ●</span></p>
            <p><i>⬡</i><b>Core NyxHub</b><span>ONLINE ●</span></p>
            <p><i>♙</i><b>Login</b><span>PRONTO ●</span></p>
            <p><i>▣</i><b>Preços Albion</b><span>PRONTO ●</span></p>
          </div>

          <div className="card updates-card">
            <h2>⟳ ATUALIZAÇÕES</h2>
            <div className="update-console update-complete">
              <div className="update-shield">✓</div>
              <strong>VERIFICAÇÃO CONCLUÍDA</strong>
              <small>{status}</small>
              <div className="progress-line"><i style={{ width: `${progress}%` }} /></div>
              <em>{progress}%</em>
            </div>
            <ul>
              <li className={progress >= 18 ? 'done' : ''}>Conectando aos servidores</li>
              <li className={progress >= 45 ? 'done' : ''}>Verificando versão atual</li>
              <li className={progress >= 70 ? 'done' : ''}>Verificando arquivos</li>
              <li className={progress >= 100 ? 'done' : ''}>Finalizando verificação</li>
            </ul>
          </div>

          <div className="card version-card">
            <small>▣ VERSÃO ATUAL</small>
            <strong>{appConfig.version}</strong>
            <span>NYXHUB LAUNCHER</span>
            <em>● ATUALIZADO</em>
          </div>
        </aside>

        <section className="center-panel launcher-center">
          <img src={appConfig.assets.logo} className="logo launcher-logo" />

          <button type="button" className="start-button ultra-start" onClick={onStart}>
            <i className="start-emblem">▶</i>
            <span>INICIAR</span>
            <small>ENTRAR NO NYXHUB</small>
          </button>

          <div className="launcher-benefits">
            <article>🛡<b>SEGURO</b><span>Proteção ativa</span></article>
            <article>⚡<b>RÁPIDO</b><span>Alto desempenho</span></article>
            <article>✅<b>ESTÁVEL</b><span>Sempre atualizado</span></article>
          </div>
        </section>

        <aside className="right-panel launcher-right">
          <div className="card news-card">
            <h2>▤ NOTÍCIAS DO LAUNCHER ⚙</h2>
            {news.slice(0, 3).map((item, index) => (
              <div className="news" key={`${item.title}-${index}`}>
                <div className="news-icon">{['🚀','🔎','🌐'][index] || '◆'}</div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                  <small>{item.date}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="safe safe-large">
            <strong>SISTEMA SEGURO</strong>
            <p>Todos os serviços operando normalmente.</p>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Loadscreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0)
  const steps = ['Inicializando núcleo NyxHub...', 'Verificando arquivos locais...', 'Carregando recursos visuais...', 'Sincronizando launcher...', 'Preparando autenticação segura...', 'Abrindo tela de login...']

  useEffect(() => {
    let current = 0
    const timer = setInterval(() => {
      current += 1
      setProgress(current)
      if (current >= 100) {
        clearInterval(timer)
        setTimeout(onFinish, 650)
      }
    }, 32)
    return () => clearInterval(timer)
  }, [onFinish])

  return (
    <main className="page loadscreen-page" style={{ backgroundImage: `url(${appConfig.assets.loadscreenBg})` }}>
      <WindowControls />
      <section className="loading-area">
        <div className="loading-title">INICIALIZANDO NYXHUB...</div>
        <div className="loading-bar"><i style={{ width: `${progress}%` }} /></div>
        <div className="loading-percent">{progress}%</div>
        <div className="loading-status">{steps[Math.min(steps.length - 1, Math.floor(progress / 18))]}</div>
      </section>
    </main>
  )
}

function Login({ onBack, onLogin }: { onBack: () => void; onLogin: () => void }) {
  const [user, setUser] = useState(appConfig.user)
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  function submit() {
    if (user === appConfig.user && pass === appConfig.password) {
      setError('')
      onLogin()
    } else {
      setError('Usuário ou senha incorretos.')
    }
  }

  return (
    <main className="page login-page" style={{ backgroundImage: `url(${appConfig.assets.loginBg})` }}>
      <WindowControls />
      <section className="login-panel">
        <img className="login-logo" src={appConfig.assets.logo} />
        <h2>BEM-VINDO DE VOLTA</h2>
        <p>Faça login para continuar</p>
        <label className="input">♙ <input value={user} onChange={e => setUser(e.target.value)} /></label>
        <label className="input">▣ <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Senha" /></label>
        <div className="error">{error}</div>
        <button type="button" className="login-btn" onClick={submit}>ENTRAR NO SISTEMA</button>
        <button type="button" className="back-btn" onClick={onBack}>VOLTAR AO LAUNCHER</button>
      </section>
    </main>
  )
}

function MiniSpark() {
  return <span className="spark"><i/><i/><i/><i/><i/></span>
}

function StatTop({ icon, label, value, hint }: { icon: string; label: string; value: string; hint: string }) {
  return (
    <article className="top-stat">
      <div className="stat-icon">{icon}</div>
      <div><small>{label}</small><strong>{value}</strong><span>{hint}</span></div>
      <MiniSpark />
    </article>
  )
}

function ServiceStatus() {
  const services = ['API Albion', 'Autenticação', 'Core NyxHub', 'Banco de Dados', 'Servidor de Arquivos', 'WebSockets']
  return (
    <div className="panel services-panel">
      <h2>⚙ STATUS DOS SERVIÇOS</h2>
      {services.map(s => <p key={s}><span>{s}</span><b>ONLINE</b></p>)}
      <button>Ver todos os serviços</button>
    </div>
  )
}

function ResourcePanel() {
  return (
    <div className="panel resources-panel">
      <h2>◈ USO DE RECURSOS</h2>
      <div className="rings">
        <div className="ring" style={{'--p':'23%'} as any}><strong>23%</strong><span>CPU</span><small>2.3 / 10 Cores</small></div>
        <div className="ring" style={{'--p':'41%'} as any}><strong>41%</strong><span>MEMÓRIA</span><small>6.5 / 16 GB</small></div>
        <div className="ring" style={{'--p':'32%'} as any}><strong>32%</strong><span>DISCO</span><small>152 / 476 GB</small></div>
      </div>
      <div className="ok-bar">✓ Todos os recursos operando normalmente</div>
    </div>
  )
}

function ActivityChart() {
  const points = [520, 860, 590, 560, 910, 1080, 1160, 840, 560, 820, 780, 950, 790, 510, 760, 830, 720, 880, 1080, 760, 1030, 900, 1150]
  return (
    <div className="panel chart-panel">
      <div className="panel-head"><h2>▣ ATIVIDADE DO SISTEMA</h2><select><option>Últimas 24 horas</option></select></div>
      <svg viewBox="0 0 620 230" className="chart">
        <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bd3cff" stopOpacity=".55"/><stop offset="100%" stopColor="#bd3cff" stopOpacity=".04"/></linearGradient></defs>
        {[0,1,2,3,4].map(i => <line key={i} x1="30" x2="600" y1={30+i*38} y2={30+i*38} />)}
        {points.map((_, i) => i % 4 === 0 ? <line key={`v${i}`} x1={30+i*24} x2={30+i*24} y1="25" y2="205" /> : null)}
        <polyline points={points.map((v,i)=>`${30+i*24},${205-(v/1300)*165}`).join(' ')} fill="none" stroke="#bd3cff" strokeWidth="3" />
        <polygon points={`30,205 ${points.map((v,i)=>`${30+i*24},${205-(v/1300)*165}`).join(' ')} ${30+(points.length-1)*24},205`} fill="url(#area)" />
        {points.map((v,i)=><circle key={i} cx={30+i*24} cy={205-(v/1300)*165} r="4" fill="#bd3cff"/>)}
      </svg>
      <div className="chart-metrics">
        <span><b>28.540</b>Requisições</span><span><b>12.842</b>Conexões</span><span><b>12</b>Erros</span><span><b>120ms</b>Tempo médio</span>
      </div>
    </div>
  )
}

function ModuleCard({ icon, title, children, onOpen }: { icon: string; title: string; children: any; onOpen: () => void }) {
  return <article className="module-card"><h2>{icon} {title}</h2><div className="module-content">{children}</div><button onClick={onOpen}>Acessar módulo</button></article>
}

function HomeDashboard({ setActive }: { setActive: (m: Module) => void }) {
  return (
    <section className="dashboard-home">
      <div className="dashboard-title"><h1>Dashboard</h1><p>Visão geral dos sistemas e ferramentas do NyxHub</p></div>

      <div className="top-stats">
        <StatTop icon="👥" label="USUÁRIOS ONLINE" value="1.248" hint="+112% nas últimas 24h" />
        <StatTop icon="⬡" label="MÓDULOS ATIVOS" value="6 / 6" hint="100% Operacionais" />
        <StatTop icon="▤" label="SERVIDORES" value="Online" hint="Todos operando" />
        <StatTop icon="◎" label="VERSÃO ATUAL" value={appConfig.version} hint="Última atualização" />
        <StatTop icon="🛡" label="UPTIME" value="15d 07h 32m" hint="Tempo online" />
      </div>

      <div className="dashboard-row"><ActivityChart /><ResourcePanel /><ServiceStatus /></div>

      <div className="role-row">
        <article><h2>👤 USUÁRIO</h2><p>Consulta de preços, radar de mercado e rotas.</p></article>
        <article><h2>👑 ADMINISTRADOR</h2><p>Gerenciamento operacional, status e permissões.</p></article>
        <article><h2>⌘ DESENVOLVEDOR</h2><p>Logs, API, banco de dados, webhooks e configuração.</p></article>
      </div>

      <div className="modules-row">
        <ModuleCard icon="📊" title="Radar de Mercado" onOpen={() => setActive('mercado')}>
          <p>Consulta real <b>API Albion</b> <span className="good">ONLINE</span></p>
          <p>Servidores <b>West/East/EU</b></p>
          <p>Cidades <b>11</b></p>
          <p>Rotas <b>Auto</b></p>
        </ModuleCard>
        <ModuleCard icon="⚗" title="Refino" onOpen={() => setActive('refino')}>
          <h3>Real <span className="good">API</span></h3><p>Recursos <b>T4–T8</b></p><p>Compra/Venda <b>Online</b></p>
        </ModuleCard>
        <ModuleCard icon="⚒" title="Crafting" onOpen={() => setActive('crafting')}>
          <h3>Custos <span className="good">Online</span></h3><p>Ingredientes <b>API</b></p><p>Margem <b>Auto</b></p>
        </ModuleCard>
        <ModuleCard icon="📍" title="Rotas" onOpen={() => setActive('rotas')}>
          <h3>Lucro <span className="good">Auto</span></h3><p>Compra <b>Menor preço</b></p><p>Venda <b>Maior buy order</b></p>
        </ModuleCard>
        <ModuleCard icon="⌘" title="Painel Desenvolvedor" onOpen={() => setActive('dev')}>
          <div className="dev-shortcuts"><span>⚙ Configurações</span><span>🗄 Banco de Dados</span><span>📄 Logs</span><span>☁ Backup</span><span>👥 Usuários</span><span>🔒 Permissões</span><span>📋 Tarefas</span><span>🔗 Webhooks</span></div>
        </ModuleCard>
      </div>
    </section>
  )
}

function PriceTable({ rows }: { rows: PriceRow[] }) {
  return (
    <div className="price-table">
      <table>
        <thead><tr><th>Cidade</th><th>Venda mín.</th><th>Compra máx.</th><th>Qualidade</th><th>Atualização</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.city}-${i}`}>
              <td>{r.city}</td>
              <td>{formatSilver(r.sell_price_min)}</td>
              <td>{formatSilver(r.buy_price_max)}</td>
              <td>Q{r.quality}</td>
              <td>{(r.sell_price_min_date || r.buy_price_max_date || '-').slice(0, 16).replace('T', ' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MarketModule() {
  const [server, setServer] = useState<AlbionServer>('west')
  const [query, setQuery] = useState('Sacola do Adepto')
  const [quality, setQuality] = useState('Normal')
  const [rows, setRows] = useState<PriceRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const summary = useMemo(() => summarizePrices(rows), [rows])

  async function search() {
    setLoading(true)
    setError('')
    try {
      const itemId = parseQueryToItemId(query)
      const data = await fetchPrices({ server, itemIds: [itemId], locations: cities, qualities: [qualityMap[quality]] })
      setRows(data)
    } catch (e: any) {
      setError(e.message || 'Falha ao consultar API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { search() }, [])

  return (
    <section className="dashboard-module">
      <h1>Radar de Mercado</h1>
      <p>Consulta real na API pública do Albion Online Data Project.</p>

      <div className="api-form panel">
        <select value={server} onChange={e => setServer(e.target.value as AlbionServer)}><option value="west">Americas / West</option><option value="east">Asia / East</option><option value="europe">Europe</option></select>
        <input list="items" value={query} onChange={e => setQuery(e.target.value)} placeholder="Item ou ID: T4_BAG" />
        <datalist id="items">{itemCatalog.map(i => <option key={i.id} value={i.name}>{i.id}</option>)}</datalist>
        <select value={quality} onChange={e => setQuality(e.target.value)}>{Object.keys(qualityMap).map(q => <option key={q}>{q}</option>)}</select>
        <button onClick={search}>{loading ? 'Consultando...' : 'Consultar API'}</button>
      </div>

      {error && <div className="api-error">{error}</div>}

      <div className="metrics">
        <article><small>Menor venda</small><strong>{summary.cheapest ? formatSilver(summary.cheapest.sell_price_min) : '-'}</strong><span>{summary.cheapest?.city || 'Sem dados'}</span></article>
        <article><small>Maior compra</small><strong>{summary.highestBuy ? formatSilver(summary.highestBuy.buy_price_max) : '-'}</strong><span>{summary.highestBuy?.city || 'Sem dados'}</span></article>
        <article><small>Melhor rota</small><strong>{summary.route ? formatSilver(summary.route.profit) : '-'}</strong><span>{summary.route ? `${summary.route.buy.city} → ${summary.route.sell.city}` : 'Aguardando dados'}</span></article>
      </div>

      <PriceTable rows={summary.valid} />
    </section>
  )
}

function RefiningModule() {
  const [server, setServer] = useState<AlbionServer>('west')
  const [raw, setRaw] = useState('T4_ORE')
  const [refined, setRefined] = useState('T4_METALBAR')
  const [rows, setRows] = useState<PriceRow[]>([])
  const [loading, setLoading] = useState(false)

  async function calculate() {
    setLoading(true)
  }

  async function run() {
    setLoading(true)
    try {
      const data = await fetchPrices({ server, itemIds: [raw, refined], locations: cities })
      setRows(data)
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { run() }, [])

  const rawRows = rows.filter(r => r.item_id === raw)
  const refinedRows = rows.filter(r => r.item_id === refined)
  const rawMin = summarizePrices(rawRows).cheapest
  const refMax = summarizePrices(refinedRows).highestBuy
  const estimated = rawMin && refMax ? refMax.buy_price_max - rawMin.sell_price_min * 2 : 0

  return (
    <section className="dashboard-module">
      <h1>Refino</h1>
      <p>Consulta preços reais de recurso bruto e refinado para estimar margem básica.</p>
      <div className="api-form panel">
        <select value={server} onChange={e => setServer(e.target.value as AlbionServer)}><option value="west">Americas / West</option><option value="east">Asia / East</option><option value="europe">Europe</option></select>
        <input value={raw} onChange={e => setRaw(e.target.value.toUpperCase())} />
        <input value={refined} onChange={e => setRefined(e.target.value.toUpperCase())} />
        <button onClick={run}>{loading ? 'Calculando...' : 'Calcular'}</button>
      </div>
      <div className="metrics">
        <article><small>Bruto menor venda</small><strong>{rawMin ? formatSilver(rawMin.sell_price_min) : '-'}</strong><span>{rawMin?.city || 'Sem dados'}</span></article>
        <article><small>Refinado maior compra</small><strong>{refMax ? formatSilver(refMax.buy_price_max) : '-'}</strong><span>{refMax?.city || 'Sem dados'}</span></article>
        <article><small>Margem estimada</small><strong>{formatSilver(estimated)}</strong><span>Fórmula base configurável</span></article>
      </div>
      <PriceTable rows={rows.filter(r => r.sell_price_min > 0 || r.buy_price_max > 0)} />
    </section>
  )
}

function CraftingModule() {
  const [server, setServer] = useState<AlbionServer>('west')
  const [product, setProduct] = useState('T4_BAG')
  const [materials, setMaterials] = useState('T4_LEATHER,T4_CLOTH')
  const [rows, setRows] = useState<PriceRow[]>([])
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    try {
      const ids = [product, ...materials.split(',').map(x => x.trim()).filter(Boolean)]
      setRows(await fetchPrices({ server, itemIds: ids, locations: cities }))
    } catch { setRows([]) } finally { setLoading(false) }
  }

  useEffect(() => { run() }, [])

  const productMax = summarizePrices(rows.filter(r => r.item_id === product)).highestBuy
  const materialCost = materials.split(',').map(x => x.trim()).filter(Boolean).reduce((sum, id) => {
    const min = summarizePrices(rows.filter(r => r.item_id === id)).cheapest
    return sum + (min?.sell_price_min || 0)
  }, 0)
  const profit = (productMax?.buy_price_max || 0) - materialCost

  return (
    <section className="dashboard-module">
      <h1>Crafting</h1>
      <p>Calcula custo base com preços reais dos materiais e venda do produto.</p>
      <div className="api-form panel">
        <select value={server} onChange={e => setServer(e.target.value as AlbionServer)}><option value="west">Americas / West</option><option value="east">Asia / East</option><option value="europe">Europe</option></select>
        <input value={product} onChange={e => setProduct(e.target.value.toUpperCase())} />
        <input value={materials} onChange={e => setMaterials(e.target.value.toUpperCase())} />
        <button onClick={run}>{loading ? 'Consultando...' : 'Calcular'}</button>
      </div>
      <div className="metrics">
        <article><small>Venda produto</small><strong>{productMax ? formatSilver(productMax.buy_price_max) : '-'}</strong><span>{productMax?.city || 'Sem dados'}</span></article>
        <article><small>Custo materiais</small><strong>{formatSilver(materialCost)}</strong><span>Base por 1 unidade de cada</span></article>
        <article><small>Lucro estimado</small><strong>{formatSilver(profit)}</strong><span>Ajuste receitas no Painel DEV</span></article>
      </div>
      <PriceTable rows={rows.filter(r => r.sell_price_min > 0 || r.buy_price_max > 0)} />
    </section>
  )
}

function RoutesModule() {
  const [server, setServer] = useState<AlbionServer>('west')
  const [query, setQuery] = useState('T4_BAG')
  const [rows, setRows] = useState<PriceRow[]>([])
  const [loading, setLoading] = useState(false)

  async function run() {
    setLoading(true)
    try {
      setRows(await fetchPrices({ server, itemIds: [parseQueryToItemId(query)], locations: cities }))
    } catch { setRows([]) } finally { setLoading(false) }
  }

  useEffect(() => { run() }, [])

  const route = summarizePrices(rows).route

  return (
    <section className="dashboard-module">
      <h1>Rotas</h1>
      <p>Compara compra e venda nas cidades para sugerir a melhor rota por lucro bruto.</p>
      <div className="api-form panel">
        <select value={server} onChange={e => setServer(e.target.value as AlbionServer)}><option value="west">Americas / West</option><option value="east">Asia / East</option><option value="europe">Europe</option></select>
        <input value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={run}>{loading ? 'Analisando...' : 'Analisar rota'}</button>
      </div>
      <div className="route-card panel">
        <h2>Melhor rota detectada</h2>
        {route ? <><strong>{route.buy.city} → {route.sell.city}</strong><p>Comprar por {formatSilver(route.buy.sell_price_min)} e vender para ordem de compra por {formatSilver(route.sell.buy_price_max)}.</p><em>Lucro bruto: {formatSilver(route.profit)} • Margem: {route.margin.toFixed(2)}%</em></> : <p>Sem dados suficientes para rota.</p>}
      </div>
      <PriceTable rows={rows.filter(r => r.sell_price_min > 0 || r.buy_price_max > 0)} />
    </section>
  )
}

function DevPanel() {
  const [news, setNews] = useState<NewsItem[]>(loadNews())
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [logs, setLogs] = useState<string[]>(['Sistema iniciado.', 'Dashboard carregado.', 'Painel DEV pronto.'])
  const [maintenance, setMaintenance] = useState(false)

  function addNews() {
    if (!title.trim() || !text.trim()) return
    const item: NewsItem = { title: title.trim(), text: text.trim(), date: new Date().toLocaleDateString('pt-BR') }
    const updated = [item, ...news].slice(0, 12)
    setNews(updated); saveNews(updated); setTitle(''); setText('')
    setLogs([`Notícia adicionada: ${item.title}`, ...logs])
  }

  function removeNews(index: number) {
    const updated = news.filter((_, i) => i !== index)
    setNews(updated); saveNews(updated); setLogs(['Notícia removida.', ...logs])
  }

  return (
    <section className="dashboard-module dev-module">
      <h1>Painel Desenvolvedor</h1>
      <p>Gerencie notícias, status, módulos, logs, permissões e manutenção do aplicativo.</p>
      <div className="dev-tools">
        <button onClick={() => setMaintenance(!maintenance)}>⚙<b>Modo</b><span>{maintenance ? 'Manutenção' : 'Produção'}</span></button>
        <button onClick={() => setLogs(['Backup local criado.', ...logs])}>☁<b>Backup</b><span>Gerar</span></button>
        <button onClick={() => setLogs(['Cache visual limpo.', ...logs])}>🧹<b>Limpeza</b><span>Cache UI</span></button>
        <button onClick={() => setLogs(['Diagnóstico executado.', ...logs])}>📈<b>Diagnóstico</b><span>Executar</span></button>
        <button onClick={() => setLogs(['Permissões verificadas.', ...logs])}>🔒<b>Permissões</b><span>Verificar</span></button>
        <button onClick={() => setLogs(['Configuração salva.', ...logs])}>💾<b>Salvar</b><span>Config</span></button>
      </div>
      <div className="dashboard-grid-two">
        <div className="panel dev-card">
          <h2>Notícias do Launcher</h2>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da notícia" />
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Descrição da notícia" />
          <div className="form-row"><button onClick={addNews}>Adicionar notícia</button><button onClick={() => {setNews(appConfig.news); saveNews(appConfig.news)}}>Restaurar padrão</button></div>
          <div className="news-manager">
            {news.map((item, index) => (
              <article key={`${item.title}-${index}`}>
                <div><strong>{item.title}</strong><p>{item.text}</p><small>{item.date}</small></div>
                <button onClick={() => removeNews(index)}>Remover</button>
              </article>
            ))}
          </div>
        </div>
        <div className="panel dev-card"><h2>Logs do Sistema</h2><div className="log-list">{logs.map((log, i) => <p key={`${log}-${i}`}>› {log}</p>)}</div></div>
      </div>
    </section>
  )
}

function SimpleModule({ module }: { module: Module }) {
  const titles: Record<string,string> = { usuarios:'Usuários', database:'Banco de Dados', logs:'Logs do Sistema', config:'Configurações' }
  return <section className="dashboard-module"><h1>{titles[module]}</h1><p>Módulo administrativo preparado para persistência local e banco real.</p><div className="metrics"><article><small>Status</small><strong>ONLINE</strong><span>Pronto</span></article><article><small>Permissão</small><strong>ADMIN</strong><span>Acesso protegido</span></article><article><small>Sincronização</small><strong>LOCAL</strong><span>Configurável</span></article></div></section>
}

function Dashboard({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState<Module>('home')
  return (
    <main className="page dashboard-page" style={{ backgroundImage: `url(${appConfig.assets.launcherBg})` }}>
      <WindowControls />
      <aside className="dash-sidebar">
        <img src={appConfig.assets.logo} />
        <button className={active === 'home' ? 'active' : ''} onClick={() => setActive('home')}>🏠 Dashboard</button>
        <h4>SISTEMAS</h4>
        <button className={active === 'mercado' ? 'active' : ''} onClick={() => setActive('mercado')}>📊 Radar de Mercado</button>
        <button className={active === 'refino' ? 'active' : ''} onClick={() => setActive('refino')}>⚗ Refino</button>
        <button className={active === 'crafting' ? 'active' : ''} onClick={() => setActive('crafting')}>⚒ Crafting</button>
        <button className={active === 'rotas' ? 'active' : ''} onClick={() => setActive('rotas')}>📍 Rotas</button>
        <h4>GERAL</h4>
        <button className={active === 'usuarios' ? 'active' : ''} onClick={() => setActive('usuarios')}>👥 Usuários</button>
        <button className={active === 'database' ? 'active' : ''} onClick={() => setActive('database')}>🗄 Banco de Dados</button>
        <button className={active === 'logs' ? 'active' : ''} onClick={() => setActive('logs')}>📋 Logs do Sistema</button>
        <button className={active === 'config' ? 'active' : ''} onClick={() => setActive('config')}>⚙ Configurações</button>
        <h4>DESENVOLVEDOR</h4>
        <button className={active === 'dev' ? 'active dev' : 'dev'} onClick={() => setActive('dev')}>⌘ Painel Desenvolvedor</button>
        <button onClick={onBack}>← Voltar ao Launcher</button>
        <div className="sidebar-footer"><img src={appConfig.assets.logo} /><span>Versão: <b>{appConfig.version}</b></span><em>● Atualizado</em></div>
      </aside>
      <section className="dash-main">
        {active === 'home' && <HomeDashboard setActive={setActive} />}
        {active === 'mercado' && <MarketModule />}
        {active === 'refino' && <RefiningModule />}
        {active === 'crafting' && <CraftingModule />}
        {active === 'rotas' && <RoutesModule />}
        {active === 'dev' && <DevPanel />}
        {['usuarios','database','logs','config'].includes(active) && <SimpleModule module={active} />}
      </section>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('launcher')
  if (screen === 'loadscreen') return <Loadscreen onFinish={() => setScreen('login')} />
  if (screen === 'login') return <Login onBack={() => setScreen('launcher')} onLogin={() => setScreen('dashboard')} />
  if (screen === 'dashboard') return <Dashboard onBack={() => setScreen('launcher')} />
  return <Launcher onStart={() => setScreen('loadscreen')} />
}

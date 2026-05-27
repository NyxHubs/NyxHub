import { useEffect, useState } from 'react'
import WindowControls from './components/WindowControls'
import { appConfig } from './config/appConfig'

type Screen = 'launcher' | 'loadscreen' | 'login' | 'dashboard'
type Module = 'mercado' | 'refino' | 'crafting' | 'rotas' | 'dev'
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

function Launcher({ onStart, onOpenDashboard }: { onStart: () => void; onOpenDashboard: (module?: Module) => void }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Iniciando verificação...')
  const [news, setNews] = useState<NewsItem[]>(loadNews)

  async function checkUpdates() {
    setProgress(18)
    setStatus('Conectando aos servidores...')
    await new Promise(resolve => setTimeout(resolve, 300))
    setProgress(45)
    setStatus('Verificando versão atual...')
    await new Promise(resolve => setTimeout(resolve, 300))
    setProgress(70)
    setStatus('Verificando arquivos locais...')
    await new Promise(resolve => setTimeout(resolve, 300))
    setStatus('Você está na versão mais recente!')
    setProgress(100)
  }

  useEffect(() => {
    setNews(loadNews())
    checkUpdates()
  }, [])

  return (
    <main className="page launcher-page" style={{ backgroundImage: `url(${appConfig.assets.launcherBg})` }}>
      <section className="launcher">
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
              <div className="update-badge shield">✓</div>
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

        <section className="center-panel">
          <img src={appConfig.assets.logo} className="logo" />

          <div className="status-grid">
            <article>🌐<b>API ALBION</b><span>ONLINE</span></article>
            <article>♙<b>LOGIN</b><span>PRONTO</span></article>
            <article>🏷<b>PREÇOS</b><span>PRONTO</span></article>
            <article>▤<b>SERVIDORES</b><span>ESTÁVEIS</span></article>
          </div>

          <button type="button" className="start-button mega-start" onClick={onStart}>
            <i className="start-emblem">▶</i>
            <span>INICIAR</span>
            <b>››</b>
          </button>

          <nav className="quick-modules">
            <button onClick={() => onOpenDashboard('mercado')}>📊<span>Radar de<br/>Mercado</span></button>
            <button onClick={() => onOpenDashboard('refino')}>⚗<span>Refino</span></button>
            <button onClick={() => onOpenDashboard('crafting')}>⚒<span>Crafting</span></button>
            <button onClick={() => onOpenDashboard('rotas')}>📍<span>Rotas</span></button>
            <button onClick={() => onOpenDashboard('dev')}>⌘<span>Painel Dev</span></button>
          </nav>
        </section>

        <aside className="right-panel">
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

          <div className="safe">
            <strong>SISTEMA SEGURO</strong>
            <p>Todos os serviços operando normalmente.</p>
          </div>

          <div className="card dev-mini">
            <h2>⌘ PAINEL DESENVOLVEDOR</h2>
            <div className="dev-grid-mini">
              <button onClick={() => onOpenDashboard('dev')}>⚙<span>Configurações</span></button>
              <button onClick={() => onOpenDashboard('dev')}>🗄<span>Banco de Dados</span></button>
              <button onClick={() => onOpenDashboard('dev')}>📄<span>Logs</span></button>
              <button onClick={() => onOpenDashboard('dev')}>☁<span>Backup</span></button>
              <button onClick={() => onOpenDashboard('dev')}>👥<span>Usuários</span></button>
              <button onClick={() => onOpenDashboard('dev')}>🔒<span>Permissões</span></button>
              <button onClick={() => onOpenDashboard('dev')}>📋<span>Tarefas</span></button>
              <button onClick={() => onOpenDashboard('dev')}>🔗<span>Webhooks</span></button>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

function Loadscreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0)
  const steps = [
    'Inicializando núcleo NyxHub...',
    'Verificando arquivos locais...',
    'Carregando recursos visuais...',
    'Sincronizando launcher...',
    'Preparando autenticação segura...',
    'Abrindo tela de login...'
  ]

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

function MetricCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return <article className="metric-card"><small>{title}</small><strong>{value}</strong><span>{hint}</span></article>
}

function ModuleContent({ module }: { module: Module }) {
  if (module === 'mercado') {
    return (
      <section className="dashboard-module">
        <h1>Radar de Mercado</h1>
        <p>Consulta rápida de preços, comparação entre cidades e análise de oportunidade.</p>
        <div className="metrics">
          <MetricCard title="API Albion" value="ONLINE" hint="Fonte pronta para integração" />
          <MetricCard title="Cidades" value="9" hint="Thetford, Bridgewatch, Caerleon e mais" />
          <MetricCard title="Modo" value="Consulta" hint="Painel preparado para preços reais" />
        </div>
        <div className="dashboard-card wide">
          <h2>Pesquisa de item</h2>
          <div className="form-row"><input placeholder="Ex: Machado de Guerra 4.2 Excelente" /><button>Consultar</button></div>
          <p className="muted">Próximo passo: ligar este painel à API real do Albion Online Data Project.</p>
        </div>
      </section>
    )
  }

  if (module === 'refino') {
    return (
      <section className="dashboard-module">
        <h1>Refino</h1>
        <p>Simulador de recursos, retorno de foco, cidade bônus e estimativa de margem.</p>
        <div className="metrics">
          <MetricCard title="Retorno" value="Configurável" hint="Com ou sem foco" />
          <MetricCard title="Recursos" value="T2–T8" hint="Base preparada" />
          <MetricCard title="Lucro" value="Auto" hint="Cálculo por preço de compra/venda" />
        </div>
        <div className="dashboard-card wide"><h2>Calculadora de refino</h2><p className="muted">Campos e lógica preparados para receber fórmulas e API.</p></div>
      </section>
    )
  }

  if (module === 'crafting') {
    return (
      <section className="dashboard-module">
        <h1>Crafting</h1>
        <p>Área para calcular custo de fabricação, artefatos, retorno e lucro estimado.</p>
        <div className="metrics">
          <MetricCard title="Itens" value="Catálogo" hint="Preparado para assets" />
          <MetricCard title="Qualidade" value="Normal–MP" hint="Pronto para filtros" />
          <MetricCard title="Margem" value="Auto" hint="Custo x venda" />
        </div>
        <div className="dashboard-card wide"><h2>Planejador de crafting</h2><p className="muted">Inclui estrutura para tier, encantamento, qualidade e quantidade.</p></div>
      </section>
    )
  }

  if (module === 'rotas') {
    return (
      <section className="dashboard-module">
        <h1>Rotas</h1>
        <p>Planejamento de transporte, risco, tempo estimado e rota sugerida entre cidades.</p>
        <div className="metrics">
          <MetricCard title="Risco" value="Visual" hint="Seguro, médio e alto" />
          <MetricCard title="Cidades" value="Todas" hint="Royal, Caerleon e Brecilien" />
          <MetricCard title="Sugestão" value="Manual" hint="Pronto para algoritmo" />
        </div>
        <div className="dashboard-card wide"><h2>Construtor de rota</h2><p className="muted">Preparado para exibir origem, destino, zonas e alertas.</p></div>
      </section>
    )
  }

  return null
}

function DevPanel() {
  const [news, setNews] = useState<NewsItem[]>(loadNews())
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [setting, setSetting] = useState('Modo produção')
  const [apiStatus, setApiStatus] = useState('ONLINE')
  const [logs, setLogs] = useState<string[]>(['Sistema iniciado.', 'Dashboard carregado.', 'Painel DEV pronto.'])

  function addNews() {
    if (!title.trim() || !text.trim()) return
    const item: NewsItem = { title: title.trim(), text: text.trim(), date: new Date().toLocaleDateString('pt-BR') }
    const updated = [item, ...news].slice(0, 12)
    setNews(updated)
    saveNews(updated)
    setTitle('')
    setText('')
    setLogs([`Notícia adicionada: ${item.title}`, ...logs])
  }

  function removeNews(index: number) {
    const updated = news.filter((_, i) => i !== index)
    setNews(updated)
    saveNews(updated)
    setLogs(['Notícia removida.', ...logs])
  }

  function resetNews() {
    setNews(appConfig.news)
    saveNews(appConfig.news)
    setLogs(['Notícias restauradas para padrão.', ...logs])
  }

  return (
    <section className="dashboard-module dev-module">
      <h1>Painel Desenvolvedor</h1>
      <p>Ferramentas para gerenciar o aplicativo, notícias, status, logs e manutenção.</p>

      <div className="dev-tools">
        <button onClick={() => setSetting(setting === 'Modo produção' ? 'Modo manutenção' : 'Modo produção')}>⚙<b>Modo</b><span>{setting}</span></button>
        <button onClick={() => setApiStatus(apiStatus === 'ONLINE' ? 'OFFLINE' : 'ONLINE')}>🌐<b>API Status</b><span>{apiStatus}</span></button>
        <button onClick={() => setLogs(['Cache visual limpo.', ...logs])}>🧹<b>Limpeza</b><span>Cache UI</span></button>
        <button onClick={() => setLogs(['Backup local simulado criado.', ...logs])}>☁<b>Backup</b><span>Local</span></button>
        <button onClick={() => setLogs(['Diagnóstico executado.', ...logs])}>📈<b>Diagnóstico</b><span>Executar</span></button>
        <button onClick={() => setLogs(['Configuração salva.', ...logs])}>💾<b>Salvar</b><span>Config</span></button>
      </div>

      <div className="dashboard-grid-two">
        <div className="dashboard-card">
          <h2>Notícias do Launcher</h2>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da notícia" />
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Descrição da notícia" />
          <div className="form-row"><button onClick={addNews}>Adicionar</button><button onClick={resetNews}>Restaurar padrão</button></div>
          <div className="news-manager">
            {news.map((item, index) => (
              <article key={`${item.title}-${index}`}>
                <div><strong>{item.title}</strong><p>{item.text}</p><small>{item.date}</small></div>
                <button onClick={() => removeNews(index)}>Remover</button>
              </article>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Logs do Sistema</h2>
          <div className="log-list">
            {logs.map((log, i) => <p key={`${log}-${i}`}>› {log}</p>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function Dashboard({ startModule, onBack }: { startModule: Module; onBack: () => void }) {
  const [active, setActive] = useState<Module>(startModule)

  useEffect(() => setActive(startModule), [startModule])

  return (
    <main className="page dashboard-page" style={{ backgroundImage: `url(${appConfig.assets.launcherBg})` }}>
      <WindowControls />

      <aside className="main-side">
        <img src={appConfig.assets.logo} />
        <button className={active === 'mercado' ? 'active' : ''} onClick={() => setActive('mercado')}>📊 Radar de Mercado</button>
        <button className={active === 'refino' ? 'active' : ''} onClick={() => setActive('refino')}>⚗ Refino</button>
        <button className={active === 'crafting' ? 'active' : ''} onClick={() => setActive('crafting')}>⚒ Crafting</button>
        <button className={active === 'rotas' ? 'active' : ''} onClick={() => setActive('rotas')}>📍 Rotas</button>
        <button className={active === 'dev' ? 'active dev' : 'dev'} onClick={() => setActive('dev')}>⌘ Painel Desenvolvedor</button>
        <button onClick={onBack}>← Voltar ao Launcher</button>
      </aside>

      <section className="main-content">
        {active === 'dev' ? <DevPanel /> : <ModuleContent module={active} />}
      </section>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('launcher')
  const [dashboardModule, setDashboardModule] = useState<Module>('mercado')

  function openDashboard(module: Module = 'mercado') {
    setDashboardModule(module)
    setScreen('dashboard')
  }

  if (screen === 'loadscreen') return <Loadscreen onFinish={() => setScreen('login')} />
  if (screen === 'login') return <Login onBack={() => setScreen('launcher')} onLogin={() => openDashboard('mercado')} />
  if (screen === 'dashboard') return <Dashboard startModule={dashboardModule} onBack={() => setScreen('launcher')} />

  return <Launcher onStart={() => setScreen('loadscreen')} onOpenDashboard={openDashboard} />
}

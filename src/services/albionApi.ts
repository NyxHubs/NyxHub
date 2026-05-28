export type AlbionServer = 'west' | 'east' | 'europe'

export type City =
  | 'Bridgewatch'
  | 'Caerleon'
  | 'Fort Sterling'
  | 'Lymhurst'
  | 'Martlock'
  | 'Thetford'
  | 'Brecilien'
  | 'Black Market'
  | "Arthur's Rest"
  | "Merlyn's Rest"
  | "Morgana's Rest"

export type PriceRow = {
  item_id: string
  city: string
  quality: number
  sell_price_min: number
  sell_price_min_date: string
  sell_price_max: number
  sell_price_max_date: string
  buy_price_max: number
  buy_price_max_date: string
  buy_price_min: number
  buy_price_min_date: string
}

export const servers: Record<AlbionServer, string> = {
  west: 'https://west.albion-online-data.com',
  east: 'https://east.albion-online-data.com',
  europe: 'https://europe.albion-online-data.com'
}

export const cities: City[] = [
  'Bridgewatch',
  'Caerleon',
  'Fort Sterling',
  'Lymhurst',
  'Martlock',
  'Thetford',
  'Brecilien',
  'Black Market',
  "Arthur's Rest",
  "Merlyn's Rest",
  "Morgana's Rest"
]

export const qualityMap: Record<string, number> = {
  Normal: 1,
  Bom: 2,
  Excepcional: 3,
  Excelente: 4,
  'Obra Prima': 5
}

export const itemCatalog = [
  { name: 'Sacola do Adepto', id: 'T4_BAG' },
  { name: 'Sacola do Perito', id: 'T5_BAG' },
  { name: 'Capa do Adepto', id: 'T4_CAPE' },
  { name: 'Capa do Perito', id: 'T5_CAPE' },
  { name: 'Madeira T4', id: 'T4_WOOD' },
  { name: 'Madeira T5', id: 'T5_WOOD' },
  { name: 'Minério T4', id: 'T4_ORE' },
  { name: 'Minério T5', id: 'T5_ORE' },
  { name: 'Fibra T4', id: 'T4_FIBER' },
  { name: 'Fibra T5', id: 'T5_FIBER' },
  { name: 'Couro T4', id: 'T4_HIDE' },
  { name: 'Couro T5', id: 'T5_HIDE' },
  { name: 'Pedra T4', id: 'T4_ROCK' },
  { name: 'Pedra T5', id: 'T5_ROCK' },
  { name: 'Barra de Metal T4', id: 'T4_METALBAR' },
  { name: 'Barra de Metal T5', id: 'T5_METALBAR' },
  { name: 'Tábua T4', id: 'T4_PLANKS' },
  { name: 'Tábua T5', id: 'T5_PLANKS' },
  { name: 'Tecido T4', id: 'T4_CLOTH' },
  { name: 'Tecido T5', id: 'T5_CLOTH' },
  { name: 'Couro Refinado T4', id: 'T4_LEATHER' },
  { name: 'Couro Refinado T5', id: 'T5_LEATHER' },
  { name: 'Bloco de Pedra T4', id: 'T4_STONEBLOCK' },
  { name: 'Bloco de Pedra T5', id: 'T5_STONEBLOCK' },
  { name: 'Machado de Guerra T4', id: 'T4_2H_AXE' },
  { name: 'Machado de Guerra T5', id: 'T5_2H_AXE' },
  { name: 'Cajado de Fogo T4', id: 'T4_MAIN_FIRESTAFF' },
  { name: 'Arco T4', id: 'T4_2H_BOW' },
  { name: 'Boi de Transporte Adepto', id: 'T4_MOUNT_OX' },
  { name: 'Cavalo Adepto', id: 'T4_MOUNT_HORSE' }
]

export function parseQueryToItemId(query: string): string {
  const q = query.trim().toLowerCase()
  const exact = itemCatalog.find(i => i.id.toLowerCase() === q || i.name.toLowerCase() === q)
  if (exact) return exact.id

  const partial = itemCatalog.find(i => i.name.toLowerCase().includes(q) || q.includes(i.name.toLowerCase()))
  if (partial) return partial.id

  const tier = q.match(/t([4-8])/i)?.[1] || '4'

  if (q.includes('madeira')) return `T${tier}_WOOD`
  if (q.includes('minério') || q.includes('minerio') || q.includes('ore')) return `T${tier}_ORE`
  if (q.includes('fibra')) return `T${tier}_FIBER`
  if (q.includes('couro')) return `T${tier}_HIDE`
  if (q.includes('pedra')) return `T${tier}_ROCK`
  if (q.includes('sacola') || q.includes('bag')) return `T${tier}_BAG`
  if (q.includes('capa')) return `T${tier}_CAPE`
  if (q.includes('machado')) return `T${tier}_2H_AXE`
  if (q.includes('arco')) return `T${tier}_2H_BOW`
  if (q.includes('fogo')) return `T${tier}_MAIN_FIRESTAFF`

  return query.trim().toUpperCase().replaceAll(' ', '_')
}

export async function fetchPrices(params: {
  server: AlbionServer
  itemIds: string[]
  locations?: string[]
  qualities?: number[]
}): Promise<PriceRow[]> {
  const host = servers[params.server]
  const itemIds = params.itemIds.join(',')
  const locationList = params.locations?.length ? params.locations : cities
  const locations = encodeURIComponent(locationList.join(','))
  const qualities = params.qualities?.length ? `&qualities=${params.qualities.join(',')}` : ''
  const url = `${host}/api/v2/stats/prices/${itemIds}.json?locations=${locations}${qualities}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Falha na API Albion: ${response.status}`)
  }

  return response.json()
}

export function bestRouteFromPrices(rows: PriceRow[]) {
  const validBuy = rows.filter(r => r.sell_price_min > 0)
  const validSell = rows.filter(r => r.buy_price_max > 0)

  if (!validBuy.length || !validSell.length) return null

  const buy = [...validBuy].sort((a, b) => a.sell_price_min - b.sell_price_min)[0]
  const sell = [...validSell].sort((a, b) => b.buy_price_max - a.buy_price_max)[0]
  const profit = sell.buy_price_max - buy.sell_price_min

  return {
    buy,
    sell,
    profit,
    margin: buy.sell_price_min ? (profit / buy.sell_price_min) * 100 : 0
  }
}

export function summarizePrices(rows: PriceRow[]) {
  const valid = rows.filter(r => r.sell_price_min > 0 || r.buy_price_max > 0)
  const cheapest = [...valid].filter(r => r.sell_price_min > 0).sort((a, b) => a.sell_price_min - b.sell_price_min)[0]
  const highestBuy = [...valid].filter(r => r.buy_price_max > 0).sort((a, b) => b.buy_price_max - a.buy_price_max)[0]

  return {
    valid,
    cheapest,
    highestBuy,
    route: bestRouteFromPrices(rows)
  }
}

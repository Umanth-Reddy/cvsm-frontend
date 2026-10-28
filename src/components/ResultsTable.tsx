import { cx } from '../lib/cx'

/** One value copied from the paper's tables (see src/data/evaluation.json). */
export interface EvaluationEntry {
  task: string
  model_variant: string
  metric: string
  value: number
  std: number
  input: string
  /** Typeset in bold in the paper. */
  bold: boolean
  /** Marked with an asterisk in the paper (p < 0.05). */
  significant: boolean
  source: string
}

const unique = <T,>(items: T[], key: (item: T) => string) => {
  const seen = new Set<string>()
  return items.filter((i) => !seen.has(key(i)) && seen.add(key(i)))
}

// The paper's column headers carry an arrow: higher is better for accuracy and F1, lower for the rest.
const arrow = (metric: string) => (/^(Accuracy|Macro-F1)/.test(metric) ? '↑' : '↓')

/** One of the paper's results tables, rebuilt from its entries. All entries share a `source`. */
export function ResultsTable({ entries }: { entries: EvaluationEntry[] }) {
  const columns = unique(entries, (e) => `${e.task}|${e.metric}`)
  const tasks = unique(columns, (c) => c.task).map((t) => ({
    task: t.task,
    span: columns.filter((c) => c.task === t.task).length,
  }))
  const models = unique(entries, (e) => e.model_variant).map((e) => e.model_variant)
  const cell = (model: string, c: EvaluationEntry) =>
    entries.find((e) => e.model_variant === model && e.task === c.task && e.metric === c.metric)

  return (
    <div tabIndex={0} role="region" aria-label={entries[0].source} className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[44rem] border-collapse text-sm tabular-nums">
        <caption className="border-b border-line bg-surface px-4 py-2 text-left text-sm text-muted">{entries[0].source}</caption>
        <thead>
          <tr>
            <th rowSpan={2} scope="col" className="px-4 py-2 text-left font-medium">
              Model
            </th>
            {tasks.map((t) => (
              <th key={t.task} colSpan={t.span} scope="colgroup" className="border-l border-line px-3 py-2 text-center font-medium">
                {t.task}
              </th>
            ))}
          </tr>
          <tr className="border-b border-line">
            {columns.map((c, i) => (
              <th
                key={i}
                scope="col"
                className={cx('px-3 py-2 text-center font-normal text-muted', (i === 0 || columns[i - 1].task !== c.task) && 'border-l border-line')}
              >
                {c.metric} {arrow(c.metric)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr key={m} className="border-t border-line">
              <th scope="row" className="px-4 py-2 text-left font-medium">
                {m}
              </th>
              {columns.map((c, i) => {
                const e = cell(m, c)
                return (
                  <td
                    key={i}
                    className={cx('px-3 py-2 text-center', e?.bold && 'font-bold', (i === 0 || columns[i - 1].task !== c.task) && 'border-l border-line')}
                  >
                    {e ? `${e.value.toFixed(2)} ± ${e.std.toFixed(2)}${e.significant ? '*' : ''}` : '–'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

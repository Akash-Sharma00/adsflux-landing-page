/** Renders a quote, setting the `emphasis` phrase (if present) in serif italic. */
export function QuoteText({ quote, emphasis }: { quote: string; emphasis?: string }) {
  if (!emphasis || !quote.includes(emphasis)) return <>{quote}</>
  const [before, after] = quote.split(emphasis)
  return (
    <>
      {before}
      <em>{emphasis}</em>
      {after}
    </>
  )
}

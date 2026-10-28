import { Button } from '../components/ui/Button'
import { PageIntro } from '../components/ui/PageIntro'

export default function NotFound() {
  return (
    <PageIntro eyebrow="404" title="This page doesn't exist." lead="The address may be mistyped or the page may have moved.">
      <Button to="/">Back to Home</Button>
    </PageIntro>
  )
}

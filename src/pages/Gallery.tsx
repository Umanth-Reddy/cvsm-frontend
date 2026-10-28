import { AudioPlayer } from '../components/ui/AudioPlayer'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { PageIntro } from '../components/ui/PageIntro'

const clips = [
  { label: 'First excerpt', file: 'singin-in-the-rain-a.mp3' },
  { label: 'Second excerpt', file: 'singin-in-the-rain-b.mp3' },
]

export default function Gallery() {
  return (
    <>
      <PageIntro
        eyebrow="Demo audio"
        title="Hear the demo pair."
        lead="Two vocal excerpts from one performance. Listen here, then send them to the models from the Compare page."
      />
      <div className="container-page">
        <div className="grid gap-4 md:grid-cols-2">
          {clips.map((clip) => (
            <Card key={clip.file}>
              <p className="eyebrow">{clip.label}</p>
              <p className="mt-3 font-medium">Singin’ in the Rain</p>
              <AudioPlayer src={`${import.meta.env.BASE_URL}demo/${clip.file}`} label={clip.label} />
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">
          Performed by <a className="underline underline-offset-4" href="https://commons.wikimedia.org/wiki/File:Singin%27_in_the_Rain.mp3">Cary Bass-Deschenes</a>. Cropped and converted to mono from a recording licensed <a className="underline underline-offset-4" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
        </p>
        <div className="mt-6"><Button to="/compare">Compare the demo pair</Button></div>
      </div>
    </>
  )
}

import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { SkipLink } from './components/ui/SkipLink'

function PlaceholderSection({
  id,
  title,
  body,
}: {
  id: string
  title: string
  body: string
}) {
  return (
    <section id={id} className="section">
      <div className="page">
        <h2>{title}</h2>
        <p className="measure">{body}</p>
      </div>
    </section>
  )
}

function App() {
  return (
    <div id="top">
      <SkipLink />
      <Header />

      <main id="main">
        <section className="section" aria-labelledby="hero-title">
          <div className="page">
            <h1 id="hero-title">Adrian Medina</h1>
            <p className="measure">I build systems that feel alive.</p>
            <p className="measure">
              CS student, interface builder, and the maker of SkySprout.
            </p>
          </div>
        </section>

        <PlaceholderSection
          id="work"
          title="SkySprout"
          body="A floating garden that grows while you’re away."
        />
        <PlaceholderSection
          id="iahbrary"
          title="Iahbrary"
          body="A reading tracker that treats reading like training."
        />
        <PlaceholderSection
          id="other-work"
          title="More work"
          body="HealthyaSat and Magilas Gym."
        />
        <PlaceholderSection
          id="about"
          title="About"
          body="Computer Science student at Pampanga State University."
        />
        <PlaceholderSection
          id="contact"
          title="Contact"
          body="The fastest way to reach me is email."
        />
      </main>

      <Footer />
    </div>
  )
}

export default App

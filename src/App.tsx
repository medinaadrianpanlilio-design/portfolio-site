import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Hero } from './components/hero/Hero'
import { IahbraryCaseStudy } from './components/sections/IahbraryCaseStudy'
import { OtherWork } from './components/sections/OtherWork'
import { SkySproutCaseStudy } from './components/sections/SkySproutCaseStudy'
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
        <Hero />

        <SkySproutCaseStudy />

        <IahbraryCaseStudy />

        <OtherWork />

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

import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Hero } from './components/hero/Hero'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { IahbraryCaseStudy } from './components/sections/IahbraryCaseStudy'
import { OtherWork } from './components/sections/OtherWork'
import { SkySproutCaseStudy } from './components/sections/SkySproutCaseStudy'
import { SkipLink } from './components/ui/SkipLink'

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

        <About />

        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App

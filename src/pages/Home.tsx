import { Header } from '@/sections/Header'
import { Hero } from '@/sections/Hero'
import { Ticker } from '@/sections/Ticker'
import { FlightBoard } from '@/sections/FlightBoard'
import { AirportMap } from '@/sections/AirportMap'
import { Parking } from '@/sections/Parking'
import { Transportation } from '@/sections/Transportation'
import { TerminalGuide } from '@/sections/TerminalGuide'
import { Facilities } from '@/sections/Facilities'
import { TravelGuide } from '@/sections/TravelGuide'
import { Services } from '@/sections/Services'
import { Faq } from '@/sections/Faq'
import { Footer } from '@/sections/Footer'
import { Chatbot } from '@/components/Chatbot'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a121c] text-white">
        <Header />
        <main>
          <Hero />
          <Ticker />
          <FlightBoard />
          <AirportMap />
          <Parking />
          <Transportation />
          <TerminalGuide />
          <Facilities />
          <TravelGuide />
          <Services />
          <Faq />
        </main>
        <Footer />
        <Chatbot />
    </div>
  )
}

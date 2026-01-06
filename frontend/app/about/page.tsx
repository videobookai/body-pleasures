import { AboutSection } from '@/components/about-section'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import React from 'react'

const AboutPage = () => {
  return (
    <div className='flex flex-col gap-2'>
    <Navigation/>
    <AboutSection/>
    <Footer/>
    </div>
  )
}

export default AboutPage
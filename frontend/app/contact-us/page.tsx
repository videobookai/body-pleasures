import { ContactSection } from '@/components/contact-section'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'


const ContactPage = () => {
  return (
    <div className='flex flex-col gap-2'>
        <Navigation/>
        <ContactSection/>
        <Footer/>
    </div>
  )
}

export default ContactPage
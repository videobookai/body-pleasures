import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
const MarketsPage = () => {
  return (
    <div className='flex flex-col gap-2 '>
        <Navigation/>
        <main className='h-full w-full min-h-screen bg-white flex justify-center font-sans text-black'>
          <p className='block p-4 text-center text-black'>Markets Go here</p>
        </main>
       
        <Footer/>

    </div>
  )
}

export default MarketsPage
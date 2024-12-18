import { getBlogById } from '@/lib/supabase'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from 'react-markdown'


async function Blog({ params }: { params: { id: string } }) {
  const { content, imageUrl } = await getBlogById(Number(params.id))
  return (
    <section className='py-12 items-center'>
      <div className='container mx-96 max-w-3xl'>
        <Link
          href='/'
          className=' inline-flex items-center text-sm font-light text-gray-500 no-underline hover:text-gray-700'
        >
          <ChevronLeft strokeWidth={1} size={20} />
          <span>Go back</span>
        </Link>
        <section className=''>
          <Image alt='' src={imageUrl} width={1792} height={1024} />
          <Markdown>{content}</Markdown>
        </section>
      </div>
    </section>
  )
}
export default Blog
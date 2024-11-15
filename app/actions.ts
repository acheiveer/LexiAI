'use server'

import OpenAI from "openai"
import { supabase } from "@/lib/supabase"
import { decode } from 'base64-arraybuffer'
import { redirect } from 'next/navigation'
import dotenv from "dotenv";
dotenv.config();


const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})

export async function createCompletion(prompt : string) {
    if(!prompt){
        return {error: "Prompt is required."}
    }


const messages: any= [
    {
        role: 'user',
        content: `Write a blog post around 400 words about the following topic: "${prompt}" in markdown format.`
    }
]

const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages
  })

const content = completion?.choices?.[0]?.message?.content ;

if(!content){
    return {error: "Unable to generate the blog content."}
}

const image = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `Generate an image for a blog post about "${prompt}"`,
    n: 1,
    size: '1792x1024',
    response_format: 'b64_json'
})

const imageName = `blog-${Date.now()}`;
const imageData = image?.data?.[0].b64_json as string;

if (!imageData) {
    return { error: 'Unable to generate the blog image.' }
}

const { data, error } = await supabase.storage
    .from('ai-blog-images')
    .upload(imageName, decode(imageData), { contentType: 'image/png' })


if (error) {
  return { error: 'Unable to upload the blog image to Storage.' }
}

const path = data?.path
const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/ai-blog-images/${path}`

const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .insert([{ title: prompt, content, imageUrl, userId: '123' }])
    .select()
    
  if (blogError) {
    return { error: 'Unable to insert the blog into the database.' }
  }


  const blogId = blog?.[0]?.id

  redirect(`/blog/${blogId}`)
}
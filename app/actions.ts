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


// const messages: any= [
//     {
//         role: 'user',
//         content: `Write a blog post around 400 words about the following topic: "${prompt}" in markdown format.`
//     }
// ]

// const completion = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages
//   })

// const content = completion?.choices?.[0]?.message?.content ;
// Mock content for the blog
const content = `This is a mock blog post for the topic: "${prompt}"`;

if(!content){
    return {error: "Unable to generate the blog content."}
}

// const image = await openai.images.generate({
//     model: 'dall-e-3',
//     prompt: `Generate an image for a blog post about "${prompt}"`,
//     n: 1,
//     size: '1792x1024',
//     response_format: 'b64_json'
// })

const imageName = `blog-${Date.now()}`;
// const imageData = image?.data?.[0].b64_json as string;
const mockBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAAUA" +
                            "AAAFCAYAAACNbyblAAAAHElEQVQI12P4" +
                            "//8/w38GIAXDIBKE0DHxgljNBAAO9TXL" +
                            "0Y4OHwAAAABJRU5ErkJggg==";

    const imageData = mockBase64Image;

    if (!imageData) {
        return { error: 'Unable to generate the blog image.' }
    }

    // Decode the valid base64 image data
    const decodedImage = decode(imageData);

    const { data, error } = await supabase.storage
        .from('ai-blog-images')
        .upload(imageName, decodedImage, { contentType: 'image/png' })


if (error) {
  return { error: 'Unable to upload the blog image to Storage.' }
}

const path = data?.path
const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/ai-blog-images/${path}`
console.log("Image URL:", imageUrl);

const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .insert([{ title: prompt, content, imageUrl, userId: '123' }])
    .select();
    
    if (blogError) {
      console.error(blogError);
      return { error: 'Unable to insert the blog into the database.' }
  }


  const blogId = blog?.[0]?.id

  redirect(`/blog/${blogId}`)
}
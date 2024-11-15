import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv";
dotenv.config();


const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_KEY as string
export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getBlogById(id: number) {
  const { data, error } = await supabase
    .from('blogs')
    .select()
    .eq('id', id)
    .single()
  if (error) {
    console.error("Error fetching blog by ID:", error)
    return null
  }
  return data
}

export async function getAllBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select()
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching all blogs:", error)
    return null
  }
  return data
}

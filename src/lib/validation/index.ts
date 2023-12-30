import * as z from "zod"

export const postFormSchema = z.object({
    caption: z.string().min(2).max(2200),
    file:z.custom<File[]>(),
    location:z.string().min(2).max(100),
    tags:z.string(),
  })
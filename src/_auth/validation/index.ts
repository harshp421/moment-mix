import * as z from "zod"
 
export  const SignInSchema = z.object({
  email: z.string().min(2).max(50),
  password:z.string().min(6)
})

export  const SignUpSchema = z.object({
  name:z.string().min(2,{message:"Name is Too Short"}),
  userName:z.string().min(2,{message:"userName is Too Short"}),
  email: z.string().min(2).max(50),
  password:z.string().min(6,{message:"PassWord Must Be at Least 8 Characters"})
})
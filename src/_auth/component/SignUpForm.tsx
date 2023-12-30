import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { SignUpSchema } from "../validation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccountMutation, useSignInAccountMutation } from "@/lib/react-query/queriesAndMutations"
import { useUserContect } from "@/context/AuthContext"



const SignUpForm = () => {

  const { toast } = useToast();
  const {checkAuthUser,isLoading:isUserLoading}=useUserContect();
  const navigate=useNavigate();
 
  //react-query 
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccountMutation();
  const { mutateAsync: signInAccount} = useSignInAccountMutation();

  //define a form
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      userName: "",
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpSchema>) {

    const newUser = await createUserAccount(values);
    if (!newUser) {
      return toast({ title: "Sign in faild,Please try again" })
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (!session) {
      return toast({ title: "Sign in faild,Please try again" })
    }
   const isLoggedIn=await checkAuthUser();
   if(isLoggedIn)
   {
    form.reset();
    navigate('/')
   }
   else{
    toast({ title: "Sign in faild,Please try again" })
   }
  }

  return (
    <div>
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/icons/logo_white.png" alt="logo" />
          <h2 className="h3-bold md:h2-bold">Create a new Account</h2>
          <p className="text-light-3 small-medium md:base-reguler mt-2">To Your MomentMix,Please Enter Your Details</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Name "  {...field} className="shad-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your UserName " {...field} className="shad-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="abx@gmail.com" {...field} className="shad-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} className="shad-input" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="shad-button_primary">
              {
                isCreatingUser ? (<div className="flex-center gap-2">
                  <Loader />Loading...
                </div>) : "Sign Up"
              }
            </Button>
            <p className="text-small-reguler text-light-2 text-center">Already Have a Account ?
              <Link to='/sign-in' className="text-primary-500 text-small-semibold ml-1">Log in</Link></p>
          </form>
        </div>
      </Form>
    </div>
  )
}

export default SignUpForm
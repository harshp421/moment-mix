import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { SignInSchema } from "../validation"
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
import { useSignInAccountMutation } from "@/lib/react-query/queriesAndMutations"
import { useUserContect } from "@/context/AuthContext"



const SignInForm = () => {

  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContect();
  const navigate = useNavigate();

  //react-query 
  const { mutateAsync: signInAccount, isPending: isUsersignIn } = useSignInAccountMutation();

  //define a form
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInSchema>) {


    const session = await signInAccount({
      email: values.email,
      password: values.password
    })



    if (!session) {
      return toast({ title: "Sign in faild,Please try again" })
    }
    const isLoggedIn = await checkAuthUser();
    console.log(isLoggedIn, "login");
    if (isLoggedIn) {
      form.reset();
      navigate('/')
    }
    else {
      toast({ title: "Sign in faild,Please try again" })
    }
  }

  return (
    <div>
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/icons/logo_white.png" alt="logo" />
          <h2 className="h3-bold md:h2-bold">Log in to your Account</h2>
          <p className="text-light-3 small-medium md:base-reguler mt-2">Welcome Back! Please enter your details</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

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
                isUsersignIn ? (<div className="flex-center gap-2">
                  <Loader />Loading...
                </div>) : "Sign In"
              }
            </Button>
            <p className="text-small-reguler text-light-2 text-center">Don't Have a Account ?
              <Link to='/sign-up' className="text-primary-500 text-small-semibold ml-1">Sign up</Link></p>
          </form>
        </div>
      </Form>
    </div>
  )
}

export default SignInForm
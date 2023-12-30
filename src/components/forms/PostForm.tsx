
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploder from "../shared/FileUploder"
import { Models } from "appwrite"
import { postFormSchema } from "@/lib/validation"
import { useCratePostMutation, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { useUserContect } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"


type postformProp = {
  post?: Models.Document;
  action:'Create' | 'Update'
}
const PostForm = ({ post,action }: postformProp) => {

  const {mutateAsync: createPost,isPending:isLoadingCreate}=useCratePostMutation();
  const {mutateAsync:updatePost,isPending:isLoadingUpdate}=useUpdatePost();
  const {user}=useUserContect();
  const {toast}=useToast();
const navigate=useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(',') : ""
    },
  })

  // 2. Define a submit handler.
 async function onSubmit(values: z.infer<typeof postFormSchema>) {

  if(post && action==='Update')
{
  const updatedPost=await updatePost({
    ...values,
    postId:post?.$id,
    imageId:post?.imageId,
    imageUrl:post?.imaageUrl,
  })
  if(!updatedPost)
  {
    toast({title:"please try Again betz"})
  }
  navigate(`/posts/${post.$id}`)
}
else{
  
    const newPost =await createPost({
      ...values,
      userId:user.id,
    })
    if(!newPost)
    {
      toast({
        title:"Please Try again"
      })
    }
    navigate('/')
    console.log(values)
  }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption </FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scroll" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos </FormLabel>
              <FormControl>
                <FileUploder fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type='text' className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (sepreted by comma ",") </FormLabel>
              <FormControl>
                <Input placeholder="art,expression,learn" type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">Cancle</Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate}>
            {isLoadingCreate || isLoadingUpdate && 'loading...'}
             {action} Post
            </Button>
        </div>

      </form>
    </Form>
  )
}

export default PostForm
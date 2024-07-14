"use client"
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from 'axios';

const formSchema = z.object({
  username: z.string()
    .min(8, { message: "Username must be at least 8 characters long." })
    .max(20, { message: "Username must not exceed 20 characters." })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username must not contain any special characters or spaces." }),
  
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?& ,]+$/, { message: "Password must contain at least one number and one uppercase letter." })
    .refine((value) => {
      if (value.startsWith(' ') || value.endsWith(' ')) {
        return false;
      }
      for (let i = 0; i < value.length - 1; i++) {
        if (i < value.length - 2) {
          if (value.charCodeAt(i) === value.charCodeAt(i + 1) && value.charCodeAt(i + 1) === value.charCodeAt(i + 2)) {
            return false; // Repeated characters found
          }
        }
        if (i < value.length - 2) {
          if (value.charCodeAt(i) + 1 === value.charCodeAt(i + 1) && value.charCodeAt(i + 1) + 1 === value.charCodeAt(i + 2)) {
            return false; // Sequential characters found
          }
        }
        if (i < value.length - 2) {
          if (value.charCodeAt(i) - 1 === value.charCodeAt(i + 1) && value.charCodeAt(i + 1) - 1 === value.charCodeAt(i + 2)) {
            return false; // Sequential characters found
          }
        }
      }
      return true;
    }, { message: "Password must not contain sequences or repeated characters." }),

  confirmPassword: z.string()
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match. Please try again",
  path: ["confirmPassword"], // Set the path to show error under confirmPassword field
});

const Useridpass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (isClient) {
      try {
        const response = await axios.post('http://localhost:8000/api/application/login/loginUser', {
          username: data.username,
          password: data.password,
        });
        console.log(response.data);
        setErrorMessage('');
        window.alert("Form submitted successfully!");
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setErrorMessage('Username already exists. Please use a different username.');
        } else {
          console.error('Error signing up:', error);
          setErrorMessage('An error occurred during sign up. Please try again.');
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center">
      <div className="bg-white p-8 shadow-2xl rounded-lg w-full max-w-6xl">
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormDescription className='text-bold text-3xl flex justify-center mb-8'>
                Create your login details
                <br/>
                Keep your details safe-you&apos;ll need them later
            </FormDescription>
            <hr className="mb-8" />
            <FormField 
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                    <div className="flex justify-between flex-row">
                        <div>
                            <FormLabel>Username*</FormLabel>
                            <FormControl>
                                <Input className='bg-white' placeholder="Enter username.." {...field} />
                            </FormControl>
                            <FormMessage />
                        </div>
                        <FormDescription className='text-base'>
                            Must not contain any special characters or spaces.
                            <br/>
                            Must be at least 8 characters long, but no longer than 20.
                        </FormDescription>
                    </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                    <div className="flex justify-between flex-row">
                        <div>
                            <FormLabel>Password*</FormLabel>
                            <FormControl>
                                <div className="flex">
                                  <Input 
                                    className='bg-white'
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter password.." 
                                    {...field} 
                                  />
                                  <Button
                                    size='lg'
                                    className="ml-2 px-4 py-6 border rounded"
                                    onClick={togglePasswordVisibility}
                                  >
                                    {showPassword ? "Hide" : "Show"}
                                  </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </div>
                        <FormDescription className='text-base mr-2'>
                            Must be at least 8 characters long.
                            <br/>
                            Contain at least 1 number and 1 UPPER case letter.
                            <br/>
                            Shouldn&apos;t contain any sequences or repeated characters
                            <br/>such as 1234, 3333, ZZZZ, etc.
                        </FormDescription>
                    </div>
                  
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                    <div className="flex justify-between flex-row">
                        <div>
                            <FormLabel>Confirm Password*</FormLabel>
                            <FormControl>
                                <div className="flex">
                                  <Input 
                                    className='bg-white'
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="Confirm password.." 
                                    {...field} 
                                  />
                                  <Button
                                    size='lg'
                                    className="ml-2 px-4 py-6 border rounded"
                                    onClick={toggleConfirmPasswordVisibility}
                                  >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                  </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </div>
                    </div>
                  
                </FormItem>
              )}
            />
            {errorMessage && <div className="text-red-600 text-center mt-4">{errorMessage}</div>}
            <div className="flex justify-center">
                <Button type="submit" size='lg'>Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Useridpass;

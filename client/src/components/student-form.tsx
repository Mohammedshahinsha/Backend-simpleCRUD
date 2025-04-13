import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertStudentSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Extended schema with validation
const studentFormSchema = insertStudentSchema.extend({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  rollNumber: z.string().min(2, {
    message: "Roll number must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  mobile: z.string().min(10, {
    message: "Mobile number must be at least 10 digits.",
  }),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  defaultValues?: StudentFormValues;
  onSubmit: (values: StudentFormValues) => void;
  submitLabel?: string;
  studentId?: string;
  isDark?: boolean;
}

export function StudentForm({
  defaultValues = {
    name: "",
    rollNumber: "",
    email: "",
    mobile: "",
  },
  onSubmit,
  submitLabel = "Send Request",
  studentId,
  isDark = false,
}: StudentFormProps) {
  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues,
  });

  const handleSubmit = async (values: StudentFormValues) => {
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const inputClass = isDark
    ? "w-full px-3 py-2 border border-gray-700 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
    : "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

  const labelClass = isDark
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-gray-700 mb-1";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {studentId !== undefined && (
          <div>
            <label className={labelClass}>Student ID</label>
            <Input
              className={inputClass}
              value={studentId}
              disabled
              placeholder="Student ID"
            />
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Name</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  placeholder="Enter student name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rollNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Roll Number</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  placeholder="Enter roll number"
                  {...field}
                />
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
              <FormLabel className={labelClass}>Email</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  type="email"
                  placeholder="Enter email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Mobile</FormLabel>
              <FormControl>
                <Input
                  className={inputClass}
                  placeholder="Enter mobile number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={
            isDark
              ? "w-full px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              : "w-full px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }
        >
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}

export default StudentForm;

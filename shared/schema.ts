import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rollNumber: text("rollNumber").notNull().unique(),
  email: text("email").notNull().unique(),
  mobile: text("mobile").notNull(),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  name: true,
  rollNumber: true,
  email: true,
  mobile: true,
});

export const updateStudentSchema = createInsertSchema(students).pick({
  name: true,
  rollNumber: true,
  email: true,
  mobile: true,
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type UpdateStudent = z.infer<typeof updateStudentSchema>;
export type Student = typeof students.$inferSelect;

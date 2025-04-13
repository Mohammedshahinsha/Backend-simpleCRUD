import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, updateStudentSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prefix all routes with /api
  
  // GET all students
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.status(200).json({
        success: true,
        message: "Students retrieved successfully",
        data: students
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to retrieve students"
      });
    }
  });

  // GET student by ID
  app.get("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID format"
        });
      }
      
      const student = await storage.getStudent(id);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }
      
      res.status(200).json({
        success: true,
        message: "Student retrieved successfully",
        data: student
      });
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to retrieve student"
      });
    }
  });

  // POST create new student
  app.post("/api/students", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertStudentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({
          success: false,
          message: validationError.message
        });
      }
      
      const student = validationResult.data;
      
      // Check if student with same roll number already exists
      const existingStudent = await storage.getStudentByRollNumber(student.rollNumber);
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: `Student with roll number ${student.rollNumber} already exists`
        });
      }
      
      // Check if student with same email already exists
      const existingStudentByEmail = await storage.getStudentByEmail(student.email);
      if (existingStudentByEmail) {
        return res.status(409).json({
          success: false,
          message: `Student with email ${student.email} already exists`
        });
      }
      
      const newStudent = await storage.createStudent(student);
      
      res.status(201).json({
        success: true,
        message: "Student added successfully",
        data: newStudent
      });
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to create student"
      });
    }
  });

  // PUT update student
  app.put("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID format"
        });
      }
      
      // Validate request body
      const validationResult = updateStudentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({
          success: false,
          message: validationError.message
        });
      }
      
      const student = validationResult.data;
      
      // Check if student exists
      const existingStudent = await storage.getStudent(id);
      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }
      
      // Check if roll number is already used by another student
      const studentWithRollNumber = await storage.getStudentByRollNumber(student.rollNumber);
      if (studentWithRollNumber && studentWithRollNumber.id !== id) {
        return res.status(409).json({
          success: false,
          message: `Roll number ${student.rollNumber} is already assigned to another student`
        });
      }
      
      // Check if email is already used by another student
      const studentWithEmail = await storage.getStudentByEmail(student.email);
      if (studentWithEmail && studentWithEmail.id !== id) {
        return res.status(409).json({
          success: false,
          message: `Email ${student.email} is already assigned to another student`
        });
      }
      
      const updatedStudent = await storage.updateStudent(id, student);
      
      res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: updatedStudent
      });
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to update student"
      });
    }
  });

  // DELETE student
  app.delete("/api/students/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID format"
        });
      }
      
      // Check if student exists
      const existingStudent = await storage.getStudent(id);
      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }
      
      await storage.deleteStudent(id);
      
      res.status(200).json({
        success: true,
        message: "Student deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete student"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

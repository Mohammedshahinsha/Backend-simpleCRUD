import { insertStudentSchema, updateStudentSchema, type Student, type InsertStudent } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need for the student management system
export interface IStorage {
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByRollNumber(rollNumber: string): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  getAllStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: InsertStudent): Promise<Student>;
  deleteStudent(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private students: Map<number, Student>;
  private currentId: number;

  constructor() {
    this.students = new Map();
    this.currentId = 1;
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByRollNumber(rollNumber: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.rollNumber === rollNumber,
    );
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.email === email,
    );
  }

  async getAllStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentId++;
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: number, updateStudent: InsertStudent): Promise<Student> {
    const student = this.students.get(id);
    
    if (!student) {
      throw new Error(`Student with id ${id} not found`);
    }
    
    const updatedStudent: Student = { ...updateStudent, id };
    this.students.set(id, updatedStudent);
    
    return updatedStudent;
  }

  async deleteStudent(id: number): Promise<void> {
    const exists = this.students.has(id);
    
    if (!exists) {
      throw new Error(`Student with id ${id} not found`);
    }
    
    this.students.delete(id);
  }
}

// Initialize storage with some sample data
export const storage = new MemStorage();

// Add some sample data
const initializeWithSampleData = async () => {
  try {
    // Check if we already have data
    const students = await storage.getAllStudents();
    if (students.length === 0) {
      // Add sample students
      await storage.createStudent({
        name: "John Doe",
        rollNumber: "R1001",
        email: "john.doe@example.com",
        mobile: "1234567890"
      });
      
      await storage.createStudent({
        name: "Jane Smith",
        rollNumber: "R1002",
        email: "jane.smith@example.com",
        mobile: "9876543210"
      });
      
      await storage.createStudent({
        name: "Alex Johnson",
        rollNumber: "R1003",
        email: "alex.johnson@example.com",
        mobile: "5554443333"
      });
    }
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
};

// Initialize sample data
initializeWithSampleData();

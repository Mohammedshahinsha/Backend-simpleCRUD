import React from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  content: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content, className }) => {
  return (
    <div className={cn("bg-gray-900 rounded-md p-3 font-mono text-sm", className)}>
      <pre className="whitespace-pre-wrap">{content}</pre>
    </div>
  );
};

export default CodeBlock;

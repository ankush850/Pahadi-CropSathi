"use client";

import { CornerRightUp, Mic } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";

interface AIInputProps {
  id?: string
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  onSubmit?: (value: string) => void
  className?: string
}

export function AIInput({
  id = "ai-input",
  placeholder = "Type your message...",
  minHeight = 52,
  maxHeight = 200,
  onSubmit,
  className
}: AIInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  const [inputValue, setInputValue] = useState("");

  const handleReset = () => {
    if (!inputValue.trim()) return;
    onSubmit?.(inputValue);
    setInputValue("");
    adjustHeight(true);
  };

  return (
    <div className={cn("w-full py-2", className)}>
      <div className="relative w-full">
        <Textarea
          id={id}
          placeholder={placeholder}
          className={cn(
            "w-full bg-cement-50 rounded-2xl pl-4 pr-12 shadow-sm",
            "placeholder:text-cement-400 text-sm",
            "border border-cement-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/30",
            "text-cement-800 text-wrap",
            "overflow-y-auto resize-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "transition-all duration-200 ease-out",
            "leading-[1.3] py-2",
            `min-h-[${minHeight}px]`,
            `max-h-[${maxHeight}px]`,
            "[&::-webkit-resizer]:hidden"
          )}
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleReset();
            }
          }}
        />

        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 rounded-lg bg-cement-100 p-1.5 transition-all duration-200",
            inputValue ? "right-11" : "right-3"
          )}
        >
          <Mic className="w-3.5 h-3.5 text-cement-500" />
        </div>
       <button
  onClick={handleReset}
  type="button"
  className={cn(
    "absolute top-1/2 -translate-y-1/2 right-2",
    "rounded-lg bg-green-600 hover:bg-green-700 p-1.5 shadow-sm",
    "transition-all duration-200 hover:shadow-md",
    inputValue 
      ? "opacity-100 scale-100" 
      : "opacity-0 scale-95 pointer-events-none"
  )}
>
  <CornerRightUp className="w-3.5 h-3.5 text-white" />
</button>
      </div>
    </div>
  );
}
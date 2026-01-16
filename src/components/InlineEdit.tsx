"use client";

import * as React from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { Pencil } from "lucide-react"; // Optional icon

interface InlineEditProps {
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  pencilIcon?: boolean;
  onSave?: (value: string) => void;
  className?: string;
}

export function InlineEdit({
  defaultValue = "Default text",
  placeholder = "Click to edit",
  required = false,
  pencilIcon = true,
  onSave,
  className,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus the input automatically when switching to edit mode
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onSave?.(value);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setValue(defaultValue); // Revert on escape
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onSave?.(value);
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn("h-9", className)}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "group hover:border-input border-foreground/60 flex cursor-pointer items-center gap-2 border-b",
        !value && "text-muted-foreground", // Style for empty/placeholder state
        className,
      )}
    >
      {value || placeholder}
      {/* Optional: Show a pencil icon on hover to hint interactivity */}
      {required && <span className="-ml-2 text-red-500">*</span>}
      {pencilIcon && <Pencil className="h-4 w-4" />}
    </div>
  );
}

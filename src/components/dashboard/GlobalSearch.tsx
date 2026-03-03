import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen } from "lucide-react";
import { COURSES_ORDERED } from "@/lib/courseCatalog";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleCourseSelect = (courseCode: string) => {
    setOpen(false);
    navigate(`/dashboard/course/${courseCode.toLowerCase()}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm text-muted-foreground sm:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search courses...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search courses..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Courses">
            {COURSES_ORDERED.map((course) => (
              <CommandItem
                key={course.code}
                value={`${course.code} ${course.title}`}
                onSelect={() => handleCourseSelect(course.code)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{course.title}</span>
                  <span className="text-xs text-muted-foreground">{course.code}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

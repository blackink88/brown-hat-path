import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen, FileText, Layers } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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

  const { data: courses } = useQuery({
    queryKey: ["search-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, code, title, description")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: modules } = useQuery({
    queryKey: ["search-modules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("id, title, course_id, courses(code)")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons } = useQuery({
    queryKey: ["search-lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("id, title, module_id, modules(course_id, courses(code))")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const handleCourseSelect = (courseCode: string) => {
    setOpen(false);
    navigate(`/dashboard/course/${courseCode.toLowerCase()}`);
  };

  const handleLessonSelect = (lesson: any) => {
    setOpen(false);
    const courseCode = lesson.modules?.courses?.code?.toLowerCase();
    if (courseCode) {
      navigate(`/dashboard/course/${courseCode}`);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md bg-muted/50 text-sm text-muted-foreground sm:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search courses, lessons...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search courses, modules, lessons..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {courses && courses.length > 0 && (
            <CommandGroup heading="Courses">
              {courses.map((course) => (
                <CommandItem
                  key={course.id}
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
          )}

          {modules && modules.length > 0 && (
            <CommandGroup heading="Modules">
              {modules.slice(0, 5).map((module) => (
                <CommandItem
                  key={module.id}
                  value={module.title}
                  onSelect={() => {
                    const courseCode = (module.courses as any)?.code?.toLowerCase();
                    if (courseCode) {
                      setOpen(false);
                      navigate(`/dashboard/course/${courseCode}`);
                    }
                  }}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{module.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {(module.courses as any)?.code}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {lessons && lessons.length > 0 && (
            <CommandGroup heading="Lessons">
              {lessons.slice(0, 5).map((lesson) => (
                <CommandItem
                  key={lesson.id}
                  value={lesson.title}
                  onSelect={() => handleLessonSelect(lesson)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{lesson.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {(lesson.modules as any)?.courses?.code}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

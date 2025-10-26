import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContentSection {
  id: string;
  title: string;
  content: string;
}

export const ContentEditor = () => {
  const [sections, setSections] = useState<ContentSection[]>([
    { id: "about", title: "About Section", content: "" },
    { id: "mission", title: "Mission Section", content: "" },
    { id: "synopsis", title: "Synopsis Section", content: "" },
  ]);

  const handleSave = (sectionId: string) => {
    toast.success("Content saved successfully");
  };

  const updateSection = (id: string, content: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, content } : s));
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>Edit the content for this section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, e.target.value)}
              placeholder="Enter section content..."
              rows={6}
            />
            <Button onClick={() => handleSave(section.id)}>
              Save Changes
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

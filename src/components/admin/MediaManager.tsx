import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload } from "lucide-react";

interface MediaManagerProps {
  type: string;
  title: string;
  acceptedTypes: string;
  multiple?: boolean;
}

export const MediaManager = ({ type, title, acceptedTypes, multiple = false }: MediaManagerProps) => {
  const [media, setMedia] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const { toast } = useToast();
  const isVideoUrl = type === "latest_video" || type === "behind_scenes_video";

  useEffect(() => {
    loadMedia();

    // Subscribe to real-time updates for this media type
    const channel = supabase
      .channel(`media-${type}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'media',
          filter: `type=eq.${type}`
        },
        () => {
          loadMedia();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [type]);

  const loadMedia = async () => {
    const { data } = await supabase
      .from("media")
      .select("*")
      .eq("type", type as any)
      .order("created_at", { ascending: false });
    
    if (data) setMedia(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${type}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("media")
          .getPublicUrl(filePath);

        await supabase.from("media").insert({
          type: type as any,
          url: publicUrl,
          caption: caption || null,
          file_name: file.name,
          mime_type: file.type,
          file_size: file.size,
        });
      }

      toast({ title: "Upload successful!" });
      loadMedia();
      setCaption("");
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddVideoUrl = async () => {
    if (!videoUrl) {
      toast({
        title: "Error",
        description: "Please enter a video URL",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      await supabase.from("media").insert({
        type: type as any,
        url: videoUrl,
        caption: caption || null,
        file_name: `${type}_${Date.now()}`,
        mime_type: "text/url",
        file_size: 0,
      });

      toast({ title: "Video URL added successfully!" });
      loadMedia();
      setCaption("");
      setVideoUrl("");
    } catch (error: any) {
      toast({
        title: "Failed to add URL",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    try {
      // Only attempt to delete from storage if it's an actual uploaded file
      if (!url.includes("/media/") && (type === "latest_video" || type === "behind_scenes_video")) {
        // Just delete from database for URL entries
        await supabase.from("media").delete().eq("id", id);
      } else {
        // Delete from storage and database for uploaded files
        const path = url.split("/media/")[1];
        await supabase.storage.from("media").remove([path]);
        await supabase.from("media").delete().eq("id", id);
      }
      
      toast({ title: "Deleted successfully" });
      loadMedia();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="caption">Caption (optional)</Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter caption..."
              className="mt-1"
            />
          </div>

          {isVideoUrl ? (
            <>
              <div>
                <Label htmlFor="video-url">YouTube Video URL</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste YouTube video URL here..."
                  className="mt-1"
                />
              </div>
              <Button
                onClick={handleAddVideoUrl}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? "Adding..." : "Add Video URL"}
              </Button>
            </>
          ) : (
            <div>
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                accept={acceptedTypes}
                multiple={multiple}
                onChange={handleUpload}
                disabled={uploading}
                className="mt-1"
              />
            </div>
          )}

          {uploading && <p className="text-sm text-muted-foreground">{isVideoUrl ? "Adding..." : "Uploading..."}</p>}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.map((item) => (
          <Card key={item.id} className="p-4">
            {item.mime_type?.startsWith("image/") && (
              <img src={item.url} alt={item.caption || ""} className="w-full h-48 object-cover rounded mb-2" />
            )}
            {item.mime_type?.startsWith("video/") && (
              <video src={item.url} controls className="w-full h-48 rounded mb-2" />
            )}
            {item.mime_type === "text/url" && (
              <div className="w-full h-48 bg-muted rounded mb-2 flex items-center justify-center p-4">
                <p className="text-sm text-muted-foreground break-all">{item.url}</p>
              </div>
            )}
            
            <p className="text-sm font-medium text-foreground mb-1">{item.file_name}</p>
            {item.caption && <p className="text-sm text-muted-foreground mb-2">{item.caption}</p>}
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(item.id, item.url)}
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </Card>
        ))}
      </div>

      {media.length === 0 && (
        <Card className="p-12 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No media uploaded yet</p>
        </Card>
      )}
    </div>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Dropzone from "../components/studio/Dropzone";
import ContentKitEditor from "../components/studio/ContentKitEditor";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { createPost, deletePost } from "../api/posts";
import { getErrorMessage } from "../api/client";
import styles from "./Studio.module.css";

export default function Studio() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [post, setPost] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setPost(null);
  };

  const handleGenerate = async () => {
    if (!file) {
      toast.error("Choose an image to develop first.");
      return;
    }
    setGenerating(true);
    try {
      const res = await createPost(file);
      setPost(res.post);
      toast.success("Content kit developed.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't generate content from that image."));
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(post._id);
      toast.success("Content kit deleted.");
      setPost(null);
      setFile(null);
      setPreview(null);
      setConfirmOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete this content kit."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Studio"
        title="Develop one upload into a full release"
        description="Drop in a photo and the studio reads it back as a caption, hashtags, a mood, a story, a reel script, a viral hook, and the AI prompt behind it."
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate("/posts")} iconRight={<ArrowRight size={14} />}>
            View all content kits
          </Button>
        }
      />

      {!post ? (
        <Card className={styles.uploadCard}>
          <Dropzone onFile={handleFile} preview={preview} disabled={generating} />
          <div className={styles.actionsRow}>
            <span className={styles.helper}>
              {file ? file.name : "No image selected yet"}
            </span>
            <Button size="lg" icon={<Wand2 size={16} />} loading={generating} onClick={handleGenerate}>
              Develop content kit
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <ContentKitEditor
            post={post}
            onUpdated={setPost}
            onRequestDelete={() => setConfirmOpen(true)}
          />
          <div className={styles.startOver}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPost(null);
                setFile(null);
                setPreview(null);
              }}
            >
              Start a new upload
            </Button>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this content kit?"
        description="This removes the caption, hashtags, story, and every other generated field. This can't be undone."
      />
    </div>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ContentKitEditor from "../components/studio/ContentKitEditor";
import useAsync from "../hooks/useAsync";
import { getPostById, deletePost } from "../api/posts";
import { getErrorMessage } from "../api/client";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, setData } = useAsync(() => getPostById(id), [id]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(id);
      toast.success("Content kit deleted.");
      navigate("/posts");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete this content kit."));
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Content kit"
        title="Review and edit"
        actions={
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate("/posts")}>
            Back to library
          </Button>
        }
      />

      {loading ? (
        <div style={{ padding: 60, display: "flex", justifyContent: "center" }}>
          <Spinner label="Loading content kit…" />
        </div>
      ) : !data?.post ? (
        <EmptyState title="Content kit not found" description="It may have been deleted." />
      ) : (
        <Card>
          <ContentKitEditor
            post={data.post}
            onUpdated={(post) => setData({ post })}
            onRequestDelete={() => setConfirmOpen(true)}
          />
        </Card>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this content kit?"
        description="This removes every generated field for this post. This can't be undone."
      />
    </div>
  );
}

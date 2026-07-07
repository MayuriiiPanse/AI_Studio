import { useNavigate } from "react-router-dom";
import { GalleryHorizontalEnd, Sparkles } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import useAsync from "../hooks/useAsync";
import { getAllPosts } from "../api/posts";
import styles from "./Posts.module.css";

export default function Posts() {
  const navigate = useNavigate();
  const { data, loading } = useAsync(getAllPosts, []);
  const posts = data?.posts || [];

  return (
    <div>
      <PageHeader
        eyebrow="Studio library"
        title="Content kits"
        description="Every image you've developed into a full release, in one place."
        actions={
          <Button size="sm" icon={<Sparkles size={14} />} onClick={() => navigate("/studio")}>
            New content kit
          </Button>
        }
      />

      {loading ? (
        <div className={styles.loadingRow}>
          <Spinner label="Loading your content kits…" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={<GalleryHorizontalEnd size={22} />}
          title="No content kits yet"
          description="Upload your first photo in the studio and it'll show up here as a full set of captions, hashtags, and scripts."
          action={<Button onClick={() => navigate("/studio")}>Go to studio</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {posts.map((post) => (
            <Card key={post._id} hoverable padded={false} className={styles.card} onClick={() => navigate(`/posts/${post._id}`)}>
              <img src={post.image} alt="" className={styles.thumb} />
              <div className={styles.body}>
                {post.mood && <Badge tone="brass">{post.mood}</Badge>}
                <p className={styles.caption}>{post.caption || "No caption generated yet."}</p>
                <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

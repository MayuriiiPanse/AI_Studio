import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Textarea from "../components/ui/Textarea";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import useAsync from "../hooks/useAsync";
import { getProjectById, addContentToProject } from "../api/projects";
import { getErrorMessage } from "../api/client";
import styles from "./ProjectDetail.module.css";

const TYPES = [
  { id: "linkedin", label: "LinkedIn post" },
  { id: "image-analysis", label: "Image analysis" },
  { id: "caption", label: "Caption" },
  { id: "script", label: "Script" },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, setData } = useAsync(() => getProjectById(id), [id]);
  const [type, setType] = useState("caption");
  const [content, setContent] = useState("");
  const [adding, setAdding] = useState(false);

  const project = data?.project;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Add some content before saving it to this project.");
      return;
    }
    setAdding(true);
    try {
      const res = await addContentToProject(id, type, content.trim());
      setData({ project: res.project });
      setContent("");
      toast.success("Added to project.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't add that to the project."));
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 60, display: "flex", justifyContent: "center" }}>
        <Spinner label="Loading project…" />
      </div>
    );
  }

  if (!project) {
    return <EmptyState title="Project not found" description="It may have been deleted." />;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Project"
        title={project.projectName}
        description={project.description || "No description yet."}
        actions={
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate("/projects")}>
            All projects
          </Button>
        }
      />

      <Card className={styles.addCard}>
        <h3 className={styles.formTitle}>Add content to this project</h3>
        <form onSubmit={handleAdd} className={styles.form}>
          <div className={styles.typeRow}>
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={[styles.typeBtn, type === t.id ? styles.typeActive : ""].join(" ")}
                onClick={() => setType(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Paste or write the content you want saved to this project…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <Button type="submit" icon={<Plus size={15} />} loading={adding} className={styles.addBtn}>
            Add to project
          </Button>
        </form>
      </Card>

      <section>
        <h2 className={styles.sectionTitle}>Saved items ({project.items?.length || 0})</h2>
        {!project.items || project.items.length === 0 ? (
          <EmptyState title="No items yet" description="Anything you add above will show up here, newest first." />
        ) : (
          <div className={styles.items}>
            {[...project.items].reverse().map((item, i) => (
              <Card key={item._id || i} className={styles.item}>
                <div className={styles.itemHead}>
                  <Badge tone="brass">{TYPES.find((t) => t.id === item.type)?.label || item.type}</Badge>
                  <span className={styles.itemDate}>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <p className={styles.itemContent}>{typeof item.content === "string" ? item.content : JSON.stringify(item.content)}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

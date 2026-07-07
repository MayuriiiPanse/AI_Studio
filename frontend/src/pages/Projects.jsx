import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";
import useAsync from "../hooks/useAsync";
import { getAllProjects, createProject, deleteProject } from "../api/projects";
import { getErrorMessage } from "../api/client";
import styles from "./Projects.module.css";

export default function Projects() {
  const navigate = useNavigate();
  const { data, loading, refetch, setData } = useAsync(getAllProjects, []);
  const projects = data?.projects || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ projectName: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) {
      toast.error("Give the project a name.");
      return;
    }
    setCreating(true);
    try {
      await createProject(form.projectName.trim(), form.description.trim());
      toast.success("Project created.");
      setModalOpen(false);
      setForm({ projectName: "", description: "" });
      refetch();
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't create that project."));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(confirmId);
      setData({ projects: projects.filter((p) => p._id !== confirmId) });
      toast.success("Project deleted.");
      setConfirmId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete that project."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Campaigns"
        title="Projects"
        description="Group content from different sessions into one campaign so nothing gets lost."
        actions={
          <Button size="sm" icon={<Plus size={14} />} onClick={() => setModalOpen(true)}>
            New project
          </Button>
        }
      />

      {loading ? (
        <div className={styles.loadingRow}>
          <Spinner label="Loading projects…" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={22} />}
          title="No projects yet"
          description="Create a project to start grouping captions, scripts, and analyses into one campaign."
          action={<Button onClick={() => setModalOpen(true)}>Create your first project</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <Card key={project._id} hoverable className={styles.card} onClick={() => navigate(`/projects/${project._id}`)}>
              <div className={styles.cardHead}>
                <h3>{project.projectName}</h3>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmId(project._id);
                  }}
                  aria-label="Delete project"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p className={styles.desc}>{project.description || "No description yet."}</p>
              <span className={styles.count}>{project.items?.length || 0} item{project.items?.length === 1 ? "" : "s"}</span>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New project">
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            label="Project name"
            value={form.projectName}
            onChange={(e) => setForm((f) => ({ ...f, projectName: e.target.value }))}
            placeholder="Spring product launch"
            autoFocus
          />
          <Textarea
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What this project is for"
            rows={3}
          />
          <Button type="submit" loading={creating}>
            Create project
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmId)}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this project?"
        description="All grouped items in this project will be removed. This can't be undone."
      />
    </div>
  );
}

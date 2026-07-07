import Modal from "./Modal";
import Button from "./Button";
import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({ open, onClose, onConfirm, title = "Are you sure?", description, confirmLabel = "Delete", danger = true, loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={420}>
      {description && <p className={styles.desc}>{description}</p>}
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

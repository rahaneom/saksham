import { useState } from "react";
import { useSelector } from "react-redux";
import API from "../../util/api";
import { uploadResourceFile } from "../../util/supabaseClient";
import { useToast } from "../../components/useToast";

function AddResourceModal({ refresh }) {

  const addToast = useToast();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "EXAMS",
    type: "VIDEO",
    fileUrl: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.description.trim()) errs.description = "Description is required";

    if (form.type === "PDF" || form.type === "AUDIO") {
      if (!file) errs.file = `Please upload a ${form.type.toLowerCase()} file`;
    }

    if (form.type === "VIDEO") {
      if (!form.fileUrl.trim()) errs.fileUrl = "YouTube link is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async () => {

    if (user?.role !== "ROLE_COUNSELLOR") {
      addToast({ message: "Only counsellors can upload resources", type: "error" });
      return;
    }

    if (!validate()) {
      addToast({ message: "Fix form errors before submitting", type: "error" });
      return;
    }

    try {
      setLoading(true);

      let url = form.fileUrl;

      // Upload only for PDF & AUDIO
      if (file && (form.type === "PDF" || form.type === "AUDIO")) {
        url = await uploadResourceFile(file, form.type.toLowerCase());
      }

      await API.post("/resources", {
        ...form,
        fileUrl: url,
      });

      addToast({ message: "Resource added successfully", type: "success" });

      refresh();

      document.getElementById("add_modal").close();

      // reset
      setFile(null);
      setForm({
        title: "",
        description: "",
        category: "EXAMS",
        type: "VIDEO",
        fileUrl: "",
      });
      setErrors({});

    } catch (err) {
      console.error(err);
      addToast({ message: "Failed to add resource", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="btn btn-primary mb-4"
        onClick={() => document.getElementById("add_modal").showModal()}
      >
        Add Resource
      </button>

      <dialog id="add_modal" className="modal">
        <div className="modal-box space-y-4">
          <h3 className="font-bold text-lg">Add New Resource</h3>

          <input
            className="input input-bordered w-full"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <select
            className="select select-bordered w-full"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>EXAMS</option>
            <option>STRESS</option>
            <option>RELATIONSHIPS</option>
            <option>MOTIVATION</option>
            <option>MINDFULNESS</option>
          </select>

          <select
            className="select select-bordered w-full"
            value={form.type}
            onChange={(e) => {
              setForm({ ...form, type: e.target.value, fileUrl: "" });
              setFile(null);
            }}
          >
            <option>VIDEO</option>
            <option>PDF</option>
            <option>AUDIO</option>
          </select>

          {/* File Upload */}
          {(form.type === "PDF" || form.type === "AUDIO") && (
            <div>
              <input
                type="file"
                accept={form.type === "PDF" ? "application/pdf" : "audio/*"}
                className="file-input file-input-bordered w-full"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
            </div>
          )}

          {/* YouTube URL */}
          {form.type === "VIDEO" && (
            <div>
              <input
                className="input input-bordered w-full"
                placeholder="YouTube URL"
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              />
              {errors.fileUrl && <p className="text-red-500 text-sm">{errors.fileUrl}</p>}
            </div>
          )}

          <button
            onClick={submit}
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </dialog>
    </>
  );
}

export default AddResourceModal;
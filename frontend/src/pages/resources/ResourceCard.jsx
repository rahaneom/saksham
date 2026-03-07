import { useState } from "react";
import API from "../../util/api";
import { showToast } from "../../util/toast";
import { Video, FileText, Music, BookOpen } from "lucide-react";

function ResourceCard({ resource, isCounsellor, refresh }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmDelete = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    try {
      await API.delete(`/resources/${resource.id}`);
      showToast.success("Resource deleted successfully");
      refresh();
    } catch (err) {
      console.error(err);
      showToast.error("Failed to delete resource");
    } finally {
      setIsDeleting(false);
    }
  };

  const getTypeIcon = () => {
    switch (resource.type) {
      case "VIDEO":
        return Video;
      case "PDF":
        return FileText;
      case "AUDIO":
        return Music;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = () => {
    switch (resource.type) {
      case "VIDEO":
        return "badge-error";
      case "PDF":
        return "badge-warning";
      case "AUDIO":
        return "badge-info";
      default:
        return "badge-primary";
    }
  };

  const renderPreview = () => {
    if (resource.type === "PDF") {
      return (
        <div className="relative w-full h-48 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg overflow-hidden flex items-center justify-center mb-4">
          <svg className="w-16 h-16 text-yellow-600 opacity-30" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.414l4.586 4.586A2 2 0 0117 8V14a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
      );
    }
    if (resource.type === "AUDIO") {
      return (
        <audio
          controls
          className="w-full mb-4 h-10 rounded-lg overflow-hidden"
          title={resource.title}
        >
          <source src={resource.fileUrl} />
          Your browser does not support the audio element.
        </audio>
      );
    }
    if (resource.type === "VIDEO") {
      if (/youtube\.com|youtu\.be/.test(resource.fileUrl)) {
        let embed = resource.fileUrl;
        if (embed.includes("watch?v=")) {
          embed = embed.replace("watch?v=", "embed/");
        }
        return (
          <iframe
            className="w-full h-48 mb-4 rounded-lg"
            src={embed}
            title={resource.title}
            allowFullScreen
          />
        );
      }
      return (
        <video controls className="w-full h-48 mb-4 rounded-lg bg-black">
          <source src={resource.fileUrl} />
          Your browser does not support the video tag.
        </video>
      );
    }
    return null;
  };

  return (
    <div className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl hover:border-primary transition-all duration-300 overflow-hidden group">
      {/* Preview Section */}
      <div className="relative overflow-hidden bg-base-200 p-4">
        {renderPreview()}
      </div>

      {/* Card Body */}
      <div className="card-body p-5 sm:p-6">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge ${getTypeColor()} badge-lg font-semibold flex items-center gap-1`}>
            {(() => {
              const IconComponent = getTypeIcon();
              return <IconComponent size={16} />;
            })()}
            {resource.type}
          </span>
        </div>

        {/* Title */}
        <h2 className="card-title text-lg sm:text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {resource.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-base-content/70 line-clamp-3 mb-3">
          {resource.description || "No description available"}
        </p>

        {/* Category Badge */}
        {resource.category && (
          <div className="mb-3">
            <span className="badge badge-outline badge-sm">{resource.category}</span>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions justify-between mt-4 pt-4 border-t border-base-300 flex flex-col sm:flex-row gap-2">
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm flex-1 font-semibold hover:shadow-lg transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open
          </a>

          {isCounsellor && (
            <>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                className="btn btn-error btn-sm btn-outline font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>

              {/* confirmation modal */}
              {showConfirm && (
                <div className="modal modal-open">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm deletion</h3>
                    <p className="py-4">Are you sure you want to delete this resource?</p>
                    <div className="modal-action">
                      <button onClick={confirmDelete} className="btn btn-error">
                        Yes, delete
                      </button>
                      <button onClick={() => setShowConfirm(false)} className="btn">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourceCard;



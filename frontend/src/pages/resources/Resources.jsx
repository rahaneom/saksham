import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../../util/api";
import { setResources, setLoading } from "../../features/resource/resourceSlice";
import Loader from "../../components/Loader";
import { showToast } from "../../util/toast";
import AddResourceModal from "./AddResourceModal";
import ResourceCard from "./ResourceCard";
import { BookOpen, Video, FileText, Music } from "lucide-react";

function Resources() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.resources);
  const isCounsellor = useSelector((s) => s.auth.user?.role === "ROLE_COUNSELLOR");
  const [selectedType, setSelectedType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const res = await API.get("/resources");
      dispatch(setResources(res.data));
    } catch (err) {
      console.error(err);
      showToast.error("Failed to load resources");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredResources = list
    .filter((r) => selectedType === "ALL" || r.type === selectedType)
    .filter((r) => r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || r.description?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <Loader />;

  const resourceTypes = [
    { name: "ALL", label: "All Resources", Icon: BookOpen, color: "from-blue-500" },
    { name: "VIDEO", label: "Videos", Icon: Video, color: "from-red-500" },
    { name: "PDF", label: "Documents", Icon: FileText, color: "from-yellow-500" },
    { name: "AUDIO", label: "Audio", Icon: Music, color: "from-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200 py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Wellness Resources
          </h1>
          <p className="text-lg text-base-content/70">
            Explore curated mental health resources, videos, and materials
          </p>
        </div>

        {/* ADD Resource Modal (Counsellor Only) */}
        {isCounsellor && (
          <div className="mb-8 animate-slideUp" style={{ animationDelay: "0.1s" }}>
            <AddResourceModal refresh={fetchData} />
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8 animate-slideUp" style={{ animationDelay: "0.15s" }}>
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search resources..."
              className="input input-bordered w-full pl-10 pr-4 focus:ring-2 focus:ring-primary transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3 w-5 h-5 text-base-content/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10 animate-slideUp" style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-wrap gap-3">
            {resourceTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedType === type.name
                    ? `btn-primary shadow-lg scale-105`
                    : `btn btn-ghost hover:bg-base-300`
                }`}
              >
                <type.Icon size={20} />
                <span className="hidden sm:inline">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <div
                key={resource.id}
                className="animate-slideUp"
                style={{ animationDelay: `${0.1 * (index % 6)}s` }}
              >
                <ResourceCard
                  resource={resource}
                  isCounsellor={isCounsellor}
                  refresh={fetchData}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
            <svg className="w-16 h-16 text-base-content/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">No resources found</h3>
            <p className="text-base-content/50 text-center max-w-md">
              {searchTerm ? "Try adjusting your search terms" : "Check back soon for new resources"}
            </p>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-12 pt-8 border-t border-base-300 animate-slideUp" style={{ animationDelay: "0.5s" }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{filteredResources.length}</div>
              <div className="text-sm text-base-content/70">Resources Shown</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{list.filter(r => r.type === "VIDEO").length}</div>
              <div className="text-sm text-base-content/70">Videos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{list.filter(r => r.type === "PDF").length}</div>
              <div className="text-sm text-base-content/70">Documents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{list.filter(r => r.type === "AUDIO").length}</div>
              <div className="text-sm text-base-content/70">Audio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
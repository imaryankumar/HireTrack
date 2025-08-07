import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstence";
import usePostModal from "../store/usePostModal";
import useJobStore from "../store/jobStore";

const PostsCard = () => {
  const { isOpen, closePostModal, mode, jobData } = usePostModal();
  const [isLoading, setIsLoading] = useState(false);
  const { allJobData } = useJobStore();
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    status: "applied",
    location: "",
    salaryRange: "",
    notes: "",
  });
  const [resume, setResume] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetJobFields = () => {
    setFormData({
      companyName: "",
      position: "",
      status: "applied",
      location: "",
      salaryRange: "",
      notes: "",
    });
    setResume(null);
  };

  useEffect(() => {
    if (mode === "edit" && jobData) {
      setFormData({
        companyName: jobData.companyName || "",
        position: jobData.position || "",
        status: jobData.status || "applied",
        location: jobData.location || "",
        salaryRange: jobData.salaryRange || "",
        notes: jobData.notes || "",
      });
    } else {
      resetJobFields();
    }
  }, [mode, jobData]);

  const onPostJobHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { companyName, position, location, salaryRange } = formData;
      if (!companyName || !position || !location || !salaryRange) {
        toast.error("Please fill all required fields.");
        return;
      }

      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        dataToSend.append(key, value)
      );

      if (mode === "create" && !resume) {
        toast.error("upload file must be required!!", {
          id: "upload-err",
        });
        return;
      }
      if (resume) {
        dataToSend.append("resume", resume);
      }
      let response;
      if (mode === "edit" && jobData?._id) {
        response = await axiosInstance.put(
          `/posts/${jobData._id}`,
          dataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axiosInstance.post("/posts/create", dataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const { data } = response;

      if (data.success) {
        toast.success(data.message || "Job posted successfully.");
        if (mode !== "edit") {
          allJobData(`/posts/all?status=${formData.status}`, true);
        } else {
          allJobData("/posts/all", true);
        }
        closePostModal();
        resetJobFields();
      } else {
        toast.error(data.message || "Failed to post job.");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className="w-full m-2 lg:m-0 max-w-lg bg-neutral-400 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-auto py-4 bg-white text-black p-2 lg:p-4 rounded-lg">
          <div className="w-full flex items-start justify-between">
            <h3 className="text-2xl text-[#2B8AC2] font-semibold">
              {mode === "edit" ? "Edit a Job Post" : "Post a Job"}
            </h3>
            <span
              title="Close"
              className="cursor-pointer"
              onClick={() => closePostModal()}
            >
              <X />
            </span>
          </div>

          <form
            className="space-y-1.5 lg:space-y-4 max-w-lg mx-auto mt-4 lg:mt-6 px-2"
            onSubmit={onPostJobHandler}
          >
            {[
              { id: "companyName", label: "Company Name", type: "text" },
              { id: "position", label: "Position", type: "text" },
              { id: "location", label: "Location", type: "text" },
              {
                id: "salaryRange",
                label: "Salary Range",
                type: "text",
                placeholder: "e.g. 7-9 LPA",
              },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {label}
                </label>
                <input
                  id={id}
                  type={type}
                  placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                  value={formData[id]}
                  onChange={(e) => handleChange(id, e.target.value)}
                  className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2]"
                  required
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2]"
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offer">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes
              </label>
              <textarea
                id="notes"
                placeholder="Add any notes..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2]"
                rows={3}
              />
            </div>
            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Resume (PDF only)
              </label>
              <input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="mt-1 w-full border px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#2B8AC2]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#2B8AC2] text-white py-3 w-full rounded-lg cursor-pointer hover:bg-[#2473a4] mt-2 transition"
            >
              {isLoading
                ? mode === "edit"
                  ? "Updating..."
                  : "Posting..."
                : mode === "edit"
                ? "Update Job"
                : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostsCard;

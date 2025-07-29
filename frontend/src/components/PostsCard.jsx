import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstence";

const PostsCard = ({ setIsOpenPost }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    status: "applied",
    location: "",
    salaryRange: "",
    notes: "",
  });
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetJobFileds = () => {
    setFormData({
      companyName: "",
      position: "",
      status: "applied",
      location: "",
      salaryRange: "",
      notes: "",
    });
  };

  const onPostJobHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { companyName, position, location, salaryRange } = formData;
      if (!companyName || !position || !location || !salaryRange) {
        toast.error("Please fill all required fields.");
        return;
      }
      const { data } = await axiosInstance.post("/posts/create", formData);
      if (data.success) {
        toast.success(data?.message);
        setIsOpenPost(false);
        resetJobFileds();
        window.location.reload();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("something went wrong!!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        className="w-full m-2 lg:m-0 max-w-lg bg-neutral-400 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-auto py-4 bg-white text-black p-2 lg:p-4 rounded-lg">
          <div className="w-full flex items-start justify-between">
            <h3 className="text-2xl text-[#2B8AC2]">Post a Job</h3>
            <span
              title="close"
              className="cursor-pointer"
              onClick={() => setIsOpenPost(false)}
            >
              <X />
            </span>
          </div>
          <form
            className="space-y-4 max-w-lg mx-auto mt-6 px-2"
            onSubmit={onPostJobHandler}
          >
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700"
              >
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <input
                id="position"
                type="text"
                placeholder="Enter position"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2]"
                required
              />
            </div>

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
                <option value="interviewing">Interview</option>
                <option value="offer">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2]"
              />
            </div>

            <div>
              <label
                htmlFor="salaryRange"
                className="block text-sm font-medium text-gray-700"
              >
                Salary Range
              </label>
              <input
                id="salaryRange"
                type="text"
                placeholder="e.g. 7-9 LPA"
                value={formData.salaryRange}
                onChange={(e) => handleChange("salaryRange", e.target.value)}
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2]"
              />
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
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#2B8AC2] text-white py-3 w-full rounded-lg cursor-pointer"
            >
              {isLoading ? "Loading.." : "Post a Job"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostsCard;

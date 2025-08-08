import { X } from "lucide-react";
import { motion } from "framer-motion";

const statusSteps = ["applied", "interviewing", "offer", "rejected"];

const stepData = {
  applied: {
    label: "Logged",
    message: "Your journey has begun 🚀",
    color: "#2563EB",
  },
  interviewing: {
    label: "Evaluating",
    message: "You're under review 💬",
    color: "#CA8A04",
  },
  offer: {
    label: "Offered",
    message: "You’re almost there 🎉",
    color: "#059669",
  },
  rejected: {
    label: "Exploring",
    message: "New doors await 🌱",
    color: "#DC2626",
  },
};

const getProgressPercent = (status) => {
  const index = statusSteps.indexOf(status);
  return index === -1 ? 0 : ((index + 1) / statusSteps.length) * 100;
};

const onDownloadFileHandler = (downloadUrl) => {
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const JobTrackModal = ({ setIsTrackModal, trackerId }) => {
  if (!trackerId) return null;

  const {
    companyName,
    position,
    status = "applied",
    appliedDate,
    location,
    salaryRange,
    notes,
    resume,
  } = trackerId;

  const progress = getProgressPercent(status);
  const activeStep = stepData[status] || stepData.applied;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Track Progress</h3>
          <button
            onClick={() => setIsTrackModal(false)}
            className="text-gray-500 cursor-pointer"
          >
            <X />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-gray-800">
            {position} @ {companyName}
          </p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
        <div className="relative mb-8">
          <div className="flex justify-between items-center mb-3 px-1">
            {statusSteps.map((step, index) => {
              const isActive = statusSteps.indexOf(status) >= index;
              const color = isActive ? stepData[step].color : "#D1D5DB";

              return (
                <div key={step} className="flex flex-col items-center w-1/4">
                  <div
                    className="w-4 h-4 rounded-full border-2 transition-all duration-300"
                    style={{
                      backgroundColor: isActive ? color : "#E5E7EB",
                      borderColor: color,
                    }}
                  />
                  <span
                    className="mt-2 text-sm font-medium text-center transition-colors"
                    style={{
                      color: isActive ? color : "#9CA3AF",
                    }}
                  >
                    {stepData[step].label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="absolute top-1.5 left-2 right-2 h-1 bg-gray-200 rounded-full z-0" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute top-1.5 left-2 h-1 rounded-full z-10"
            style={{ backgroundColor: activeStep.color }}
          />
        </div>
        <div
          className="text-center text-md font-semibold italic mb-6"
          style={{ color: activeStep.color }}
        >
          {activeStep.message}
        </div>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Applied On:</span>{" "}
            {new Date(appliedDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Salary Range:</span> {salaryRange}
          </p>
          <p>
            <span className="font-semibold">Notes:</span> {notes}
          </p>
          {resume?.url && (
            <p>
              <button
                onClick={() => onDownloadFileHandler(resume.url)}
                className="underline font-medium cursor-pointer"
                style={{ color: activeStep.color }}
              >
                Download Resume
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobTrackModal;

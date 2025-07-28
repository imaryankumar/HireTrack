import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  CalendarDays,
  StickyNote,
} from "lucide-react";

const AllJobCards = ({ item, index }) => {
  return (
    <div
      key={index}
      className="w-full bg-slate-100 border border-[#2B8AC2] shadow-sm rounded-xl p-4 space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {item?.companyName}
      </h2>
      <div className="flex justify-between text-sm text-gray-700">
        <div className="space-y-1">
          <p className="flex items-center gap-2">
            <Briefcase size={16} className="text-gray-500" />
            {item?.position}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="text-gray-500" />
            {new Date(item?.appliedDate).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            {item?.location}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="flex items-center gap-2 justify-end">
            <Building2 size={16} className="text-gray-500" />
            {item?.status}
          </p>
          <p className="flex items-center gap-2 justify-end">
            <IndianRupee size={16} className="text-gray-500" />
            {item?.salaryRange}
          </p>
          <p className="flex items-center gap-2 justify-end">
            <StickyNote size={16} className="text-gray-500" />
            Note added
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 italic">"{item?.notes}"</p>
    </div>
  );
};

export default AllJobCards;

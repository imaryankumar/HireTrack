const JobCard = ({ data, listId, setListId }) => {
  const onJobCardHandler = (id) => {
    setListId(id);
  };
  return (
    <div
      className={`h-40 rounded-xl cursor-pointer w-full p-4 capitalize transition-all duration-200
        flex flex-col justify-between relative overflow-hidden ${data.bgColor}
        ${
          listId === data?.label
            ? "border-2 border-[#2B8AC2]"
            : "border border-transparent"
        }
      `}
      onClick={() => onJobCardHandler(data?.label)}
    >
      <span className="absolute top-2 left-2 text-[10px] bg-white text-gray-600 px-2 py-1 rounded-full uppercase tracking-wide">
        {data.label}
      </span>
      <div className="flex justify-end text-3xl">{data.icon}</div>
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-gray-700 text-lg">{data.label}</span>
        <span className="text-gray-900 text-xl font-semibold">
          {data.count}
        </span>
      </div>
    </div>
  );
};

export default JobCard;

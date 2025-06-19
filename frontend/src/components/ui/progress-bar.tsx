const ProgressBar = ({ value, className = "" }: any) => {
  return (
    <div className={`w-full rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;

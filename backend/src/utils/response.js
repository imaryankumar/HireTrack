const response = (
  res,
  status = 200,
  success = true,
  message = "",
  payload = {}
) => {
  const result = { success, message, ...payload };
  return res.status(status).json(result);
};

export default response;

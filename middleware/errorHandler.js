module.exports = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

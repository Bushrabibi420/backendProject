const asyncHandler = (requestHandler) => {
  (req, res, next) => { 
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

//  steps of high order function which accepts function in its parameter
// 1  const asyncHandler=()=>{}
// 2  const asyncHandler=(func)=>()=>{}
// 2  const asyncHandler=(func)=>async()=>{}

// tryCatch

// const asyncHandler = (fn) => async (req,res,next) => {

// try {
//   await fn(req,res,next)
// } catch (error) {
//   res.status(err.code || 500).json({
//     success:false,
//     message:err.message
//   })
// }

// };

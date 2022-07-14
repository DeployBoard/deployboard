// // Take in a body and validate the required fields are present.
// const validateBody = (req, res, next) => {
//   const { body: data } = req;
//   const requiredFields = ["service", "environment", "version", "status"];

//   requiredFields.forEach((field) => {
//     if (!data[field]) {
//       return res.status(400).json({
//         status: "error",
//         message: `Missing required field: ${field}`,
//       });
//     }
//   });

//   next();
// };

// export default validateBody;

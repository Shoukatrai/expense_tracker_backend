export const emailValidate = (email) => {
  console.log("emailValidate");
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const valid = re.test(email.trim());
  return {
    valid,
    message: valid ? "" : "Please enter a valid email address.",
  };
};

export const validatePassword = (password) => {
  console.log("validatePassword");
  const options = {
    minLength: 8,
    requireLower: true,
    requireUpper: true,
    requireNumber: true,
    requireSpecial: true,
  };

  if (!password) return { valid: false, message: "Password is required." };

  if (password.length < options.minLength) {
    return {
      validPass: false,
      messagePass: `Password must be at least ${options.minLength} characters.`,
    };
  }
//   if (options.requireLower && !/[a-z]/.test(password)) {
//     return {
//       validPass: false,
//       messagePass: "Include at least one lowercase letter.",
//     };
//   }
//   if (options.requireUpper && !/[A-Z]/.test(password)) {
//     return {
//       validPass: false,
//       messagePass: "Include at least one uppercase letter.",
//     };
//   }
//   if (options.requireNumber && !/[0-9]/.test(password)) {
//     return { validPass: false, messagePass: "Include at least one number." };
//   }
//   if (
//     options.requireSpecial &&
//     !/[!@#$%^&*()_\-+\[\]{};:'",.<>/?`~|\\]/.test(password)
//   ) {
//     return {
//       validPass: false,
//       messagePass: "Include at least one special character.",
//     };
//   }

  return { validPass: true, messagePass: "" };
};

export function validateSignUpForm(formData) {
  const errors = {};

  if (!formData.userName) {
    errors.userName = "User name is required";
  } else if (formData.userName.length < 8) {
    errors.userName = "User name must be at least 8 characters";
  }

  if (!formData.userEmail) {
    errors.userEmail = "Email is required";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (!isStrongPassword(formData.password)) {
    errors.password =
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateSignUpInstructorForm(formData) {
  const errors = validateSignUpForm(formData); // kế thừa validate cơ bản

  if (!formData.bio) errors.bio = "Bio is required";
  if (!formData.occupation) errors.occupation = "Occupation is required";
  if (!formData.education) errors.education = "Education is required";
  if (!formData.language) errors.language = "Language is required";
  if (!formData.paypalEmail) errors.paypalEmail = "PayPal email is required";

  return errors;
}

export function isStrongPassword(password) {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
}

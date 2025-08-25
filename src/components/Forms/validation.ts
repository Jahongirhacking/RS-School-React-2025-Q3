import * as yup from 'yup';

// Strong password rule
const passwordRules =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const formSchema = yup.object({
  // 1. Name (first uppercase letter)
  name: yup
    .string()
    .required('Name is required')
    .matches(/^[a-zA-Z\s]*$/, 'Latin letter'),

  // 2. Age (>= 0, number only)
  age: yup
    .number()
    .typeError('Age must be a number')
    .required('Age is required')
    .min(0, 'Age cannot be negative'),

  // 3. Email
  email: yup.string().email('Invalid email').required('Email is required'),

  // 4. Password
  password: yup
    .string()
    .required('Password is required')
    .matches(passwordRules, {
      message:
        'Must have 1 uppercase, 1 lowercase, 1 number, 1 special character, and be ≥ 6 chars',
    }),

  // 5. Confirm password
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  // 6. Gender (radio/select)
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),

  // 7. Terms (must be checked)
  terms: yup
    .boolean()
    .required('You must accept terms')
    .oneOf([true], 'You must accept terms'),

  // 8. Image (base64 string or url)
  image: yup
    .string()
    .required('Image is required')
    .matches(
      /^data:image\/(png|jpeg|jpg);base64,/,
      'Image must be a base64 PNG or JPEG'
    ),

  // 9. Country (must select at least 1, comes from Redux list)
  country: yup.string().required('Select a country'),
});

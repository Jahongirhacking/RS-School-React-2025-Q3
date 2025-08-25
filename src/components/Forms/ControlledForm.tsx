import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { imageToBase64 } from '../../utils/imageToBase64';
import { FormProps, FormSchemaType } from './types';
import { formSchema } from './validation';

export const ControlledForm = ({ onSubmit }: FormProps) => {
  const countries = useSelector(
    (store: RootState) => store.formReducer.countries
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: undefined,
      country: '',
      gender: '',
      image: undefined,
      terms: false,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await imageToBase64(file);
    setValue('image', base64, { shouldValidate: true });
  };

  console.error(errors); // For debug/testing

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <div>
        <label htmlFor="name">Name:</label>
        <input id="name" {...register('name')} data-testid="name" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email">Email:</label>
        <input id="email" {...register('email')} data-testid="email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age">Age:</label>
        <input id="age" type="number" {...register('age')} data-testid="age" />
        {errors.age && <p>{errors.age.message}</p>}
      </div>

      {/* Gender */}
      <div>
        <label htmlFor="gender">Gender:</label>
        <select id="gender" {...register('gender')} data-testid="gender">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p>{errors.gender.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          data-testid="password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          data-testid="confirmPassword"
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country">Country:</label>
        <input
          id="country"
          {...register('country')}
          list="countries"
          className="border p-2 w-full"
          data-testid="country"
        />
        <datalist id="countries">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && <p>{errors.country.message}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label htmlFor="image">Upload Image:</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            await handleImageUpload(e);
          }}
          data-testid="image"
        />
        {errors.image && <p>{errors.image.message}</p>}
      </div>

      {/* Terms */}
      <div>
        <label htmlFor="terms">
          <input
            id="terms"
            type="checkbox"
            {...register('terms')}
            data-testid="terms"
          />
          Accept Terms & Conditions
        </label>
        {errors.terms && <p>{errors.terms.message}</p>}
      </div>

      {/* Submit */}
      <button type="submit" data-testid="submit">
        Submit
      </button>
    </form>
  );
};

import { FormEvent, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { imageToBase64 } from '../../utils/imageToBase64';
import { FormProps } from './types';
import { formSchema } from './validation';

export const UncontrolledForm = ({ onSubmit }: FormProps) => {
  const countries = useSelector(
    (state: RootState) => state.formReducer.countries
  );

  const formRef = useRef<HTMLFormElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    const raw = {
      name: fd.get('name') as string,
      age: Number(fd.get('age')),
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      confirmPassword: fd.get('confirmPassword') as string,
      gender: fd.get('gender') as string,
      terms: fd.get('accepted') === 'on',
      country: fd.get('country') as string,
      image: undefined as string | undefined,
    };

    const file = fd.get('image') as File | null;
    if (file) {
      raw.image = await imageToBase64(file);
    }

    try {
      const validated = await formSchema.validate(raw, { abortEarly: false });
      onSubmit({ ...validated });
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);

      if (err instanceof Error && 'inner' in err && Array.isArray(err.inner)) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path) newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          data-testid="name"
          className="border p-2 w-full"
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          name="age"
          data-testid="age"
          className="border p-2 w-full"
        />
        {errors.age && <p className="text-red-500">{errors.age}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          data-testid="email"
          className="border p-2 w-full"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          data-testid="password"
          className="border p-2 w-full"
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          data-testid="confirmPassword"
          className="border p-2 w-full"
        />
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          data-testid="gender"
          className="border p-2 w-full"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <p className="text-red-500">{errors.gender}</p>}
      </div>

      <div>
        <label htmlFor="country">Country</label>
        <input
          id="country"
          name="country"
          data-testid="country"
          list="countries"
          className="border p-2 w-full"
        />
        <datalist id="countries">
          {countries.map((c: string) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && <p className="text-red-500">{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="image">Upload Image</label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          ref={imageRef}
          data-testid="image"
        />
        {errors.image && <p className="text-red-500">{errors.image}</p>}
      </div>

      <div>
        <label className="flex items-center gap-2" htmlFor="accepted">
          <input type="checkbox" name="accepted" data-testid="terms" /> Accept
          Terms & Conditions
        </label>
        {errors.accepted && <p className="text-red-500">{errors.accepted}</p>}
      </div>

      <button
        type="submit"
        data-testid="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

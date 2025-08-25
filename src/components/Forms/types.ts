import { InferType } from 'yup';
import { formSchema } from './validation';

export type FormSchemaType = InferType<typeof formSchema>;

export interface FormProps {
  onSubmit: (data: FormSchemaType) => void;
}

export enum FormTypes {
  Controlled = 'controlled',
  Uncontrolled = 'uncontrolled',
}

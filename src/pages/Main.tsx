import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { ControlledForm } from '../components/Forms/ControlledForm';
import { UncontrolledForm } from '../components/Forms/UncontrolledForm';
import {
  FormProps,
  FormSchemaType,
  FormTypes,
} from '../components/Forms/types';
import Modal from '../components/Modal/Modal';
import { addForm, removeForm } from '../store/slices/formSlice';
import { RootState } from '../store/store';

const Main = () => {
  const [formType, setFormType] = useState<FormTypes | null>(null);
  const dispatch = useDispatch();
  const data = useSelector((store: RootState) => store?.formReducer?.data);

  const handleSubmit =
    (type: FormTypes): FormProps['onSubmit'] =>
    (values: FormSchemaType) => {
      console.log(values, 'val');
      dispatch(addForm({ ...values, source: type, id: uuidv4() }));
      setFormType(null);
    };

  return (
    <div>
      <div className="form-controls">
        <button onClick={() => setFormType(FormTypes.Uncontrolled)}>
          Uncontrolled form
        </button>
        <button onClick={() => setFormType(FormTypes.Controlled)}>
          Controlled form
        </button>
      </div>

      <Modal
        isOpen={formType !== null}
        onClose={() => setFormType(null)}
        title={formType || ''}
      >
        {formType === FormTypes.Controlled ? (
          <ControlledForm onSubmit={handleSubmit(FormTypes.Controlled)} />
        ) : (
          <UncontrolledForm onSubmit={handleSubmit(FormTypes.Uncontrolled)} />
        )}
      </Modal>

      <div className="result">
        <table border={1} cellSpacing={0}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Image</th>
              <th>Gender</th>
              <th>Country</th>
              <th>Form type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((el) => (
              <tr key={el?.id}>
                <td>{el?.name}</td>
                <td>{el?.age}</td>
                <td>{el?.email}</td>
                <td>
                  <img width={80} src={el?.image} />
                </td>
                <td>{el?.gender}</td>
                <td>{el?.country}</td>
                <td>{el?.source}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => dispatch(removeForm(el?.id))}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Main;

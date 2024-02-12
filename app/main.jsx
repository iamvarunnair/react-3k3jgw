import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles.css';
import { Form, FormElement, Field } from '@progress/kendo-react-form';
import { Datepicker } from '../Datepicker';

const App = () => {
  const [formValues, setFormValues] = React.useState({});
  const onSubmit = (data) => {
    console.log('Form ', data);
  };
  return (
    <Form
      onSubmit={onSubmit}
      key={JSON.stringify({ ...formValues })}
      initialValues={{
        ...formValues,
      }}
      render={(formRenderProps) => (
        <FormElement horizontal={true}>
          <Field
            id={'RenewalDate'}
            name={'RenewalDate'}
            label={'Renewal Date'}
            component={Datepicker}
            resetTime={true}
          />
          <button type="submit">Submit</button>
        </FormElement>
      )}
    />
    // <div className="food-demo card-container">
    //   <div className="k-card custom-card">
    //     <div className="card-row">
    //       <div className="card-column">
    //         <h4 className="k-h4">Schedule Your Visit</h4>
    //         <div className="component-container">
    //           <form className="k-form" onSubmit={(e) => e.preventDefault()}>
    //             <fieldset>
    //               <DatePicker placeholder="Choose a date..." />
    //             </fieldset>
    //           </form>
    //         </div>
    //         <div className="skeleton-container top">
    //           <div className="k-skeleton skeleton-box-small" />
    //           <div className="k-skeleton skeleton-box-large" />
    //         </div>
    //         <div className="skeleton-container bottom">
    //           <div className="k-skeleton skeleton-box-medium" />
    //           <div className="k-skeleton skeleton-box-medium" />
    //         </div>
    //       </div>
    //       <div className="card-column image-container">
    //         <div className="k-skeleton skeleton-image">
    //           <span className="k-icon k-i-image" />
    //         </div>
    //       </div>
    //     </div>
    //     <div className="card-row">
    //       <div className="k-skeleton skeleton-box-half" />
    //     </div>
    //   </div>
    // </div>
  );
};
ReactDOM.render(<App />, document.querySelector('my-app'));

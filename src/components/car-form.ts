import TextField from "./text-field";
import SelectField from "./select-field";
import brands from '../data/brands';
import models from '../data/models';


export type Values = {
  brand: string,
  model: string,
  price: string,
  year: string,
};

export type CarFormProps = {
  values: Values,
  title: string,
  onSubmit: (values: Values) => void,
  submitBtnText: string,
  isEdited: boolean,
}

export type Fields = {
  brand: SelectField,
  model: SelectField,
  price: TextField,
  year: TextField,
};

class CarForm {
  private props: CarFormProps;
  private fields: Fields;
  
  private htmlFormHeader: HTMLHeadingElement;
  private htmlFieldsContainer: HTMLDivElement;
  private htmlsubmitBtnText: HTMLButtonElement;
  public htmlElement: HTMLFormElement;

  constructor (props: CarFormProps) {
    this.props = props

    this.htmlElement = document.createElement('form');
    this.htmlFormHeader = document.createElement('h3');
    this.htmlFieldsContainer = document.createElement('div');
    this.htmlsubmitBtnText = document.createElement('button');



    this.fields = {

    brand: new SelectField({
      name: 'brand',
      labelText: 'Car brand',
      options: brands.map(({ id, title }) => ({ title, value: id })),
    }),

    model: new SelectField({
      name: 'model',
      labelText: 'Car Model',
      options: models.map(({ id, title }) => ({ title, value: id })),
    }),

    price: new TextField({
      name: 'price',
      labelText: 'Car Price',
    }),

    year: new TextField({
      name: 'year',
      labelText: 'Car Year',
    }),

  }
  this.initialize();
  this.renderView();
  }

  private handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    const { onSubmit } = this.props;

    const formData = new FormData(this.htmlElement);

    const brand = formData.get('brand') as string | null;
    const model = formData.get('model') as string | null;
    const price = formData.get('price') as string | null;
    const year = formData.get('year') as string | null;

    if (!(brand && price && model && year)) {
      alert('Form Error');
      return;
    }

    const formValues: Values = {
      brand,
      model,
      price,
      year,
    };

    onSubmit(formValues);
  };


  initialize(): void {
    this.htmlFormHeader.className = 'h2 text-center';

    const fieldsArr = Object.values(this.fields);
    this.htmlFieldsContainer.className = 'd-flex flex-column gap-3';
    this.htmlFieldsContainer.append(...fieldsArr.map((field) => field.htmlElement));
    this.htmlsubmitBtnText.className = 'btn btn-primary';

    this.htmlElement.className = 'card d-flex flex-column gap-2 p-2';
    this.htmlElement.append(
      this.htmlFormHeader,
      this.htmlFieldsContainer,
      this.htmlsubmitBtnText,
    );
  };

  renderView(): void {
    const { title, values, submitBtnText, isEdited } = this.props;

    if (isEdited) {
      this.htmlElement.classList.add('border');
      this.htmlElement.classList.add('border-info');
      this.htmlsubmitBtnText.classList.add('btn-warning');
      this.htmlsubmitBtnText.classList.remove('btn-success');
    } else {
      this.htmlElement.classList.remove('border');
      this.htmlElement.classList.remove('border-warning');
      this.htmlsubmitBtnText.classList.add('btn-info');
      this.htmlsubmitBtnText.classList.remove('btn-warning');
    }

    this.htmlFormHeader.innerHTML = title;
    this.htmlsubmitBtnText.innerHTML = submitBtnText;

    const valuesKeyValueArr = Object.entries(values) as [keyof Values, string][];
    valuesKeyValueArr.forEach(([fieldName, fieldValue]) => {
      const field = this.fields[fieldName];
      field.updateProps({
        value: fieldValue,
      });
    });
    this.htmlElement.addEventListener('submit', this.handleSubmit);
  };

  updateProps(props: Partial<CarFormProps>) {
    this.props = {
      ...this.props,
      ...props
    }
    this.renderView();
  }
}

export default CarForm
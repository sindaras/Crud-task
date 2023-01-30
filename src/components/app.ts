import cars from '../data/cars';
import models from '../data/models';
import brands from '../data/brands';
import Table from './table';
import stringifyProps, { StringifyObjectProps } from "../helpers/stringify-object";
import CarJoined from '../types/car-joined';
import SelectField from './select-field';
import CarForm, {Values} from './car-form';
import CarsCollection, { CarProps } from '../helpers/cars-collection';

class App {
  private carsCollection: CarsCollection;
  private selectedBrandId: null | string;
  private brandSelect: SelectField
  private carForm: CarForm;
  private editedCarId: string | null;
  private carTable: Table<StringifyObjectProps<CarJoined>>;
  private htmlElement: HTMLElement;

  public constructor(selector: string) {

    this.editedCarId = null;

    const foundElement = document.querySelector<HTMLElement>(selector);
    if (foundElement === null) throw new Error(`element by sector - not found. '${selector}'`);

    this.carsCollection = new CarsCollection({ cars, brands, models });
    this.carTable = new Table({
      title: 'All Vehicle',
      columns: {
        id: 'Id',
        brand: 'brand',
        model: 'model',
        price: 'Price',
        year: 'Year',
      },
      rowsData: this.carsCollection.all.map(stringifyProps),
      onDelete: this.handleCarDelete,
      onEdit: this.handleCarEdit,
      editedCarId: this.editedCarId,
    });
    this.brandSelect = new SelectField({
      labelText: 'Choose Brand',
      options: brands.map(({ id, title }) => ({ title, value: id })),
      onChange: this.handleBrandChange,
    });
    
    this.selectedBrandId = null;

    this.htmlElement = foundElement;

    const initialBrandId = brands[0].id;
    this.carForm = new CarForm({
      title: 'Create New Car',
      submitBtnText: 'Create',
      values: {
        brand: initialBrandId,
        model: models.filter((m) => m.brandId === initialBrandId)[0].id,
        price: '0',
        year: '2000',
      },
      onSubmit: this.handleCreateCar,
      isEdited: Boolean(this.editedCarId)
    });
  }

    private handleBrandChange = (brandId: string) => {
      const brand = brands.find((b) => b.id === brandId);
      this.selectedBrandId = brand ? brandId : null;
  
      this.renderView();
    };
  
    private handleCarDelete = (carId: string) => {
      this.carsCollection.deleteCarById(carId);
  
      this.renderView();
    };
  
    private handleCreateCar = ({
      brand, model, price, year,
    }: Values): void => {
      const carProps: CarProps = {
        brandId: brand,
        modelId: model,
        price: Number(price),
        year: Number(year),
      };
  
      this.carsCollection.add(carProps);
      this.renderView();
    };

    private handleUpdateCar = ({
      brand, model, price, year,
    }: Values): void => {
      if (this.editedCarId) {
        const carProps: CarProps = {
          brandId: brand,
          modelId: model,
          price: Number(price),
          year: Number(year),
        };
  
        this.carsCollection.update(this.editedCarId, carProps);
        this.editedCarId = null;
  
        this.renderView();
      }
    };

    private handleCarEdit = (carId: string) => {
      if (this.editedCarId === carId) {
        this.editedCarId = null;
      } else {
        this.editedCarId = carId;
      }
      this.renderView();
    }
  
    private renderView = () => {
      const { selectedBrandId, carsCollection, editedCarId } = this;
  
      if (selectedBrandId === null) {
        this.carTable.updateProps({
          editedCarId,
          title: 'All Vehicles',
          rowsData: carsCollection.all.map(stringifyProps),
        });
      } else {
        const brand = brands.find((b) => b.id === selectedBrandId);
        if (brand === undefined) throw new Error('Non-Existant brand...');
  
        this.carTable.updateProps({
          title: `${brand.title} brand`,
          rowsData: carsCollection.getByBrandId(selectedBrandId).map(stringifyProps),
        });
      }
      if (editedCarId) {
        const editedCar = cars.find((c) => c.id === editedCarId);
        if (!editedCar) {
          alert('Car is not found');
          return;
        }
  
        const model = models.find((m) => m.id === editedCar.modelId);
  
        if (!model) {
          alert('Car is not Found');
          return;
        }
  
        this.carForm.updateProps({
          title: 'Update Car Details',
          submitBtnText: 'Update',
          values: {
            brand: model.brandId,
            model: model.id,
            price: String(editedCar.price),
            year: String(editedCar.year),
          },
          isEdited: true,
          onSubmit: this.handleUpdateCar,
        });
      } else {
        const initialBrandId = brands[0].id;
        this.carForm.updateProps({
          title: 'Create New Vehicle',
          submitBtnText: 'Create',
          values: {
            brand: initialBrandId,
            model: models.filter((m) => m.brandId === initialBrandId)[0].id,
            price: '',
            year: '',
          },
          isEdited: false,
          onSubmit: this.handleCreateCar,
        });
      }
    };
  
    public initialize = (): void => {
      const uxContainer = document.createElement('div');
      uxContainer.className = 'd-flex gap-4 align-items-start';
      uxContainer.append(
        this.carTable.htmlElement,
        this.carForm.htmlElement,
      );
  
      const container = document.createElement('div');
      container.className = 'container my-4 d-flex flex-column gap-4';
      container.append(
        this.brandSelect.htmlElement,
        uxContainer,
      );
  
      this.htmlElement.append(container);
    };
  }
  
  export default App;
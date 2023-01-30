export type TextFieldProps = {
    labelText: string;
    initialValue?: string;
    name: string;
  
  }
  
  class TextField {
  
    private static count: number = 0;
    private props: TextFieldProps;
    private id: string;
  
    public htmlElement: HTMLDivElement;
  
    private labelHtmlElement: HTMLLabelElement;
    private inputHtmlElement: HTMLInputElement;
  
    constructor(props: TextFieldProps) {
      TextField.count += 1;
  
      this.props = props;
  
      this.htmlElement = document.createElement('div');
      this.labelHtmlElement = document.createElement('label');
      this.inputHtmlElement = document.createElement('input');
      this.id = `TextField_${TextField.count}`;
  
      this.initialize();
      this.renderView();
  
    }
  
    private initialize() {
  
      this.htmlElement.append(
        this.labelHtmlElement,
        this.inputHtmlElement
      );
  
      this.labelHtmlElement.setAttribute('for', this.id);
      this.labelHtmlElement.className = 'd-block';
  
      this.labelHtmlElement.id = this.id;
      this.inputHtmlElement.className = 'w-100';
    }
  
    private renderView() {
      const {name, initialValue, labelText} = this.props;
  
      this.inputHtmlElement.name = name;
      this.labelHtmlElement.innerHTML = labelText;
  
      if (initialValue !== undefined)
        {this.inputHtmlElement.value = initialValue
        };
    }
  
    updateProps(props: Partial<TextFieldProps>) {
      this.props = { 
        ...this.props,
        ...props,
      }
      this.renderView();
      };
    }
  
  export default TextField;
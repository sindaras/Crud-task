type RowData = {
    id: string,
    [key: string]: string,
  };
  
  export type TableProps<Type> = {
    title: string,
    columns: Type,
    rowsData: Type[],
    onDelete: (id: string) => void,
    onEdit: (id: string) => void,
    editedCarId: string | null,
  };
  
  class Table<Type extends RowData> {
  
    private props: TableProps<Type>;
    private tbody: HTMLTableSectionElement;
    private thead: HTMLTableSectionElement;
    public htmlElement: HTMLTableElement;
  
    public constructor(props: TableProps<Type>) {
      this.props = props;
  
      this.htmlElement = document.createElement('table');
      this.thead = document.createElement('thead');
      this.tbody = document.createElement('tbody');
  
      this.initialize();
    }
  
  
    private initialize = (): void => {
      this.htmlElement.className = 'table table-striped order border p-3';
      this.htmlElement.append(
        this.thead,
        this.tbody,
      );
  
      this.renderView();
    };
  
    private renderView = (): void => {
      this.renderHeadView();
      this.renderBodyView();
    };
  
    private renderHeadView = (): void => {
      const { title, columns } = this.props;
  
      const headersArray = Object.values(columns);
      const headersRowHtmlString = headersArray.map((header) => `<th>${header}</th>`).join('');
  
      this.thead.innerHTML = `
        <tr>
          <th colspan="${headersArray.length}" class="text-center h3">${title}</th>
        </tr>
        <tr>${headersRowHtmlString}</tr>`;
    };
  
    private renderBodyView = (): void => {
      const { rowsData, columns, editedCarId } = this.props;
  
      this.tbody.innerHTML = '';
      const rowsHtmlElements = rowsData
        .map((rowData) => {
          const tr = document.createElement('tr');
          if (editedCarId === rowData.id) {
            tr.style.backgroundColor = '#C6E2FF';
          }
  
          const cellsHtmlString = Object.keys(columns)
            .map((key) => `<td>${rowData[key]}</td>`)
            .join(' ');
  
          tr.innerHTML = cellsHtmlString;
  
          this.addActionsCell(tr, rowData.id);
  
          return tr;
        });
  
      this.tbody.append(...rowsHtmlElements);
    };
  
    private addActionsCell = (tr: HTMLTableRowElement, id: string) => {
      const { onDelete, onEdit, editedCarId } = this.props;
  
      const buttonCell = document.createElement('td');
      buttonCell.className = 'd-flex justify-content-center gap-2';
  
      const isCancelButton = editedCarId === id;
      const updateButton = document.createElement('button');
      updateButton.type = 'button';
      updateButton.innerHTML = isCancelButton ? 'Cancel' : 'UpdateCar';
      updateButton.className = `btn btn-${isCancelButton ? 'success' : 'info'}`;
      updateButton.style.width = '100px';
      updateButton.addEventListener('click', () => onEdit(id));
  
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.innerHTML = 'Delete';
      deleteButton.className = 'btn btn-danger';
      deleteButton.style.width = '80px';
      deleteButton.addEventListener('click', () => onDelete(id));
  
      buttonCell.append(updateButton, deleteButton);
      tr.append(buttonCell);
    };
  
    public updateProps = (newProps: Partial<TableProps<Type>>) => {
      this.props = {
        ...this.props,
        ...newProps,
      };
  
      this.renderView();
    };
  }
  
  export default Table;
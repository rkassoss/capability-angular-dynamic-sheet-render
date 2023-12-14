import { ElementRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EmbededSheetService {

  qsObjectsList: any[] = [];

  // loads objects from a sheet
  loadObjects(app: any, vis: ElementRef, qsPageConfig) {
    // https://help.qlik.com/en-US/sense-developer/May2023/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/AppAPI/getObject-method.htm
    app.getObject(qsPageConfig.SheetId)
      .then((sheetObject) => {
        sheetObject.getLayout()
          .then((sheetLayout): any => {
            this.constructSheet(vis, sheetLayout, "qlikObject");
            // find currnetSelectionsBar
            const currentSelectionBar = vis.nativeElement.querySelector(`#currentSelectionBar`);
            // add currentSelections to the currentSelectionBar
            app.getObject(currentSelectionBar, 'CurrentSelections');


            vis.nativeElement.querySelectorAll(`.qlikObject`).forEach(element => {
              const chartId = element.id;
              app.getObject(element, chartId).then(obj =>{
                this.qsObjectsList.push(obj);
              });    
            });
          })
      })
  }

  // appends the sheet objects to the html container
  constructSheet(vis: ElementRef, sheetLayout, addClass) {

    // add currentSelection bar
    const currentSelectionBar = document.createElement('div');
    currentSelectionBar.id = 'currentSelectionBar';
    // add it to the vis container as first child
    vis.nativeElement.appendChild(currentSelectionBar);

    // create a div element for the grid
    const grid = document.createElement('div');
    grid.id = 'grid';
    // append the grid to the vis container
    vis.nativeElement.appendChild(grid);
    grid.style.display = 'grid';
    grid.style.gridTemplateRows = `repeat(${sheetLayout.rows}, minmax(0, 1fr)`;
    grid.style.gridTemplateColumns = `repeat(${sheetLayout.columns}, minmax(0, 1fr))`;
    // make the grid full width and height
    grid.style.width = '100%';
    grid.style.height = '100%';

    (sheetLayout.cells).forEach((object) => {
      const objectId = object.name;
      const colStart = object.col + 1;
      const rowStart = object.row + 1;
      const colSpan = object.colspan;
      const rowSpan = object.rowspan;
      const objectDiv = document.createElement('div');
      objectDiv.id = objectId;
      objectDiv.style["grid-column"] = `${colStart} / span ${colSpan}`;
      objectDiv.style["grid-row"] = `${rowStart} / span ${rowSpan}`;
      objectDiv.style.border = '1px solid #0001';
      objectDiv.style.padding = '5px';
      objectDiv.classList.add(addClass);
      grid.appendChild(objectDiv);
    })
  }

  // close objects
  closeObjects(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.qsObjectsList.forEach(obj => {
        obj.close();
      });
      this.qsObjectsList = [];
      resolve(true);
    });
  }
}
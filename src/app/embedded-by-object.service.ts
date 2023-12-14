import { ElementRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class EmbededByObjectService {

  qsObjectsList: any[] = [];

  //render objects by object id
  render(app: any, elementRef: ElementRef, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Visualization API: https://help.qlik.com/en-US/sense-developer/May2023/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/VisualizationAPI/VisualizationAPI.htm
      app.visualization.get(id).then((vis: any) => {
        this.qsObjectsList.push(vis);
        // https://help.qlik.com/en-US/sense-developer/May2023/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/VisualizationAPI/QVisualization.htm
        vis.show(elementRef.nativeElement);
        resolve(vis);
      });
    });
  }

  // closes objects by object id
  closeObjectById(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.qsObjectsList.forEach(obj =>{
        // https://help.qlik.com/en-US/sense-developer/May2023/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/VisualizationAPI/close-method.htm
        obj.close();
      });
      this.qsObjectsList = [];
      resolve(true);
    });
  }
}
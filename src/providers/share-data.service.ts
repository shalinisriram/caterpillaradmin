import { EventEmitter, Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

@Injectable()
export class DataService {
  private messageSource = new BehaviorSubject({
    LineLoadNumber: "",
    SectionName: "",
    ModelName: "",
    ComponentName: "",
    SerialNumber: "",
    AreaName: ""
  });
  private processList = new BehaviorSubject([]);
  currentMessage = this.messageSource.asObservable();
  currentProcess = this.processList.asObservable();

  invokeFirstComponentFunction = new EventEmitter();    
  subsVar: Subscription;  

  constructor() { }

  onFirstComponentButtonClick() {    
     this.invokeFirstComponentFunction.emit();    
  }

  changeMessage(message) {
    this.messageSource.next(message)
  }
  updateList(msg)
  {
    this.processList.next(msg)
    console.log(this.processList)
  }
}
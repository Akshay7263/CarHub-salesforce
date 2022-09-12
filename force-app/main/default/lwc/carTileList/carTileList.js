import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars';
import CARS_FILTER_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarsSelected__c';
import { publish,subscribe,MessageContext } from 'lightning/messageService';
export default class CarTileList extends LightningElement {
  cars = []
   
  error
  filters={}
    
  @wire(MessageContext)
  messageContext


  @wire(getCars,{filter:'$filters'})
  getCars({data,error}){
    if(data){
      this.cars = data
      console.log('##response cars',data)
    }
    if(error){
  console.error(error)
    }
  }
    
    


    connectedCallback(){
         this.subscribeHandler();
        
    }

    subscribeHandler(){
      subscribe(this.messageContext,CARS_FILTER_MESSAGE,(mes)=>this.handlerFilterChanges(mes))
    }
    handlerFilterChanges(mes){
      this.filters = {...mes.filters}
      console.log('###filters',this.filters)
    }
    handleCarSelect(event){
      console.log('##details',event.detail)
      publish(this.messageContext,CARS_SELECTED_MESSAGE,{
        selected:event.detail
    })
    }
}
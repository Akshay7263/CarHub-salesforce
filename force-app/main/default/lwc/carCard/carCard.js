import { LightningElement, wire } from 'lwc';
import CAR_OBJECT from '@salesforce/schema/Car__c'
import NAME_FIELD from '@salesforce/schema/Car__c.Name'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__C'
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c'
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c'
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c'
import FUEL_TYPE_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c'
import NUMBER_OF_SEATS_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c'
import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarsSelected__c';
import { subscribe,MessageContext } from 'lightning/messageService';
import { getFieldValue } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';
export default class CarCard extends NavigationMixin(LightningElement){
     car = CAR_OBJECT
  
    categoryField = CATEGORY_FIELD
    makeField = MAKE_FIELD
    msrpField = MSRP_FIELD
    controlField = CONTROL_FIELD

    fuelType = FUEL_TYPE_FIELD
    numberOfSeates = NUMBER_OF_SEATS_FIELD
    recordId 

    carName
    carPictureUrl

        
  @wire(MessageContext)
  messageContext

    handleRecordLoad(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.carName=getFieldValue(recordData,NAME_FIELD);
        this.carPictureUrl=getFieldValue(recordData,PICTURE_URL_FIELD)


    }
    connectedCallback(){
        subscribe(this.messageContext,CARS_SELECTED_MESSAGE,(mes)=>this.handlerSelectChanges(mes))
    }
    handlerSelectChanges(mes){
        console.log('##mes',mes.selected)
        this.recordId = mes.selected
    }
    handleUtilityClick(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId:this.recordId,
                objectApiName:CAR_OBJECT.objectApiName,
                actionName: 'view'
            },
        });

    }

}
import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import CAR_OBJECT from '@salesforce/schema/Car__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import CARS_FILTER_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c';
const ERROR_MESSAGE_CATEGORY = 'failed to Load cotegory values'
const ERROR_MESSAGE_MAKE = 'failed to Load MakeType values'


import { publish,MessageContext } from 'lightning/messageService';
export default class CarFilter extends LightningElement {
    errorMessageCategory = ERROR_MESSAGE_CATEGORY
    errorMessageMakeType = ERROR_MESSAGE_MAKE
    filters = {
        searchKey: '',
        maxPrice: '999999'

    }
      
    timer
    @wire(MessageContext)
    messageContext

    @wire(getObjectInfo, { objectApiName: CAR_OBJECT })
    carObjectInfo

    @wire(getPicklistValues, {
        recordTypeId: '$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: CATEGORY_FIELD
    })categories


    @wire(getPicklistValues, {
        recordTypeId: '$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: MAKE_FIELD
    })makeType

    handleSearchKeyChange(event) {
       
        this.filters = {...this.filters,"searchKey":event.target.value}
        
        this.sendDataToCarList();

    }
    handleMaxPriceChangeHandler(event) {
        
        this.filters = {...this.filters,"maxPrice":event.target.value}
        this.sendDataToCarList();
    }
    handleCheckbox(event){
        if(!this.filters.categories ){
            const categories = this.categories.data.values.map(i=>i.value)
            const makeType = this.makeType.data.values.map(i=>i.value)
           
            this.filters = {...this.filters,categories,makeType}
            console.log('##mainfilter',this.filters)
        }
        const {name,value} = event.target.dataset
        if(event.target.checked){
            if(!this.filters[name].includes(value)){
                this.filters[name]= [...this.filters[name],value]
            }  }else{
                this.filters[name]=this.filters[name].filter(item => item !== value)
            }
            
            console.log('##list',this.filters);
      
        
     this.sendDataToCarList();
        //console.log("name",name,"value",value)
   
    }

    
    sendDataToCarList(){
        window.clearTimeout(this.timer)
        this.timer = window.setTimeout(()=>{
            publish(this.messageContext,CARS_FILTER_MESSAGE,{
                filters:this.filters
            },
            console.log('##carfilter',this.filters))
        },400)
       
    }

  
}
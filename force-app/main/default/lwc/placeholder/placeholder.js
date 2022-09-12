import { api, LightningElement } from 'lwc';
import CARHUB_PLACEHOLDER_IMAGE from '@salesforce/resourceUrl/placeholder';
export default class Placeholder extends LightningElement {
@api message

placeholderUrl = CARHUB_PLACEHOLDER_IMAGE

}
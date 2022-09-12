public with sharing class CarController {
    public CarController() {}
    public class Filter{
        @AuraEnabled
        public String searchKey{get;set;}

        @AuraEnabled
        public Decimal maxPrice{get;set;}

        @AuraEnabled
        public String[] categories {get;set;}

        @AuraEnabled
        public String[] makeType {get;set;}
    }

    @AuraEnabled(Cacheable=true)
    public static List<Car__c> getCars(Filter filter){
        String key,whereClause = '';
        Decimal maxPrice ;
        String[] categories,makeType,criteria = new List<String>();
        if(filter!=null){
            maxPrice = filter.maxPrice;
            categories = filter.categories;
            makeType = filter.makeType;
             if(!String.isEmpty(filter.searchKey)){
              key = '%'+filter.searchKey+'%';
              criteria.add('Name LIKE : key');
           }
           if(filter.maxPrice > 0 ){
            criteria.add('MSRP__c <=: maxPrice');
           }
           if(filter.categories != null){
             criteria.add('Category__c IN : categories ');
           }
           if(filter.makeType != null){
            criteria.add('Make__c IN : makeType ');
          }
          if(criteria.size() > 0){
            whereClause =  'WHERE ' + String.join(criteria, ' AND ');
          }
           

        }
         System.debug('apexfilterobject'+filter);
        String query = 'SELECT Id,Name,Description__c,Category__c,MSRP__c,Picture_URL__c FROM Car__c '+whereClause+' WITH SECURITY_ENFORCED ORDER BY Name' ;
        System.debug('query '+query);
        return Database.query(query);
    }
}

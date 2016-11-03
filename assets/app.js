if (typeof api !== 'undefined') {
    // variable needs to come from a local config and holds the path to the api
    var hasApi=true;
}
else{
    var hasApi=false;
}

var CategoriesData=[];
var AttributeData=[];
var AttributeConjunction=[];
var Descriptions=[];

/*
 * set language data from static files
 */
// german
CategoriesData['de']=Categories_de.content;
AttributeData['de']=Attributes_de.content;
AttributeConjunction['de']=Attributes_de.conjunction;
// english
CategoriesData['en']=Categories_en.content;
AttributeData['en']=Attributes_en.content;
AttributeConjunction['en']=Attributes_en.conjunction;


//register components
Vue.component('v-select', VueSelect.VueSelect);

// teach TWIG some manners
Vue.config.delimiters = ['[[', ']]'];
/*
 * add products
 */
// localStorage persistence
var STORAGE_KEY = 'crazy-products'
var productStorage = {
    fetch: function () {
        var products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        products.forEach(function (product, index) {
            products.uid = index
        })
        productStorage.uid = products.length
        return products
    },
    save: function (products) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    }
}
// end new products

// message management
var STORAGE_KEY_MSG = 'crazy-messages'
var messageStorage = {
    fetch: function () {
        var messages = JSON.parse(localStorage.getItem(STORAGE_KEY_MSG) || '[]')
        messages.forEach(function (message, index) {
            messages.uid = index
        })
        messageStorage.uid = messages.length
        return messages
    },
    save: function (messages) {
        localStorage.setItem(STORAGE_KEY_MSG, JSON.stringify(messages))
    }
}
// settings management
var STORAGE_KEY_SETTING = 'crazy-settings'
var settingStorage = {
    fetch: function () {
        var settings = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTING) || '{}')
        return settings
    },
    save: function (settings) {
        localStorage.setItem(STORAGE_KEY_SETTING, JSON.stringify(settings))
    }
}
// end settings

new Vue({
    el: '#app',
    data: {
        /*
         * Navigation Behavior
         */
        headline: 'Product Names',
        show_load: true,
        show_names: true,
        show_preview: false,
        show_export: false,
        show_metatags: false,
        show_message: false,
        show_settings: false,

        isFullScreen:false,
        isSmallScreen:true,

        // Name Scheme
        selected_category:"",
        selected_attribute_1:"",
        selected_attribute_2:"",
        conjunction:AttributeConjunction,

        // Product Management
        products:productStorage.fetch(),
        newProduct:'',

        // message management
        messages:messageStorage.fetch(),
        // setting management
        settings:settingStorage.fetch(),

        // Language Management

        languages:[
            {
                id:'de',
                status:true,
                flag:'flag-icon-de',
            },
            {
                id:'en',
                status:true,
                flag:'flag-icon-us',
            }
        ],

    },
    // watch products change for localStorage persistence
    watch: {
        products: {
            handler: function (products) {
                productStorage.save(products)
            },
            deep: true
        },
        messages: {
            handler: function (messages) {
                messageStorage.save(messages)
            },
            deep: true
        },
        settings: {
            handler: function (settings) {
                settingStorage.save(settings)
            },
            deep: true
        }
    },
    computed: {
        category_options: function(){
            return CategoriesData[this.settings.editorLanguage];
        },
        attribute_options_1: function(){
            return AttributeData[this.settings.editorLanguage];
        },
        attribute_options_2: function(){
            return AttributeData[this.settings.editorLanguage];
        },
        localized_category: function(){
            var localized={};
            if(this.selected_category){
                var selected_category = this.selected_category;
                this.languages.forEach(function (language) {
                    found = false;
                    value = selected_category.value;
                    categories = CategoriesData[language.id];
                    categories.forEach(function(category){
                        if(value == category.value){
                            found = true;
                            localized[language.id]=category.label;
                        }
                    });

                    if(!found){
                        /*
                         * TODO: add notification for missing translations
                         */
                    }
                });

            }
            return localized;
        },
        localized_attribute_1: function(){
            var localized={};
            if(this.selected_attribute_1){
                var selected = this.selected_attribute_1;
                this.languages.forEach(function (language) {
                    found = false;
                    value = selected.value;
                    attributes = AttributeData[language.id];
                    attributes.forEach(function(attribute){
                        if(value == attribute.value){
                            found = true;
                            localized[language.id]=attribute.label;
                        }
                    });

                });
            }
            return localized;
        },
        localized_attribute_2: function(){
            var localized={};
            if(this.selected_attribute_2){
                var selected = this.selected_attribute_2;
                this.languages.forEach(function (language) {
                    found = false;
                    value = selected.value;
                    attributes = AttributeData[language.id];
                    attributes.forEach(function(attribute){
                        if(value == attribute.value){
                            found = true;
                            localized[language.id]=attribute.label;
                        }
                    });

                });
            }
            return localized;
        },
        allActive: {
            set: function (value) {
                this.products.forEach(function (product) {
                    product.active = value
                })
            }
        },
        deactivateMessages: {
            set: function () {
                this.messages.forEach(function (message) {
                    message.show = false
                })
            }
        },
        editorLanguage:{
            set: function (language) {
                settings=this.settings;
                settings.editorLanguage=language;
                this.settings = settings;
            },
            get: function(){
                // default fallback = 'de'
                settings=this.settings;

                if(!settings.editorLanguage){
                    return 'de';
                }
                else{
                    return settings.editorLanguage;
                }
            }
        }

    },
    methods: {
        makeActive: function(item){
            // deactivate all
            this.show_names= false;
            this.show_metatags= false;
            this.show_export= false;
            this.show_preview= false;
            this.show_message=false;
            this.show_load=true;
            this.isFullScreen=false;
            this.isSmallScreen=true;

            switch(item){
                case 'names':
                    this.show_names= true;
                    this.headline = 'Product Names';
                    break;
                case 'preview':
                    this.show_preview= true;
                    this.headline = 'Preview: Multilingual and custom texts';
                    this.isFullScreen=true;
                    this.isSmallScreen=false;
                    break;
                case 'metatags':
                    this.show_metatags= true;
                    this.headline = 'Metatags';
                    break;
                case 'export':
                    this.show_export= true;
                    this.headline = 'Export Products to shop';
                    break;
                case 'message':
                    this.show_message= true;
                    this.show_load=false;
                    this.headline = 'Messages';
                    break;
            }
        },
        toggle_settings: function(){
            this.show_settings = !this.show_settings;
        },
        toggle_language: function(language){
            language.status = !language.status;
        },
        /*
         * Products stuff
         */
        addProduct: function () {
            var value = this.newProduct && this.newProduct.trim()
            if (!value) {
                return
            }

            // get products from db/api
            if(hasApi){
                api.app=this;
                api.data = value;
                api.action = 'get_products';
                api.call();
            }
            else
            {

                // use fake api response from api.js
                var random_nr = Math.round(Math.random()*(Object.keys(Api_response).length-1));
                console.log('no api ... dry hump with api element '+ random_nr);
                my_product=Api_response[random_nr];

                this.products.push({
                    id: productStorage.uid++,
                    active: true,
                    modelCode:value,
                    name_scheme:null,
                    names:{},
                    category:null,
                    attribute1:null,
                    attribute2:null,
                    descriptions:my_product.descriptions,
                    db_id:my_product.db_id,
                    propertyFormula:my_product.propertyFormula,
                    properties:my_product.properties
                });

                this.newProduct = '';
            }
        },
        removeProduct: function (product) {
            this.products.splice(this.products.indexOf(product), 1)
        },
        addMessage: function(message, type){
            var today = moment().format('lll');
            var msg= {
                id:messageStorage.uid++,
                message:message,
                type:type,
                show:true,
                date:today
            };
            this.messages.unshift(msg);

        },
        debugMessages: function(){
            console.log(this.messages);
        },
        hideMessage: function (message) {
            message.show = false
        },
        removeMessage: function(message){
            this.messages.splice(this.messages.indexOf(message), 1)
        },
        removeMessages: function(){
            this.messages=[];
        },
        alert: function(text) {
            alert(text);
        },
        saveNameScheme: function(){
            var category = this.selected_category;
            var attr1 = this.selected_attribute_1;
            var attr2 = this.selected_attribute_2;
            var localized_category = this.localized_category;
            var localized_attribute_1 = this.localized_attribute_1;
            var localized_attribute_2 = this.localized_attribute_2;
            var languages = this.languages;
            var conjunction = this.conjunction;


            this.products.forEach(function (product) {
                if(product.active){

                    if (typeof category == 'object' && category !=null && category.value != '--'){
                        product.category={};
                        product.category.value=category.value;
                        product.category.label=localized_category;
                    }
                    if(typeof attr1=='object' && attr1!=null && attr1.value!='--'){
                        product.attribute1={};
                        product.attribute1.value=attr1.value;
                        product.attribute1.label=localized_attribute_1;
                    }
                    if(typeof attr2=='object' && attr2!=null && attr2.value!='--'){
                        product.attribute2={};
                        product.attribute2.value=attr2.value;
                        product.attribute2.label=localized_attribute_2;
                    }
                    // generate composed product name for each language
                    product_names={};

                    languages.forEach(function(language){
                        var my_name='';

                        if(product.category && product.category.label[language.id]){
                            my_name = product.category.label[language.id];
                        };
                        if(product.attribute1 && product.attribute1.label[language.id]){
                            my_name = my_name +" "+ conjunction[language.id].with+ " " +product.attribute1.label[language.id];

                        };
                        if(product.attribute2 && product.attribute2.label[language.id]){
                            my_name = my_name + " "+ conjunction[language.id].and+ " " +product.attribute2.label[language.id];
                        };
                        product_names[language.id]={
                            value:my_name,
                            edit:false
                        };

                    });
                    product.names=product_names;

                }
            })
        },
        editMe: function(item){
            item.edit=true;
        },
        closeEditMe: function(item){
            item.edit= false;
            item.value= item.value.replace(/\r?\n|\r/g,"")
        },
        getGeneratedDescription: function(product, language){
            index=this.products.indexOf(product);

            if(hasApi){
                api.app=this;
                api.language=language;
                api.data = product.propertyFormula;
                api.action = 'generate_description';
                api.product_index = index;
                api.call();
            }
            else{
                // use fake api response from api.js
                var random_nr = Math.round(Math.random()*(Object.keys(Api_response).length-1));
                console.log('no api ... dry hump with api element nr.'+ random_nr);
                my_product=Api_response[random_nr];
                my_description=my_product.descriptions[language];
                this.products[index].descriptions[language]=my_description;
            }
        },
        set_editor_language: function(language){
            this.editorLanguage=language.id;
        }
    }
})

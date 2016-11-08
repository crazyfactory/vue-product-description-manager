if (typeof api !== 'undefined') {
    // variable needs to come from a local config and holds the path to the api
    var hasApi=true;
}
else{
    var hasApi=false;
}


var AttributeData=[];
var AttributeConjunction=[];
var Descriptions=[];

/*
 * set language data from static files
 */
// provide Array CategoryOptions to populate category select (see config/categories.js)
// provide Array AttributeOptions to populate attribute select (see config/attributes.js)



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

// metatags management
var STORAGE_KEY_META = 'crazy-metatags'
var metatagStorage = {
    fetch: function () {
        var metatags = JSON.parse(localStorage.getItem(STORAGE_KEY_META) || '[]');
        return metatags
    },
    save: function (metatags) {
        localStorage.setItem(STORAGE_KEY_META, JSON.stringify(metatags))
    }
}

new Vue({
    el: '#app',
    data: {
        /*
         * Navigation Behavior
         */
        headline: 'Product Names',
        headline_icon:'fa fa-commenting-o',
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
        selected_metatags:[],
        conjunction:AttributeOptions.conjunction,

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
        // metatag management
        local_metatag_options:metatagStorage.fetch(),
        static_metatag_options:[
            {
                value:'piercing',
                label:{
                    de:'Piercing',
                    en:'Piercing'
                },

                alias:{
                    de:[
                        "Bier-sing",
                        "Piecing",
                        "Körperschmuck"
                    ],
                    en:[
                        "beer-sing",
                        "piecing",
                        "priecing",
                        "peecing",
                        "body jewellry"
                    ]
                }
            },
            {
                value:'mobile-case',
                label: {
                    de:'Handyhülle',
                    en:'Mobile case'
                },
                alias: {
                    de: [
                        "Handyhüllen",
                        "Mobile Hülle",
                        "Handy Hülle"
                    ],
                    en: [
                        "mobile cases",
                        "mobilecase"
                    ]
                }
            }

        ]
    },
    // watch products change for localStorage persistence
    watch: {
        products: {
            handler: function (products) {
                productStorage.save(products)
            },
            deep: true
        },
        local_metatag_options: {
            handler: function (metatags) {
                metatagStorage.save(metatags)
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
            return CategoryOptions.content;
        },
        attribute_options_1: function(){
            return AttributeOptions.content;
        },
        attribute_options_2: function(){
            return AttributeOptions.content;
        },
        metatag_options: {
            get: function(){
                // concat local and static metatags
                var local= this.local_metatag_options;
                var static = this.static_metatag_options;
                return local.concat(static);
            },
            set: function(value){
                //insert value at the begin of the list
                this.local_metatag_options.unshift(value);
            }
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
                this.settings.editorLanguage =language;

            },
            get: function(){
                // default fallback = 'de'
                if(!this.settings.editorLanguage){
                    this.settings.editorLanguage = 'de';
                }
                return this.settings.editorLanguage;
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
            this.headline_icon='';

            switch(item){
                case 'names':
                    this.show_names= true;
                    this.headline = 'Product Names';
                    this.headline_icon = "fa fa-commenting-o";
                    break;
                case 'preview':
                    this.show_preview= true;
                    this.headline = 'Preview: Multilingual and custom texts';
                    this.isFullScreen=true;
                    this.isSmallScreen=false;
                    this.headline_icon = "fa fa-eye";
                    break;
                case 'metatags':
                    this.show_metatags= true;
                    this.headline = 'Metatags';
                    this.headline_icon = "fa fa-tags";
                    break;
                case 'export':
                    this.show_export= true;
                    this.headline = 'Export Products to shop';
                    this.headline_icon = "fa fa-database";
                    break;
                case 'message':
                    this.show_message= true;
                    this.show_load=false;
                    this.headline = 'Messages';
                    this.headline_icon = "fa fa-envelope-o";
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
                    metatags:{},
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
        addMetatag: function(){

        },
        addEditorLanguage: function(value){
            var setting= {
                editorLanguage:value,
            };
            this.settings=setting;
        },
        clearSettings: function(){
            this.settings={};
        },
        clearLocalMetatags:function(){
            this.local_metatag_options = [];
        },
        createMetatagOption: function(value){
            var metatag ={
                id:value,
                value:value,
                label: {
                    de:value,
                    en:value
                },
                alias: {de: [], en: []}
            };
            this.local_metatag_options.unshift(metatag);
            return metatag
        },
        getOptionLabel: function(item){
            if (typeof item === 'object') {
                if(item.label) {
                    return item.label[this.settings.editorLanguage];
                }
            }
            return item;
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
        saveMetatags: function(){
          alert('work in progress ... coming soon');
            console.log(this.selected_metatags);
        },
        saveNameScheme: function(){
            var category = this.selected_category;
            var attr1 = this.selected_attribute_1;
            var attr2 = this.selected_attribute_2;
            var languages = this.languages;
            var conjunction = this.conjunction;


            this.products.forEach(function (product) {
                if(product.active){

                    if (typeof category == 'object' && category !=null && category.value != '--'){
                        product.category={};
                        product.category.value=category.value;
                        product.category.label=category.label;
                    }
                    if(typeof attr1=='object' && attr1!=null && attr1.value!='--'){
                        product.attribute1={};
                        product.attribute1.value=attr1.value;
                        product.attribute1.label=attr1.label;
                    }
                    if(typeof attr2=='object' && attr2!=null && attr2.value!='--'){
                        product.attribute2={};
                        product.attribute2.value=attr2.value;
                        product.attribute2.label=attr2.label;
                    }
                    // generate composed product name for each language
                    product_names={};

                    languages.forEach(function(language){
                        var my_name='';

                        if(product.category && product.category.label[language.id]){
                            my_name = product.category.label[language.id];
                        };
                        if(product.attribute1 && product.attribute1.label[language.id]){
                            my_name = my_name +" "+ conjunction.with[language.id]+ " " +product.attribute1.label[language.id];

                        };
                        if(product.attribute2 && product.attribute2.label[language.id]){
                            my_name = my_name + " "+ conjunction.and[language.id]+ " " +product.attribute2.label[language.id];
                        };
                        product_names[language.id]={
                            value:my_name,
                            original_value:my_name,
                            edit:false,
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
        removeCustomName:function(item){
            item.value=item.original_value;
            item.edit= false;
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
        }
    }
})

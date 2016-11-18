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
        var meta_static=[];

        if (MetatagsStatic.content){
            // got stic tags from mock or api
            meta_static = MetatagsStatic.content;
        }
        // get the local tags
        var metatags = JSON.parse(localStorage.getItem(STORAGE_KEY_META) || '[]');
        // if no local tags are available: include static tags
        if (metatags.length<1){
            meta_static.forEach(function(metatag){
                metatags.push(metatag);
            })
        }
        return metatags
    },
    save: function (metatags) {
        localStorage.setItem(STORAGE_KEY_META, JSON.stringify(metatags))
    }
}
// material management
var STORAGE_KEY_MATERIAL = 'crazy-material'
var materialStorage = {
    fetch: function () {
        var material_static=[];

        if (MaterialStatic.content){
            // got statics from mock or api
            material_static = MaterialStatic.content;
        }
        // get the local options
        var materials = JSON.parse(localStorage.getItem(STORAGE_KEY_MATERIAL) || '[]');
        // if no local option are available: include statics
        if (materials.length<1){
            material_static.forEach(function(material){
                materials.push(material);
            })
        }
        return materials
    },
    save: function (materials) {
        localStorage.setItem(STORAGE_KEY_MATERIAL, JSON.stringify(materials))
    }
}
// category management
var STORAGE_KEY_CATEGORY = 'crazy-category'
var categoryStorage = {
    fetch: function () {
        var category_static=[];

        if (CategoryOptions.content){
            // got statics from mock or api
            category_static = CategoryOptions.content;
        }
        // get the local options
        var category = JSON.parse(localStorage.getItem(STORAGE_KEY_CATEGORY) || '[]');
        // if no local option are available: include statics
        if (category.length<1){
            category_static.forEach(function(item){
                category.push(item);
            })
        }
        return category
    },
    save: function (category) {
        localStorage.setItem(STORAGE_KEY_CATEGORY, JSON.stringify(category))
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
        show_material:false,
        show_materials_edit:false,
        show_preview: false,
        show_export: false,
        show_metatags: false,
        show_metatags_edit:false,
        show_message: false,
        show_settings: false,
        show_actionbar:false,

        isFullScreen:false,

        // Name Scheme
        //selected_categories:[],
        selected_category:'',
        selected_attribute_1:"",
        selected_attribute_2:"",
        selected_materials:[],
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

        /*
         * metatag management
         */
        // local
        metatags_local:metatagStorage.fetch(),
        materials_local:materialStorage.fetch(),
        categories_local:categoryStorage.fetch(),

    },
    // watch products change for localStorage persistence
    watch: {
        products: {
            handler: function (products) {
                productStorage.save(products)
            },
            deep: true
        },
        categories_local: {
            handler: function (item) {
                categoryStorage.save(item)
            },
            deep: true
        },
        materials_local: {
            handler: function (materials) {
                materialStorage.save(materials)
            },
            deep: true
        },
        metatags_local: {
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
        attribute_options_1: function(){
            return AttributeOptions.content;
        },
        attribute_options_2: function(){
            return AttributeOptions.content;
        },
        categories:function(){
            my_options={};
            this.categories_local.forEach(function(item) {
                my_options[item.value]=item;
            });
            return my_options;
        },
        category_index:function(){
            return Object.keys(this.categories)
        },
        category_objects:function(){
            return Object.values(this.categories);
        },
        isSmallScreen:function(){
            return !this.isFullScreen;
        },
        materials:function(){
            my_options={};
            this.materials_local.forEach(function(item) {
                my_options[item.value]=item;
            });
            return my_options;
        },
        material_index:function(){
            return Object.keys(this.materials)
        },
        material_objects:function(){
            return Object.values(this.materials);
        },
        metatags:{
            get:function(){
                my_tags={};
                this.metatags_local.forEach(function(metatag) {
                    my_tags[metatag.id]=metatag;
                });
                return my_tags;
            }
        },
        metatag_index:function(){
            return Object.keys(this.metatags)
        },
        metatag_objects:function(){
            return Object.values(this.metatags);
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
        },
        hasHiddenProducts: function(){
            var bool = false;
            this.products.forEach(function(product){
               if(product.hidden){
                   bool = true;
               }
            });
            return bool;
        },
        hasEditableProducts: function(){
            var bool = false;
            this.products.forEach(function(product){
                if(!product.hidden){
                    bool = true;
                }
            });
            return bool;
        }

    },
    methods: {
        makeActive: function(item){
            // deactivate all
            this.show_names= false;
            this.show_metatags= false;
            this.show_material=false,
            this.show_export= false;
            this.show_preview= false;
            this.show_message=false;
            this.show_load=true;
            this.isFullScreen=false;
            this.headline_icon='';

            switch(item){
                case 'names':
                    this.show_names= true;
                    this.headline = 'Product Names';
                    this.headline_icon = "fa fa-commenting-o";
                    break;
                case 'material':
                    this.show_material= true;
                    this.headline = 'Material';
                    this.headline_icon = "fa fa-industry";
                    break;
                case 'preview':
                    this.show_preview= true;
                    this.headline = 'Preview';
                    this.isFullScreen=true;
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
                case 'admin':
                    this.show_message= true;
                    this.show_load=false;
                    this.headline = 'Admin Panel';
                    this.headline_icon = "fa fa-user-secret";
                    break;
            }
        },
        toggle_actionbar: function(){
            if(this.products.length>0){
                this.show_actionbar = !this.show_actionbar;
            }
            else{
                this.show_actionbar = false;
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
            var value = this.newProduct && this.newProduct.trim();
            if (!value) {
                return
            }

            // get products from db/api
            if(hasApi){
                // clear product input
                this.newProduct = '';

                api.app=this;
                api.data = value;
                api.action = 'get_products';
                api.call();
            }
            else
            {
                console.log('no api ... dry hump with api element ');

                var my_products = value.split(" ");
                var my_product_list = [];

                my_products.forEach(function(my_product_name){
                    my_product_name=my_product_name.trim();
                    // use fake api response from api.js
                    var random_nr = Math.round(Math.random()*(Object.keys(Api_response).length-1));
                    my_product=Api_response[random_nr];
                    my_product_list.push({
                        id: productStorage.uid++,
                        active: true,
                        hidden:false,
                        modelCode:my_product_name,
                        name_scheme:null,
                        names:{},
                        materials:[],
                        metatags:['piercing'],
                        category:null,
                        attribute1:null,
                        attribute2:null,
                        descriptions:my_product.descriptions,
                        db_id:my_product.db_id,
                        propertyFormula:my_product.propertyFormula,
                        properties:my_product.properties
                    });
                });

                this.products = this.products.concat(my_product_list);
                this.newProduct = '';
            }
        },
        removeProduct: function (product) {
            this.products.splice(this.products.indexOf(product), 1)
        },
        hideProduct: function (product) {
            product.hidden = true;
            product.active = false;
        },
        removeSeletedProducts(){
            var keep_products=[];
            this.products.forEach(function(product){
                if(!product.active){
                  keep_products.push(product);
              }
            });
            // delete all products
            this.products = keep_products;
        },
        selectAllProducts: function(value){
            var products = this.products;
            products.forEach(function(product){
                if(!product.hidden){
                    product.active=value;
                } else{
                    // product never active when it is hidden
                    product.active=false;
                }

            });
        },
        hideSelectedProducts: function(){
            this.products.forEach(function(product){
                if(product.active) {
                    // hidden products are not active
                    product.active = false;
                    product.hidden = true;
                }
            });
        },
        showAllProducts: function(){
            this.products.forEach(function(product){
                if(product.hidden) {
                    // hidden products are not active
                    product.active = true;
                    product.hidden = false;
                }else{
                    product.active = false;
                }

            });
        },
        invertSelectedlProducts: function(){
            var products = this.products;
            products.forEach(function(product){
                product.active=!product.active;
            });
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
            this.metatags_local = [];
        },
        optionFactory: function(value){
            // no spaces and all lowercase for id/value
            normalized_value = value.replace(/ /g,"_").toLowerCase();
            var option = {
                id:normalized_value,
                value:normalized_value,
                label: {
                    de:{
                        value: value,
                        edit:false,
                        active:true
                    },
                    en:{
                        value: value,
                        edit:false,
                        active:true
                    }
                },
                alias: {
                    de: {
                        value:"",
                        edit:false,
                        active:true
                    },
                    en: {
                        value:"",
                        edit:false,
                        active:true
                    }
                }
            };
            return option;
        },
        createCategoryOption: function(value){
            var option = this.optionFactory(value);
            this.categories_local.push(option);
            return option;
        },
        createMetatagOption: function(value){
            var option = this.optionFactory(value);
            this.metatags_local.push(option);
            return option;
        },
        createMaterialOption: function(value){
            var option = this.optionFactory(value);
            this.materials_local.push(option);
            return option;
        },
        getOptionLabel: function(item){
            if (typeof item === 'object') {
                if(item.label) {
                    return item.label[this.settings.editorLanguage];
                }
            }
            return item;
        },
        getOptionLabelValue: function(item){
            if (typeof item === 'object') {
                if(item.label) {
                    return item.label[this.settings.editorLanguage].value;
                }
            }
            return item;
        },
        debugMessages: function(){
            console.log(this.messages);
        },
        debugMetatags:function(){
            console.log("Local (app.metatags_local)");
            console.log(this.metatags_local);
            console.log("ALL Metatags (app.metatags)");
            console.log(this.metatags);
            console.log('ferdsch');
        },
        debugMaterials:function(){
            console.log("Local (app.materials_local)");
            console.log(this.materials_local);
            console.log("ALL Materials (app.materials)");
            console.log(this.materials);
            console.log('aus die maus');
        },
        clearMaterials:function(){
            console.log('Clear local materials:');
            console.log(this.materials_local);
            this.materials_local=[];
            this.materials=[];
        },
        debugCategories:function(){
            console.log("Local (app.categories_local)");
            console.log(this.categories_local);
            console.log("ALL Categories (app.categories)");
            console.log(this.categories);
            console.log('aus die maus');
        },
        clearCategories:function(){
            console.log('Clear local categories:');
            console.log(this.categories_local);
            this.categories_local=[];
            this.categories=[];
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
        // categories START
        closeEditCategories: function(){
            this.show_categories_edit=false;
        },
        editCategories: function(){
            this.show_categories_edit=true;
        },
        removeCategory: function(product){
            // remove material from one product
            product.categories=[];
        },
        deleteCategories: function(){
            var selected=this.selected_categories;
            var all_products = this.products;
            var all_items = this.categories_local;

            selected.forEach(function (item) {
                // remove item from all products
                all_products.forEach(function (product) {
                    if(product.categories.indexOf(item.value)> -1){
                        product.categories.splice(product.categories.indexOf(item.value), 1);
                    }
                })
                // remove from dropdown
                if(all_items.indexOf(item)> -1){
                    all_items.splice(all_items.indexOf(item), 1);
                }
            });
            this.selected_categories=[];
        },
        // categories END
        closeEditMaterials: function(){
            this.show_materials_edit=false;
        },
        editMaterials: function(){
            this.show_materials_edit=true;
        },
        saveMaterials: function(){
            var selected_materials=this.selected_materials;
            // set materials to all selected products
            this.products.forEach(function (product) {
                if(product.active){
                    selected_materials.forEach(function (item) {
                        var unique=true;
                        material_value = item.value;
                        product.materials.forEach(function(product_value){
                            if(material_value === product_value){
                                unique=false;
                            }
                        });
                        if(unique){
                            product.materials.push(material_value);
                        }
                    });
                }
            });
        },
        removeMaterial: function(product){
            // remove material from one product
            product.materials=[];
        },
        deleteMaterials: function(){
            var selected_materials=this.selected_materials;
            var all_products = this.products;
            var all_materials = this.materials_local;

            selected_materials.forEach(function (item) {
                // remove item from all products
                all_products.forEach(function (product) {
                    if(product.materials.indexOf(item.value)> -1){
                        product.materials.splice(product.materials.indexOf(item.value), 1);
                    }
                })
                // remove from dropdown
                if(all_materials.indexOf(item)> -1){
                    all_materials.splice(all_materials.indexOf(item), 1);
                }
            });
            this.selected_materials=[];
        },
        closeEditMetatags: function(){
            this.show_metatags_edit=false;
        },
        editMetatags: function(){
            this.show_metatags_edit=true;
        },
        saveMetatags: function(){
            var selected_metatags=this.selected_metatags;
            // set metatags to all selected products
            this.products.forEach(function (product) {
                if(product.active){
                    selected_metatags.forEach(function (metatag) {
                        var unique=true;
                        meta_value = metatag.value;
                        product.metatags.forEach(function(product_meta_value){
                            if(meta_value === product_meta_value){
                                unique=false;
                            }
                        });
                        if(unique){
                            product.metatags.push(meta_value);
                        }
                    });
                }
            });
        },
        removeMetatag: function(product, metatag){
            // remove metatag from one product
            product.metatags.splice(product.metatags.indexOf(metatag), 1);
        },
        deleteMetatags: function(){
            var selected_metatags=this.selected_metatags;
            var all_products = this.products;
            var all_metatags = this.metatags_local;

            selected_metatags.forEach(function (metatag) {
                // remove metatag from all products
                all_products.forEach(function (product) {
                    if(product.metatags.indexOf(metatag.value)> -1){
                        product.metatags.splice(product.metatags.indexOf(metatag.value), 1);
                    }
                })
                // remove from dropdown
                if(all_metatags.indexOf(metatag)> -1){
                    all_metatags.splice(all_metatags.indexOf(metatag), 1);
                }
            });
            this.selected_metatags=[];
        },
        hideMetatagLabel: function(product, metatag, language){
            console.log("Hide this label ...");
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
                            //my_name = product.category.label[language.id];
                            my_name = product.category.label[language.id].value;

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
        },
        debugMe: function(me){
            console.log(me);
        }
    }
})

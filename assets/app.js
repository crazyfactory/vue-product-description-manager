if (typeof api !== 'undefined') {
    // variable needs to come from a local config and holds the path to the api
    var hasApi=true
}
else{
    var hasApi=false
}

var ComponentData=[]
var ComponentConjunction=[]
var Descriptions=[]

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
        var meta_static=[]

        if (MetatagsStatic.content){
            // got stic tags from mock or api
            meta_static = MetatagsStatic.content
        }
        // get the local tags
        var metatags = JSON.parse(localStorage.getItem(STORAGE_KEY_META) || '[]')
        // if no local tags are available: include static tags
        if (metatags.length<1){
            meta_static.forEach(function(metatag){
                metatags.push(metatag)
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
        var material_static=[]

        if (MaterialStatic.content){
            // got statics from mock or api
            material_static = MaterialStatic.content
        }
        // get the local options
        var materials = JSON.parse(localStorage.getItem(STORAGE_KEY_MATERIAL) || '[]')
        // if no local option are available: include statics
        if (materials.length<1){
            material_static.forEach(function(material){
                materials.push(material)
            })
        }
        return materials
    },
    save: function (materials) {
        localStorage.setItem(STORAGE_KEY_MATERIAL, JSON.stringify(materials))
    }
}
// base_product management
var STORAGE_KEY_BASEPRODUCT = 'crazy-base_product'
var base_productStorage = {
    fetch: function () {
        var base_product_static=[]

        if (BaseProductOptions.content){
            // got statics from mock or api
            base_product_static = BaseProductOptions.content
        }
        // get the local options
        var base_product = JSON.parse(localStorage.getItem(STORAGE_KEY_BASEPRODUCT) || '[]')
        // if no local option are available: include statics
        if (base_product.length<1){
            base_product_static.forEach(function(item){
                base_product.push(item)
            })
        }
        return base_product
    },
    save: function (base_product) {
        localStorage.setItem(STORAGE_KEY_BASEPRODUCT, JSON.stringify(base_product))
    }
}
// component management
var STORAGE_KEY_COMPONENT = 'crazy-component'
var componentStorage = {
    fetch: function () {
        var component_static=[]

        if (ComponentOptions.content){
            // got statics from mock or api
            component_static = ComponentOptions.content
        }
        // get the local options
        var components = JSON.parse(localStorage.getItem(STORAGE_KEY_COMPONENT) || '[]')
        // if no local option are available: include statics
        if (components.length<1){
            component_static.forEach(function(item){
                components.push(item)
            })
        }
        return components
    },
    save: function (item) {
        localStorage.setItem(STORAGE_KEY_COMPONENT, JSON.stringify(item))
    }
}

// register components
Vue.component('v-select', VueSelect.VueSelect)
// use non-standard deliters for twig
Vue.config.delimiters = ['[[', ']]']

new Vue({
    el: '#app',
    data: {
        // components local
        components_local:componentStorage.fetch(),
        // base_products local
        base_products_local:base_productStorage.fetch(),
        conjunction:ComponentOptions.conjunction,
        headline: 'Product Names',
        headline_icon:'fa fa-commenting-o',
        isFullScreen:false,
        languages:[
            {
                id:'en-GB',
                status:true,
                flag:'flag-icon-gb',
            },
            {
                id:'de',
                status:true,
                flag:'flag-icon-de',
            }
        ],
        // materials
        materials_local:materialStorage.fetch(),
        // messages local
        messages:messageStorage.fetch(),
        // metatags local
        metatags_local:metatagStorage.fetch(),
        newProduct:'',
        // products
        products:productStorage.fetch(),
        show_actionbar:false,
        show_export: false,
        show_load: true,
        show_base_product_edit:false,
        show_material:false,
        show_materials_edit:false,
        show_metatags: false,
        show_metatags_edit:false,
        show_message: false,
        show_names: true,
        show_preview: false,
        show_settings: false,
        selected_component_1:null,
        selected_component_2:null,
        selected_base_product:null,
        selected_materials:[],
        selected_metatags:[],
        // settings local
        settings:settingStorage.fetch()
    },
    // watch products change for localStorage persistence
    watch: {
        components_local: {
            handler: function (item) {
                componentStorage.save(item)
            },
            deep: true
        },
        base_products_local: {
            handler: function (item) {
                base_productStorage.save(item)
            },
            deep: true
        },
        materials_local: {
            handler: function (materials) {
                materialStorage.save(materials)
            },
            deep: true
        },
        messages: {
            handler: function (messages) {
                messageStorage.save(messages)
            },
            deep: true
        },
        metatags_local: {
            handler: function (metatags) {
                metatagStorage.save(metatags)
            },
            deep: true
        },
        products: {
            handler: function (products) {
                productStorage.save(products)
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
        components:function(){
            my_options={}
            this.components_local.forEach(function(item) {
                my_options[item.value]=item
            })
            return my_options
        },
        component_index:function(){
            return Object.keys(this.components)
        },
        component_objects:function(){
            return Object.values(this.components)
        },
        base_products:function(){
            my_options={}
            this.base_products_local.forEach(function(item) {
                my_options[item.value]=item
            })
            return my_options
        },
        base_product_index:function(){
            return Object.keys(this.base_products)
        },
        base_product_objects:function(){
            return Object.values(this.base_products)
        },
        dirtyProducts: function(){
            dirty=[]
            this.products.forEach(function(product){
                if(product.dirty){
                    dirty.push(product)
                }
            })
            return dirty
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
                this.settings.editorLanguage =language

            },
            get: function(){
                // default fallback = 'de'
                if(!this.settings.editorLanguage){
                    this.settings.editorLanguage = 'en-GB'
                }
                return this.settings.editorLanguage
            }
        },
        hasDirtyProducts: function(){
            var bool = false
            this.products.forEach(function(product){
                if(product.dirty){
                    bool = true
                }
            })
            return bool
        },
        hasEditableProducts: function(){
            var bool = false
            this.products.forEach(function(product){
                if(!product.hidden){
                    bool = true
                }
            })
            return bool
        },
        hasHiddenProducts: function(){
            var bool = false
            this.products.forEach(function(product){
                if(product.hidden){
                    bool = true
                }
            })
            return bool
        },
        isSmallScreen:function(){
            return !this.isFullScreen
        },
        materials:function(){
            my_options={}
            this.materials_local.forEach(function(item) {
                my_options[item.value]=item
            })
            return my_options
        },
        material_index:function(){
            return Object.keys(this.materials)
        },
        material_objects:function(){
            return Object.values(this.materials)
        },
        metatags:function(){
            my_tags={}
            this.metatags_local.forEach(function(metatag) {
                my_tags[metatag.id]=metatag
            })
            return my_tags
        },
        metatag_index:function(){
            return Object.keys(this.metatags)
        },
        metatag_objects:function(){
            return Object.values(this.metatags)
        },
        show_name_scheme_edit:function(){
            if(!this.selected_base_product && !this.selected_component_1 && !this.selected_component_2){
                // no base_product or component is selected
                return false
            }
            else{
                return true
            }
        }
    },
    methods: {
        addEditorLanguage: function(value){
            var setting= {
                editorLanguage:value,
            }
            this.settings=setting
        },
        addMessage: function(message, type){
            var today = moment().format('lll')
            var msg= {
                id:messageStorage.uid++,
                message:message,
                type:type,
                show:true,
                date:today
            }
            this.messages.unshift(msg)

        },
        addProduct: function () {
            var value = this.newProduct && this.newProduct.trim()
            if (!value) {
                return
            }

            // get products from db/api
            if(hasApi){
                // clear product input
                this.newProduct = ''

                api.app=this
                api.data = value
                api.action = 'get_products'
                api.call()
            }
            else
            {
                console.log('no api ... dry hump with api element ')

                var my_products = value.split(" ")
                var my_product_list = []

                my_products.forEach(function(my_product_name){
                    my_product_name=my_product_name.trim()
                    // use fake api response from api.js
                    var random_nr = Math.round(Math.random()*(Object.keys(Api_response).length-1))
                    my_product=Api_response[random_nr]
                    my_product_list.push({
                        active: true,
                        cached_descriptions:my_product.cached_descriptions,
                        cached_materials:my_product.cached_materials,
                        cached_metatags:my_product.cached_metatags,
                        cached_names:my_product.cached_names,
                        component1:null,
                        component2:null,
                        base_product:null,
                        db_id:my_product.db_id,
                        dirty:false,
                        descriptions:my_product.descriptions,
                        hidden:false,
                        id: productStorage.uid++,
                        materials:[],
                        metatags:[],
                        metatagComponent1:[],
                        metatagComponent2:[],
                        metatagBaseProduct:[],
                        metatagMaterial:[],
                        modelCode:my_product_name,
                        name_scheme:null,
                        names:{},
                        properties:my_product.properties,
                        propertyFormula:my_product.propertyFormula
                    })
                })

                this.products = this.products.concat(my_product_list)
                this.newProduct = ''
            }
        },
        autotag: function(autotag, translator){
            if(!autotag){
                return false
            }
            var metatagsGlobal = this.metatags
            var metatagsNew = []
            var metatagsProduct = []
            var languages = this.languages

            if(Array.isArray(autotag)){
                autotag.forEach(function(mytag){
                    if(!metatagsGlobal.hasOwnProperty(mytag)){
                        // metatag doen't exists yet
                        // get Object and convert it to a metatag
                        myTwin=translator[mytag]
                        newTag={
                            alias:{},
                            dirty:true,
                            id:mytag,
                            label:myTwin.label,
                            value:mytag
                        }
                        languages.forEach(function(language){
                            alias={
                                value:[],
                                edit:false,
                                active:true
                            }
                            newTag.alias[language.id]=alias
                        })
                        metatagsNew.push(newTag)
                    }
                    // add to products
                    metatagsProduct.push(mytag)
                })
            }
            else{
                // single autotag instead of array
                // check if autotag already exists
                mytag=autotag.value
                if(!metatagsGlobal.hasOwnProperty(mytag)){
                    myTwin=translator[mytag]
                    newTag={
                        alias:{},
                        dirty:true,
                        id:mytag,
                        label:myTwin.label,
                        value:mytag
                    }
                    languages.forEach(function(language){
                        alias={
                            value:[],
                            edit:false,
                            active:true
                        }
                        newTag.alias[language.id]=alias
                    })
                    metatagsNew.push(newTag)
                }
                // add to products
                metatagsProduct.push(mytag)
            }
            // push new tags to app
            if(metatagsNew.length>0){
                this.metatags_local=this.metatags_local.concat(metatagsNew)
            }
            return metatagsProduct
        },
        clearComponents:function(){
            console.log('Clear local components:')
            console.log(this.components_local)
            this.components_local=[]
            this.components=[]
        },
        clearBaseProducts:function(){
            console.log('Clear local base_products:')
            console.log(this.base_products_local)
            this.base_products_local=[]
            this.base_products=[]
        },
        clearLocalMetatags:function(){
            this.metatags_local = []
        },
        clearMaterials:function(){
            console.log('Clear local materials:')
            console.log(this.materials_local)
            this.materials_local=[]
            this.materials=[]
        },
        clearSettings: function(){
            this.settings={}
        },
        closeEditComponents: function(){
            this.show_components_edit=false
        },
        closeEditBaseProducts: function(){
            this.show_base_product_edit=false
            this.updateNameSchemes()
        },
        closeEditMaterials: function(){
            this.show_materials_edit=false
        },
        closeEditMe: function(item){
            item.edit= false
            item.value= item.value.replace(/\r?\n|\r/g,"")
        },
        closeEditMetatags: function(){
            this.show_metatags_edit=false
        },
        createComponentOption: function(value){
            var option = this.optionFactory(value)
            this.components_local.push(option)
            return option
        },
        createBaseProductOption: function(value){
            var option = this.optionFactory(value)
            this.base_products_local.push(option)
            return option
        },
        createMetatagOption: function(value){
            var option = this.optionFactory(value)
            this.metatags_local.push(option)
            return option
        },
        createMaterialOption: function(value){
            var option = this.optionFactory(value)
            this.materials_local.push(option)
            return option
        },
        debugComponents:function(){
            console.log("Local (app.components_local)")
            console.log(this.components_local)
            console.log("ALL Components (app.components)")
            console.log(this.components)
        },
        debugBaseProducts:function(){
            console.log("Local (app.base_products_local)")
            console.log(this.base_products_local)
            console.log("ALL BaseProducts (app.base_products)")
            console.log(this.base_products)

        },
        debugMaterials:function(){
            console.log("Local (app.materials_local)")
            console.log(this.materials_local)
            console.log("ALL Materials (app.materials)")
            console.log(this.materials)
            console.log('aus die maus')
        },
        debugMetatags:function(){
            console.log("Local (app.metatags_local)")
            console.log(this.metatags_local)
            console.log("ALL Metatags (app.metatags)")
            console.log(this.metatags)
            console.log('ferdsch')
        },
        debugMe: function(me){
            console.log(me)
        },
        debugMessages: function(){
            console.log(this.messages)
        },
        deleteBaseProductsComponents: function(){
            var selected_base_product=this.selected_base_product
            var selected_components=[]
            if(this.selected_component_1){
                selected_components.push(this.selected_component_1)
            }
            if(this.selected_component_2 && this.selected_component_2!=this.selected_component_1) {
                selected_components.push(this.selected_component_2)
            }
            var all_base_products = this.base_products_local
            var all_components = this.components_local
            var all_products = this.products
            var languages = this.languages
            var conjunction = this.conjunction

            all_products.forEach(function(product){
                var changed= false
                if(product.base_product && selected_base_product && product.base_product.value == selected_base_product.value){
                    product.base_product=null
                    changed= true
                }
                selected_components.forEach(function(component){
                    if(product.component1 && product.component1.value == component.value){
                        product.component1=null
                        changed= true
                    }
                    if(product.component2 && product.component2.value == component.value){
                        product.component2=null
                        changed= true
                    }
                })
                if(changed){
                    // generate composed product name for each language
                    product_names={}

                    languages.forEach(function(language){
                        var my_name=''

                        if(product.base_product && product.base_product.label[language.id]){
                            my_name = product.base_product.label[language.id].value
                        }
                        if(product.component1 && product.component1.label[language.id]){
                            my_name = my_name +" "+ conjunction.with[language.id]+ " " +product.component1.label[language.id].value
                        }
                        if(product.component2 && product.component2.label[language.id]){
                            my_name = my_name + " "+ conjunction.and[language.id]+ " " +product.component2.label[language.id].value
                        }
                        product_names[language.id]={
                            edit:false,
                            dirty:true,
                            original_value:my_name,
                            value:my_name
                        }

                    })
                    product.names=product_names
                    product.dirty=true
                }
            })

            // remove base products & components dropdown
            if(all_base_products.indexOf(selected_base_product)> -1){
                all_base_products.splice(all_base_products.indexOf(selected_base_product), 1)
            }
            selected_components.forEach(function(component) {
                if (all_components.indexOf(component) > -1) {
                    all_components.splice(all_components.indexOf(component), 1)
                }
            })
            // unset selected base_product/ component_1, component_2
            this.selected_base_product=null
            this.selected_component_1=null
            this.selected_component_2=null
        },
        deleteMaterials: function(){
            var selected_materials=this.selected_materials
            var all_products = this.products
            var all_materials = this.materials_local

            selected_materials.forEach(function (item) {
                // remove item from all products
                all_products.forEach(function (product) {
                    if(product.materials.indexOf(item.value)> -1){
                        product.materials.splice(product.materials.indexOf(item.value), 1)
                    }
                })
                // remove from dropdown
                if(all_materials.indexOf(item)> -1){
                    all_materials.splice(all_materials.indexOf(item), 1)
                }
            })
            this.selected_materials=[]
        },
        deleteMetatags: function(){
            var selected_metatags=this.selected_metatags
            var all_products = this.products
            var all_metatags = this.metatags_local

            selected_metatags.forEach(function (metatag) {
                // remove metatag from all products
                all_products.forEach(function (product) {
                    if(product.metatags.indexOf(metatag.value)> -1){
                        product.metatags.splice(product.metatags.indexOf(metatag.value), 1)
                    }
                })
                // remove from dropdown
                if(all_metatags.indexOf(metatag)> -1){
                    all_metatags.splice(all_metatags.indexOf(metatag), 1)
                }
            })
            this.selected_metatags=[]
        },
        editComponents: function(){
            this.show_components_edit=true
        },
        editBaseProducts: function(){
            this.show_base_product_edit=true
        },
        editMaterials: function(){
            this.show_materials_edit=true
        },
        editMe: function(item, item_parent){
            item.edit=true
            if(item_parent){
             item_parent.dirty=true
            }
        },
        editMetatags: function(){
            this.show_metatags_edit=true
        },
        exportAllProducts: function(){
            dirtyProducts=this.dirtyProducts

            if(!hasApi){
                productList=[]
                dirtyProducts.forEach(function(product){
                    product.dirty=false
                    productList.push(product.modelCode)
                })
                msg = productList.join(", ")+' were succesfully saved'
                this.addMessage(msg,'success')
            }
        },
        exportProduct: function(product){
            if(!hasApi){
                product.dirty=false
                msg = '"'+product.modelCode+'" was succesfully saved'
                this.addMessage(msg,'success')
            }
        },
        getGeneratedDescription: function(product, language){
            index=this.products.indexOf(product)

            if(hasApi){
                api.app=this
                api.language=language
                api.data = product.propertyFormula
                api.action = 'generate_description'
                api.product_index = index
                api.call()
            }
            else{
                // use fake api response from api.js
                var random_nr = Math.round(Math.random()*(Object.keys(Api_response).length-1))
                console.log('no api ... dry hump with api element nr.'+ random_nr)
                my_product=Api_response[random_nr]
                my_description=my_product.descriptions[language]
                this.products[index].descriptions[language]=my_description
            }
        },
        getOptionLabel: function(item){
            if (typeof item === 'object') {
                if(item.label) {
                    return item.label[this.settings.editorLanguage]
                }
            }
            return item
        },
        getOptionLabelValue: function(item){
            if (typeof item === 'object') {
                if(item.label) {
                    return item.label[this.settings.editorLanguage].value
                }
            }
            return item
        },
        hideMessage: function (message) {
            message.show = false
        },
        hideMetatagLabel: function(product, metatag, language){
            console.log("Hide this label ...")
        },
        hideProduct: function (product) {
            product.hidden = true
            product.active = false
        },
        hideSelectedProducts: function(){
            this.products.forEach(function(product){
                if(product.active) {
                    // hidden products are not active
                    product.active = false
                    product.hidden = true
                }
            })
        },
        invertSelectedlProducts: function(){
            var products = this.products
            products.forEach(function(product){
                product.active=!product.active
            })
        },
        isCustomized: function(product){
            this.languages.forEach(function(language){
                // does the product have a customized name in any language?
              if(product.names[language.id].original_value!=product.names[language.id].value){
                  return true
              }
            })
            return false

        },
        makeActive: function(item){
            // deactivate all
            this.show_names= false
            this.show_metatags= false
            this.show_material=false,
                this.show_export= false
            this.show_preview= false
            this.show_message=false
            this.show_load=true
            this.isFullScreen=false
            this.headline_icon=''

            switch(item){
                case 'names':
                    this.show_names= true
                    this.headline = 'Product Names'
                    this.headline_icon = "fa fa-commenting-o"
                    break
                case 'material':
                    this.show_material= true
                    this.headline = 'Material'
                    this.headline_icon = "fa fa-industry"
                    break
                case 'preview':
                    this.show_preview= true
                    this.headline = 'Preview'
                    this.isFullScreen=true
                    this.headline_icon = "fa fa-eye"
                    break
                case 'metatags':
                    this.show_metatags= true
                    this.headline = 'Metatags'
                    this.headline_icon = "fa fa-tags"
                    break
                case 'export':
                    this.show_export= true
                    this.show_load=false
                    this.headline = 'Save changes'
                    this.isFullScreen=true
                    this.headline_icon = "fa fa-database"
                    break
                case 'admin':
                    this.show_message= true
                    this.show_load=false
                    this.headline = 'Admin Panel'
                    this.headline_icon = "fa fa-user-secret"
                    break
            }
        },
        optionFactory: function(value){
            // no spaces and all lowercase for id/value
            normalized_value = value.replace(/ /g,"_").toLowerCase()
            var value_copy = "";

            var option = {
                id:normalized_value,
                dirty:true,
                value:normalized_value,
                label: {},
                alias: {}
            }

            this.languages.forEach(function(language){
                label={
                    active:true,
                    dirty:true,
                    edit:false,
                    value:value
                }

                alias={
                    active:true,
                    dirty:true,
                    edit:false,
                    value:""
                }

                option.label[language.id]=label
                option.alias[language.id]=alias
            })
            return option
        },
        removeAutoMetatag: function(product, metatag, target){
            //target: 'metatagMaterial'
            product[target].splice(product[target].indexOf(metatag), 1)
        },
        removeMaterial: function(product){
            // remove material from one product
            product.materials=[]
        },
        removeMessage: function(message){
            this.messages.splice(this.messages.indexOf(message), 1)
        },
        removeMessages: function(){
            this.messages=[]
        },
        removeMetatag: function(product, metatag){
            // remove metatag from one product
            product.metatags.splice(product.metatags.indexOf(metatag), 1)
        },
        removeProduct: function (product) {
            this.products.splice(this.products.indexOf(product), 1)
        },
        removeProductName: function(product){
            product.base_product=null
            product.component1=null
            product.component2=null
            product.names=null
            product.dirty=true
        },
        removeSeletedProducts(){
            var keep_products=[]
            this.products.forEach(function(product){
                if(!product.active){
                    keep_products.push(product)
                }
            })
            // delete all products
            this.products = keep_products
        },
        saveMaterials: function(){
            var selected_materials=this.selected_materials
            autotagFactory=this.autotag
            materialsGlobal= this.materials
            // set materials to all selected products
            this.products.forEach(function (product) {
                if(product.active){
                    selected_materials.forEach(function (item) {
                        var unique=true
                        material_value = item.value
                        product.materials.forEach(function(product_value){
                            if(material_value === product_value){
                                unique=false
                            }
                        })
                        if(unique){
                            product.materials.push(material_value)
                            // mark product as dirty
                            product.dirty=true
                        }
                    })
                    // autotag all materials, we expect an Array here (from multiselect)
                    autotag=autotagFactory(product.materials, materialsGlobal)
                    if(autotag){
                        product.metatagMaterial=autotag
                    }
                }
            })
        },
        saveMetatags: function(){
            var selected_metatags=this.selected_metatags
            // set metatags to all selected products
            this.products.forEach(function (product) {
                if(product.active){
                    selected_metatags.forEach(function (metatag) {
                        var unique=true
                        meta_value = metatag.value
                        product.metatags.forEach(function(product_meta_value){
                            if(meta_value === product_meta_value){
                                unique=false
                            }
                        })
                        if(unique){
                            product.metatags.push(meta_value)
                            // mark product as dirty
                            product.dirty=true
                        }
                    })
                }
            })
        },
        saveNameScheme: function(){
            var base_product = this.selected_base_product
            var attr1 = this.selected_component_1
            var attr2 = this.selected_component_2
            var languages = this.languages
            var conjunction = this.conjunction
            var base_products = this.base_products
            var components = this.components
            autotagFactory=this.autotag

            this.products.forEach(function (product) {
                if(product.active){
                    if (typeof base_product == 'object' && base_product !=null && base_product.value != '--'){
                        product.base_product = base_products[base_product.value]
                        autotagBaseProduct=autotagFactory(product.base_product, base_products)
                        if(autotagBaseProduct && product.metatagBaseProduct[0]!=autotagBaseProduct[0]){
                            product.metatagBaseProduct=autotagBaseProduct
                            product.dirty=true
                        }
                    }

                    if(typeof attr1=='object' && attr1!=null && attr1.value!='--'){
                        product.component1=components[attr1.value]
                        autotagComponent1=autotagFactory(product.component1, components)
                        if(autotagComponent1 && product.metatagComponent1[0]!=autotagComponent1[0]){
                            product.metatagComponent1=autotagComponent1
                            product.dirty=true
                        }
                    }

                    if(typeof attr2=='object' && attr2!=null && attr2.value!='--'){
                        product.component2=components[attr2.value]
                        autotagComponent2=autotagFactory(product.component2, components)
                        if(autotagComponent2 && product.metatagComponent2[0]!=autotagComponent2[0]){
                            product.metatagComponent2=autotagComponent2
                            product.dirty=true
                        }
                    }
                    // generate composed product name for each language
                    product_names={}

                    languages.forEach(function(language){
                        var my_name=''

                        if(product.base_product && product.base_product.label[language.id]){
                            my_name = product.base_product.label[language.id].value

                        }
                        if(product.component1 && product.component1.label[language.id]){
                            my_name = my_name +" "+ conjunction.with[language.id]+ " " +product.component1.label[language.id].value

                        }
                        if(product.component2 && product.component2.label[language.id]){
                            my_name = my_name + " "+ conjunction.and[language.id]+ " " +product.component2.label[language.id].value
                        }
                        product_names[language.id]={
                            edit:false,
                            dirty:true,
                            original_value:my_name,
                            value:my_name
                        }

                    })

                    product.names=product_names
                }
            })
        },
        selectAllProducts: function(value){
            var products = this.products
            products.forEach(function(product){
                if(!product.hidden){
                    product.active=value
                } else{
                    // product never active when it is hidden
                    product.active=false
                }

            })
        },
        showAllProducts: function(){
            this.products.forEach(function(product){
                if(product.hidden) {
                    // hidden products are not active
                    product.active = true
                    product.hidden = false
                }else{
                    product.active = false
                }

            })
        },
        toggle_actionbar: function(){
            if(this.products.length>0){
                this.show_actionbar = !this.show_actionbar
            }
            else{
                this.show_actionbar = false
            }
        },
        toggle_language: function(language){
            language.status = !language.status
        },
        toggle_settings: function(){
            this.show_settings = !this.show_settings
        },
        updateNameSchemes:function(){
            // update product names
            var languages = this.languages
            var conjunction = this.conjunction
            var base_products = this.base_products
            var components = this.components

            this.products.forEach(function (product) {
                // generate composed product name for each language
                product_names={}
                languages.forEach(function(language){
                    var my_name=''
                    var org_name=product.names[language.id].value
                    
                    if(product.base_product && base_products[product.base_product.value]){
                        base_products[product.base_product.value].label[language.id].edit=false
                        my_name = base_products[product.base_product.value].label[language.id].value
                    }
                    if(product.component1 && product.component1.label[language.id]){
                        components[product.component1.value].label[language.id].edit=false
                        my_name = my_name +" "+ conjunction.with[language.id]+ " " +components[product.component1.value].label[language.id].value
                    }
                    if(product.component2 && product.component2.label[language.id]){
                        components[product.component2.value].label[language.id].edit=false
                        my_name = my_name +" "+ conjunction.and[language.id]+ " " +components[product.component2.value].label[language.id].value
                    }
                    product_names[language.id]={
                        dirty:true,
                        edit:false,
                        original_value:my_name,
                        value:my_name
                    }
                    if(my_name!=org_name){
                        product.dirty=true
                    }
                })
                product.names=product_names

            })
        },
        removeCustomName:function(item){
            item.value=item.original_value
            item.edit= false
        }
    }
})

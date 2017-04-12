if (typeof api !== 'undefined') {
    // variable needs to come from a local config and holds the path to the api
    var hasApi = true
    // how long is a product kept in local storage? (in ms)
    var validationRange = api.validationRange ? api.validationRange : 86400000
}
else {
    var hasApi = false
    // how long is a product kept in local storage? (in ms)
    var validationRange = 86400000
}

var AppLanguages = [
    {
        id: 'de',
        status: true,
        flag: 'flag-icon-de',
    },
    {
        id: 'en-GB',
        status: true,
        flag: 'flag-icon-gb',
    },
    {
        id: 'en-US',
        status: true,
        flag: 'flag-icon-us',
    },
    {
        id: 'es',
        status: true,
        flag: 'flag-icon-es',
    },
    {
        id: 'fr',
        status: true,
        flag: 'flag-icon-fr',
    },
    {
        id: 'it',
        status: true,
        flag: 'flag-icon-it',
    },
    {
        id: 'nl',
        status: true,
        flag: 'flag-icon-nl',
    },
    {
        id: 'pt',
        status: true,
        flag: 'flag-icon-pt',
    },
    {
        id: 'sv',
        status: true,
        flag: 'flag-icon-se',
    },
    {
        id: 'ru',
        status: true,
        flag: 'flag-icon-ru',
    },
]

var ComponentData = []
var ComponentConjunction = []
var Descriptions = []

/*
 * add products
 */
// localStorage persistence
var STORAGE_KEY = 'crazy-products'
var productStorage = {
    fetch: function () {
        var now = Date.now()
        var products_raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        var products = []
        var cleaned_up = false

        products_raw.forEach(function (product, index) {
            if (product.updated && (now - product.updated) < validationRange) {
                products.push(product)
            }
            else cleaned_up = true
        })
        productStorage.uid = products.length

        if (cleaned_up) localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
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
        var meta_static = []

        if (MetatagsStatic.content) {
            // got static tags from mock or api
            meta_static = MetatagsStatic.content
        }
        // get the local tags
        var metatags = JSON.parse(localStorage.getItem(STORAGE_KEY_META) || '[]')
        // if no local tags are available: include static tags
        if (metatags.length < 1) {
            meta_static.forEach(function (metatag) {
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
        var material_static = []

        if (MaterialStatic.content) {
            // got statics from mock or api
            material_static = MaterialStatic.content
        }
        // get the local options
        var materials = JSON.parse(localStorage.getItem(STORAGE_KEY_MATERIAL) || '[]')
        // if no local option are available: include statics
        if (materials.length < 1) {
            material_static.forEach(function (material) {
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
var baseProductStorage = {
    fetch: function () {

        if (BaseProductOptions.content) {
            // got statics from mock or api
            var base_product_raw = BaseProductOptions.content

        }
        else{
            return [
                {
                    'value':'-',
                    'label':'Nothing found'
                }
            ]
        }
        // get all supported language keys
        var options = []
        // loop through the raw data and convert to the requested format
        for (var i = 0, length_bp = base_product_raw.length; i < length_bp; i++) {
            option_value = base_product_raw[i]['value']

            for (var lk = 0, length_lang=AppLanguages.length; lk < length_lang; lk++) {
                language_code = AppLanguages[lk].id
                if(!options[language_code]){
                    options[language_code] = []
                }

                if(base_product_raw[i]['label'][language_code] && base_product_raw[i]['label'][language_code]['value']){
                    option_label = base_product_raw[i]['label'][language_code]['value']
                }
                else {
                    option_label = base_product_raw[i]['label']['en-GB']['value']
                }

                option = {
                    "active": true,
                    "edit": false,
                    "label": option_label,
                    "value": option_value
                }
                // push newly created option in our select option list
                options[language_code].push(option)
            }
        }
        return options
    },

}


// component management
var STORAGE_KEY_COMPONENT = 'crazy-component'
var componentStorage = {
    fetch: function () {
        var component_static = []

        if (ComponentOptions.content) {
            // got statics from mock or api
            component_static = ComponentOptions.content
        }
        // get the local options
        var components = JSON.parse(localStorage.getItem(STORAGE_KEY_COMPONENT) || '[]')
        // if no local option are available: include statics
        if (components.length < 1) {
            component_static.forEach(function (item) {
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

new Vue({
    el: '#app',
    data: {

        base_products_all: baseProductStorage.fetch(),
        components_local: componentStorage.fetch(),
        conjunction: ComponentOptions.conjunction,
        headline: 'Product Names',
        headline_icon: 'fa fa-commenting-o',
        isFullScreen: false,
        languages: AppLanguages,
        languages_autodescription: ['de', 'en-GB', 'en-US', 'es'],
        // materials
        materials_local: materialStorage.fetch(),
        // messages local
        messages: messageStorage.fetch(),
        // metatags local
        metatags_local: metatagStorage.fetch(),
        newProduct: '',
        // Preview filter
        preview_filter_description: true,
        preview_filter_material: true,
        preview_filter_metatag: true,
        preview_filter_name: true,
        products: productStorage.fetch(),
        show_actionbar: false,
        show_export: false,
        show_load: true,
        show_base_product_edit: false,
        show_material: false,
        show_materials_edit: false,
        show_metatags: false,
        show_metatags_edit: false,
        show_message: false,
        show_names: true,
        show_preview: false,
        show_settings: false,
        selected_component_1: null,
        selected_component_2: null,
        selected_base_product: null,
        selected_materials: [],
        selected_metatags: [],
        // settings local
        settings: settingStorage.fetch()
    },
    delimiters: ['[[', ']]'],
    // watch products change for localStorage persistence
    watch: {
        components_local: {
            handler: function (item) {
                componentStorage.save(item)
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
        base_product_options: {
            get:function () {
                return this.base_products_all[this.settings.editorLanguage]
            },
            set:function(option){
                base_products_all = this.base_products_all
                console.log(this.base_products_all)
                this.languages.forEach(function(language){
                    base_products_all[language.id].push(option)
                })

                console.log(this.base_products_all)
            }
        },
        components: function () {
            my_options = {}
            this.components_local.forEach(function (item) {
                my_options[item.value] = item
            })
            return my_options
        },
        component_index: function () {
            return Object.keys(this.components)
        },
        component_objects: function () {
            return Object.values(this.components)
        },
        dirtyProducts: function () {
            dirty = []
            this.products.forEach(function (product) {
                if (product.dirty) {
                    dirty.push(product)
                }
            })
            return dirty
        },
        editorLanguage: {
            set: function (language) {
                this.settings.editorLanguage = language

            },
            get: function () {
                // default fallback = 'de'
                if (!this.settings.editorLanguage) {
                    this.settings.editorLanguage = 'en-GB'
                }
                return this.settings.editorLanguage
            }
        },
        hasDirtyProducts: function () {
            var bool = false
            this.products.forEach(function (product) {
                if (product.dirty) {
                    bool = true
                }
            })
            return bool
        },
        hasEditableProducts: function () {
            var bool = false
            this.products.forEach(function (product) {
                if (!product.hidden) {
                    bool = true
                }
            })
            return bool
        },
        hasHiddenProducts: function () {
            var bool = false
            this.products.forEach(function (product) {
                if (product.hidden) {
                    bool = true
                }
            })
            return bool
        },
        hasProducts: function () {
            return this.products.length > 0 ? true : false
        },
        isSmallScreen: function () {
            return !this.isFullScreen
        },
        materials: function () {
            var my_options = {}
            this.materials_local.forEach(function (item) {
                my_options[item.value] = item
            })
            return my_options
        },
        material_index: function () {
            return Object.keys(this.materials)
        },
        material_objects: function () {
            return Object.values(this.materials)
        },
        messages_danger: function () {
            var messages = []
            this.messages.forEach(function (message) {
                if (message.type === 'danger') {
                    messages.push(message)
                }
            })
            return messages
        },
        messages_success: function () {
            var messages = []
            this.messages.forEach(function (message) {
                if (message.type === 'success') {
                    messages.push(message)
                }
            })
            return messages
        },
        messages_to_show: function () {
            var messages = []
            this.messages.forEach(function (message) {
                if (message.show === true) {
                    messages.push(message)
                }
            })
            return messages
        },
        metatags: function () {
            my_tags = {}
            this.metatags_local.forEach(function (metatag) {
                my_tags[metatag.value] = metatag
            })
            return my_tags
        },
        metatag_index: function () {
            return Object.keys(this.metatags)
        },
        metatag_objects: function () {
            return Object.values(this.metatags)
        },
        products_dirty: function () {
            var products = []
            this.products.forEach(function (product) {
                if (product.dirty === true) {
                    products.push(product)
                }
            })
            return products
        },
        products_visible: function () {
            var products = []
            this.products.forEach(function (product) {
                if (product.hidden === false) {
                    products.push(product)
                }
            })
            return products
        },
        show_name_scheme_edit: function () {
            if (!this.selected_base_product && !this.selected_component_1 && !this.selected_component_2) {
                // no base_product or component is selected
                return false
            }
            else {
                return true
            }
        }
    },
    methods: {
        addEditorLanguage: function (value) {
            var setting = {
                editorLanguage: value,
            }
            this.settings = setting
        },
        addMessage: function (message, type) {
            var today = moment().format('lll')
            var msg = {
                id: messageStorage.uid++,
                message: message,
                type: type,
                show: true,
                date: today
            }
            this.messages.unshift(msg)

        },
        addProduct: function () {
            var value = this.newProduct && this.newProduct.trim()
            if (!value) {
                return
            }
            // reset all selectboxes
            this.clearSelectBoxes()

            // get products from db/api
            if (hasApi) {
                // clear product input
                this.newProduct = ''

                api.app = this
                api.data = value
                api.action = 'get_products'
                api.call()
            }
            else {
                var my_products = value.split(" ")
                var my_product_list = []

                my_products.forEach(function (my_product_name) {
                    my_product_name = my_product_name.trim()
                    // use fake api response from api.js
                    var random_nr = Math.round(Math.random() * (Object.keys(Api_response).length - 1))
                    if (random_nr > 0) random_nr = random_nr - 1
                    my_product = Api_response[random_nr]
                    my_product_list.push({
                        active: true,
                        cached_descriptions: my_product.cached_descriptions,
                        cached_materials: my_product.cached_materials,
                        cached_metatags: my_product.cached_metatags,
                        cached_names: my_product.cached_names,
                        component1: null,
                        component2: null,
                        base_product: null,
                        db_id: my_product.db_id,
                        detailsLink: my_product.details_link,
                        dirty: false,
                        descriptions: my_product.descriptions,
                        hidden: false,
                        id: productStorage.uid++,
                        materials: [],
                        metatags: [],
                        modelCode: my_product_name,
                        names: {},
                        productImage: my_product.product_image,
                        properties: my_product.properties,
                        propertyFormula: my_product.propertyFormula,
                        updated: Date.now()
                    })
                })

                this.products = this.products.concat(my_product_list)
                this.newProduct = ''
            }
        },
        clearAll: function () {
            this.components_local = []
            this.components = []
            //this.base_products_local = []
            this.base_products = []
            this.metatags_local = []
            this.materials_local = []
            this.materials = []
            msg = "All local settings for Base Prducts, Components, Materials and Metatags are cleared now. Please use your browser reload to restart the App."
            this.addMessage(msg, 'success')

        },
        clearSettings: function () {
            this.settings = {}
        },
        clearSelectBoxes: function () {
            this.selected_component_1 = null
            this.selected_component_2 = null
            this.selected_base_product = null
            this.selected_materials = []
            this.selected_metatags = []
        },
        closeEditComponents: function () {
            this.show_components_edit = false
        },
        closeEditBaseProducts: function () {
            this.show_base_product_edit = false
            if (hasApi) {
                data = {}
                data.base_product = this.selected_base_product
                data.component = [this.selected_component_1, this.selected_component_2]
                api.app = this
                api.data = data
                api.action = 'update_base_product_component'
                api.call()
            }
            this.updateNameSchemes()

        },
        closeEditMaterials: function () {
            if (hasApi) {
                api.app = this
                api.data = this.selected_materials
                api.action = 'update_material'
                api.call()
            }
            this.show_materials_edit = false
        },
        closeEditMe: function (item) {
            item.edit = false
            item.value = item.value.replace(/\r?\n|\r/g, "")
        },
        closeEditMetatags: function () {
            if (hasApi) {
                api.app = this
                api.data = this.selected_metatags
                api.action = 'update_metatag'
                api.call()
            }
            this.show_metatags_edit = false
        },
        createComponentOption: function (value) {
            var option = this.optionFactory(value)
            this.components_local.push(option)
            if (hasApi) {
                api.app = this
                api.data = option
                api.action = 'create_component'
                api.call()
            }
            return option
        },
        createBaseProductOption: function (value) {
            // create a new option in the BaseProduct select box
            var option = this.optionFactory(value)

            // computed property with custom setter
            this.base_product_options = option
            /*
            if (hasApi) {
                api.app = this
                api.data = option
                api.action = 'create_base_product'
                api.call()
            }
            */
            return option
        },
        createMetatagOption: function (value) {
            var option = this.optionFactory(value)
            this.metatags_local.push(option)

            if (hasApi) {
                api.app = this
                api.data = option
                api.action = 'create_metatag'
                api.call()
            }

            return option
        },
        createMaterialOption: function (value) {
            var option = this.optionFactory(value)
            this.materials_local.push(option)
            if (hasApi) {
                api.app = this
                api.data = option
                api.action = 'create_material'
                api.call()
            }
            return option
        },
        deactivateMessages: function () {
            this.messages.forEach(function (message) {
                message.show = false
            })
        },
        debugComponents: function () {
            console.log("Local (app.components_local)")
            console.log(this.components_local)
            console.log("ALL Components (app.components)")
            console.log(this.components)
        },
        debugBaseProducts: function () {
            console.log("ALL BaseProducts (app.base_products)")
            console.log(this.base_products)

        },
        debugMaterials: function () {
            console.log("Local (app.materials_local)")
            console.log(this.materials_local)
            console.log("ALL Materials (app.materials)")
            console.log(this.materials)
            console.log('aus die maus')
        },
        debugMetatags: function () {
            console.log("Local (app.metatags_local)")
            console.log(this.metatags_local)
            console.log("ALL Metatags (app.metatags)")
            console.log(this.metatags)
            console.log('ferdsch')
        },
        debugMe: function (me) {
            console.log(me)
        },
        debugMessages: function () {
            console.log(this.messages)
        },
        deleteBaseProductsComponents: function () {
            var selected_base_product = this.selected_base_product
            var selected_components = []
            if (this.selected_component_1) {
                selected_components.push(this.selected_component_1)
            }
            if (this.selected_component_2 && this.selected_component_2 != this.selected_component_1) {
                selected_components.push(this.selected_component_2)
            }
            var all_base_products = this.base_products_local
            var all_components = this.components_local
            var all_products = this.products
            var languages = this.languages
            var conjunction = this.conjunction

            all_products.forEach(function (product) {
                var changed = false
                if (product.base_product && selected_base_product && product.base_product.value == selected_base_product.value) {
                    product.base_product = null
                    changed = true
                }

                selected_components.forEach(function (component) {
                    if (product.component1 && product.component1.value == component.value) {
                        product.component1 = null
                        changed = true
                    }
                    if (product.component2 && product.component2.value == component.value) {
                        product.component2 = null
                        changed = true
                    }
                })
                if (changed) {
                    // generate composed product name for each language
                    product_names = {}

                    languages.forEach(function (language) {
                        var my_name = ''

                        if (product.base_product && product.base_product.label[language.id]) {
                            my_name = product.base_product.label[language.id].value
                        }
                        if (product.component1 && product.component1.label[language.id]) {
                            my_name = my_name + " " + conjunction.with[language.id] + " " + product.component1.label[language.id].value
                        }
                        if (product.component2 && product.component2.label[language.id]) {
                            my_name = my_name + " " + conjunction.and[language.id] + " " + product.component2.label[language.id].value
                        }
                        product_names[language.id] = {
                            edit: false,
                            dirty: true,
                            original_value: my_name,
                            value: my_name
                        }
                    })
                    product.names = product_names
                    product.dirty = true
                }
            })

            // remove base products & components dropdown
            if (all_base_products.indexOf(selected_base_product) > -1) {
                all_base_products.splice(all_base_products.indexOf(selected_base_product), 1)
            }
            selected_components.forEach(function (component) {
                if (all_components.indexOf(component) > -1) {
                    all_components.splice(all_components.indexOf(component), 1)
                }
            })
            // unset selected base_product/ component_1, component_2
            this.selected_base_product = null
            this.selected_component_1 = null
            this.selected_component_2 = null
        },
        deleteMaterials: function () {
            var selected_materials = this.selected_materials
            var all_products = this.products
            var all_materials = this.materials_local

            selected_materials.forEach(function (item) {
                // remove item from all products
                all_products.forEach(function (product) {
                    if (product.materials.indexOf(item.value) > -1) {
                        product.materials.splice(product.materials.indexOf(item.value), 1)
                        product.dirty = true
                    }
                })
                // remove from dropdown
                if (all_materials.indexOf(item) > -1) {
                    all_materials.splice(all_materials.indexOf(item), 1)
                }
            })
            this.selected_materials = []
        },
        deleteMetatags: function () {
            var selected_metatags = this.selected_metatags
            var all_products = this.products
            var all_metatags = this.metatags_local

            selected_metatags.forEach(function (metatag) {
                // remove metatag from all products
                all_products.forEach(function (product) {
                    if (product.metatags.indexOf(metatag.value) > -1) {
                        product.metatags.splice(product.metatags.indexOf(metatag.value), 1)
                    }
                })
                // remove from dropdown
                if (all_metatags.indexOf(metatag) > -1) {
                    all_metatags.splice(all_metatags.indexOf(metatag), 1)
                }
            })
            this.selected_metatags = []
        },
        editComponents: function () {
            this.show_components_edit = true
        },
        editBaseProducts: function () {
            this.show_base_product_edit = true
        },
        editMaterials: function () {
            this.show_materials_edit = true
        },
        editMe: function (item, item_parent) {
            item.edit = true
            if (item_parent) {
                item_parent.dirty = true
            }
        },
        editMetatags: function () {
            this.show_metatags_edit = true
        },
        exportAllProducts: function () {
            dirtyProducts = this.dirtyProducts

            if (!hasApi) {
                productList = []
                dirtyProducts.forEach(function (product) {
                    product.dirty = false
                    productList.push(product.modelCode)
                })
                msg = productList.join(", ") + ' were succesfully saved'
                this.addMessage(msg, 'success')
            }
            else {
                me = this
                dirtyProducts.forEach(function (product) {
                    me.exportProduct(product)
                })
            }
        },
        exportProduct: function (product) {
            dict_materials = this.materials
            dict_metatags = this.metatags

            // localize materials
            localized_materials = {}
            localized_metatags = {}
            export_languages = []
            this.languages.forEach(function (language) {
                if (language.status) {
                    export_languages.push(language.id)
                    localized_materials[language.id] = []
                    localized_metatags[language.id] = []
                    for (var i = 0; i < product.materials.length; i++) {
                        if (dict_materials[product.materials[i]] && dict_materials[product.materials[i]].label[language.id]) {
                            localized_materials[language.id].push(dict_materials[product.materials[i]].label[language.id].value)
                        }
                    }
                    for (var i = 0; i < product.metatags.length; i++) {
                        if (dict_metatags[product.metatags[i]]) {
                            metatag = dict_metatags[product.metatags[i]]
                            my_label = metatag.label[language.id].value
                            if (metatag.invisible) {
                                my_label = "-" + my_label
                            }
                            localized_metatags[language.id].push(my_label)
                            // add alias
                            my_aliases = metatag.alias[language.id].value
                            if (typeof my_aliases == 'object') {
                                my_aliases = ""
                            }

                            alias_array = my_aliases.split(',')

                            if (alias_array) {
                                alias_array.forEach(function (alias) {
                                    alias = alias.trim()
                                    if (alias.length > 0) {
                                        localized_metatags[language.id].push("-" + alias)
                                    }
                                })
                            }
                        }
                    }
                }
            })
            product['localized_materials'] = localized_materials
            product['localized_metatags'] = localized_metatags
            product['export_languages'] = export_languages

            if (!hasApi) {
                product.dirty = false
                product.updated = Date.now()
                msg = '"' + product.modelCode + '" was succesfully saved'
                this.addMessage(msg, 'success')
            }
            else {
                api.app = this
                api.data = product
                api.action = 'save_product'
                api.call()
            }
        },
        getGeneratedDescription: function (product, language) {
            index = this.products.indexOf(product)
            product.dirty = true

            if (hasApi) {
                api.app = this
                api.language = language
                api.data = product.propertyFormula
                api.action = 'generate_description'
                api.product_index = index
                api.call()
            }
            else {
                // use fake api response from api.js
                var random_nr = Math.round(Math.random() * (Object.keys(Api_response).length - 1))
                my_product = Api_response[random_nr]
                my_description = my_product.descriptions[language]
                this.products[index].descriptions[language] = my_description
            }
        },
        getOptionLabel: function (item) {
            if (typeof item === 'object') {
                if (item.label) {
                    return item.label[this.settings.editorLanguage]
                }
            }
            return item
        },
        getOptionLabelValue: function (item) {
            return 'brainiac'

            if (typeof item === 'object') {
                if (item.label) {
                    if (typeof item.label[this.settings.editorLanguage] === 'undefined') {
                        return item.label['en-GB'].value
                    }
                    return item.label[this.settings.editorLanguage].value
                }
            }
            return item
        },
        hideMessage: function (message) {
            message.show = false
        },
        hideProduct: function (product) {
            product.hidden = true
            product.active = false
        },
        hideSelectedProducts: function () {
            this.products.forEach(function (product) {
                if (product.active) {
                    // hidden products are not active
                    product.active = false
                    product.hidden = true
                }
            })
        },
        invertSelectedlProducts: function () {
            var products = this.products
            products.forEach(function (product) {
                product.active = !product.active
            })
        },
        isCustomized: function (product) {
            this.languages.forEach(function (language) {
                // does the product have a customized name in any language?
                if (product.names[language.id].original_value != product.names[language.id].value) {
                    return true
                }
            })
            return false

        },
        makeActive: function (item) {
            // deactivate all
            this.show_names = false
            this.show_metatags = false
            this.show_material = false,
                this.show_export = false
            this.show_preview = false
            this.show_message = false
            this.show_load = true
            this.isFullScreen = false
            this.headline_icon = ''

            switch (item) {
                case 'names':
                    this.show_names = true
                    this.headline = 'Product Names'
                    this.headline_icon = "fa fa-commenting-o"
                    break
                case 'material':
                    this.show_material = true
                    this.headline = 'Material'
                    this.headline_icon = "fa fa-industry"
                    break
                case 'preview':
                    this.show_preview = true
                    this.headline = 'Preview'
                    this.isFullScreen = true
                    this.headline_icon = "fa fa-eye"
                    this.show_actionbar = true
                    break
                case 'metatags':
                    this.show_metatags = true
                    this.headline = 'Metatags'
                    this.headline_icon = "fa fa-tags"
                    break
                case 'export':
                    this.show_export = true
                    this.show_load = false
                    this.headline = 'Save changes'
                    this.isFullScreen = true
                    this.headline_icon = "fa fa-database"
                    break
                case 'admin':
                    this.show_message = true
                    this.show_load = false
                    this.headline = 'Admin Panel'
                    this.headline_icon = "fa fa-user-secret"
                    break
            }
        },
        optionFactory: function (value) {
            // no spaces and all lowercase for id/value
            normalized_value = value.replace(/ /g, "_").toLowerCase()

            var option = {
                alias: {},
                dirty: true,
                id: normalized_value,
                invisible: false,
                label: value,
                new: true,
                value: normalized_value,
            }

            return option
        },
        invisibleMetatags: function () {
            var all_products = this.products
            this.selected_metatags.forEach(function (metatag) {
                metatag.invisible = true
                all_products.forEach(function (product) {
                    if (product.metatags.indexOf(metatag.value) > -1) {
                        product.dirty = true
                    }
                })
            })

            if (hasApi) {
                // make it persistent in DB
                api.app = this
                api.data = this.selected_metatags
                api.action = 'invisible_metatags'
                api.call()
            }
        },
        removeMaterial: function (product) {
            // remove material from one product
            product.dirty = true
            product.materials = []
        },
        removeMessage: function (message) {
            this.messages.splice(this.messages.indexOf(message), 1)
        },
        removeMessages: function () {
            this.messages = []
        },
        removeMetatag: function (product, metatag) {
            // remove metatag from one product
            product.dirty = true
            product.metatags.splice(product.metatags.indexOf(metatag), 1)
        },
        removeProduct: function (product) {
            this.products.splice(this.products.indexOf(product), 1)
        },
        removeProductName: function (product) {
            product.base_product = null
            product.component1 = null
            product.component2 = null
            product.names = null
            product.dirty = true
        },
        removeSeletedProducts: function () {
            var keep_products = []
            this.products.forEach(function (product) {
                if (!product.active) {
                    keep_products.push(product)
                }
            })
            // delete all products
            this.products = keep_products
        },
        saveMaterials: function () {
            var selected_materials = this.selected_materials
            var clear_materials = false
            materialsGlobal = this.materials
            // set materials to all selected products
            this.products.forEach(function (product) {
                if (product.active) {
                    selected_materials.forEach(function (item) {
                        var unique = true
                        material_value = item.value
                        if (material_value === "-") {
                            clear_materials = true
                        }
                        if (!clear_materials) {
                            product.materials.forEach(function (product_value) {
                                if (material_value === product_value) {
                                    unique = false
                                }
                            })
                            if (unique) {
                                product.materials.push(material_value)
                                // mark product as dirty
                                product.dirty = true
                            }
                        }
                    })
                    if (clear_materials) {
                        product.materials = []
                        product.dirty = true
                    }
                }
            })
            this.selected_materials = []
        },
        saveMetatags: function () {
            var selected_metatags = this.selected_metatags
            var clear_metatags = false
            // set metatags to all selected products
            this.products.forEach(function (product) {
                if (product.active) {
                    selected_metatags.forEach(function (metatag) {
                        var unique = true
                        meta_value = metatag.value
                        if (meta_value === "-") {
                            clear_metatags = true
                        }
                        if (!clear_metatags) {
                            product.metatags.forEach(function (product_meta_value) {
                                if (meta_value === product_meta_value) {
                                    unique = false
                                }
                            })
                            if (unique) {
                                product.metatags.push(meta_value)
                                // mark product as dirty
                                product.dirty = true
                            }
                        }
                    })
                    if (clear_metatags) {
                        product.metatags = []
                        product.dirty = true
                    }
                }
            })
            this.selected_metatags = []

        },
        saveNameScheme: function () {
            var base_product = this.selected_base_product
            var clear_base_product = false
            var attr1 = this.selected_component_1
            var clear_attr1 = false
            var attr2 = this.selected_component_2
            var clear_attr2 = false
            var languages = this.languages
            var conjunction = this.conjunction
            var base_products = this.base_products
            var components = this.components

            this.products.forEach(function (product) {
                if (product.active) {
                    if (typeof base_product == 'object' && base_product != null) {
                        if (base_product.value === "-") {
                            product.base_product = null
                            clear_base_product = true
                        }
                        else {
                            product.base_product = base_products[base_product.value]
                        }
                        product.dirty = true
                    }

                    if (typeof attr1 == 'object' && attr1 != null) {
                        if (attr1.value === '-') {
                            product.component1 = null
                            clear_attr1 = true
                        }
                        else {
                            product.component1 = components[attr1.value]
                        }
                        product.dirty = true
                    }

                    if (typeof attr2 == 'object' && attr2 != null) {
                        if (attr2.value === '-') {
                            product.component2 = null
                            clear_attr2 = true
                        }
                        else {
                            product.component2 = components[attr2.value]
                        }
                        product.dirty = true
                    }
                    // generate composed product name for each language
                    product_names = {}

                    languages.forEach(function (language) {
                        var my_name = ''

                        if (product.base_product && product.base_product.label && product.base_product.label[language.id]) {
                            if (product.base_product.label[language.id].value != "-") {
                                my_name = product.base_product.label[language.id].value
                            }

                            product.dirty = true
                        }
                        if (product.component1 && product.component1.label && product.component1.label[language.id]) {
                            if (product.component1.label[language.id].value != "-") {
                                var with_conjunction = ''
                                if (my_name.length > 0) {
                                    with_conjunction = " " + conjunction.with[language.id] + " "
                                }

                                my_name = my_name + with_conjunction + product.component1.label[language.id].value
                            }
                            product.dirty = true

                        }
                        if (product.component2 && product.component2.label && product.component2.label[language.id]) {
                            if (product.component2.label[language.id].value != "-") {
                                var and_conjunction = ''
                                if (my_name.length > 0) {
                                    and_conjunction = " " + conjunction.and[language.id] + " "
                                }

                                my_name = my_name + and_conjunction + product.component2.label[language.id].value
                            }
                            product.dirty = true
                        }
                        product_names[language.id] = {
                            edit: false,
                            dirty: true,
                            original_value: my_name,
                            value: my_name
                        }

                    })

                    product.names = product_names
                }
            })

            this.selected_base_product = null
            this.selected_component_1 = null
            this.selected_component_2 = null
        },
        selectAllProducts: function (value) {
            var products = this.products
            products.forEach(function (product) {
                if (!product.hidden) {
                    product.active = value
                } else {
                    // product never active when it is hidden
                    product.active = false
                }

            })
        },
        showAllProducts: function () {
            this.products.forEach(function (product) {
                if (product.hidden) {
                    // hidden products are not active
                    product.active = true
                    product.hidden = false
                } else {
                    product.active = false
                }

            })
        },
        switchMe: function (name) {
            this[name] = !this[name]
        },
        toggle_language: function (language) {
            language.status = !language.status
        },
        toggle_settings: function () {
            this.show_settings = !this.show_settings
        },
        updateNameSchemes: function () {
            // update product names
            var languages = this.languages
            var conjunction = this.conjunction
            var base_products = this.base_products
            var components = this.components
            var updated = false

            this.products.forEach(function (product) {
                // generate composed product name for each language
                product_names = {}

                languages.forEach(function (language) {
                    if (product.names[language.id]) {
                        var my_name = ''
                        var org_name = ''
                        if (product.names && product.names[language.id] && product.names[language.id].value) {
                            org_name = product.names[language.id].value
                            updated = true
                        }
                        if (product.base_product && base_products[product.base_product.value]) {
                            base_products[product.base_product.value].label[language.id].edit = false
                            if (base_products[product.base_product.value].label[language.id].value) {
                                my_name = base_products[product.base_product.value].label[language.id].value
                                updated = true
                            }
                        }
                        if (product.component1 && product.component1.label[language.id]) {
                            components[product.component1.value].label[language.id].edit = false
                            my_name = my_name + " " + conjunction.with[language.id] + " " + components[product.component1.value].label[language.id].value
                            updated = true
                        }
                        if (product.component2 && product.component2.label[language.id]) {
                            components[product.component2.value].label[language.id].edit = false
                            my_name = my_name + " " + conjunction.and[language.id] + " " + components[product.component2.value].label[language.id].value
                            updated = true
                        }
                        product_names[language.id] = {
                            dirty: true,
                            edit: false,
                            original_value: my_name,
                            value: my_name
                        }
                        if (my_name != org_name) {
                            product.dirty = true
                        }
                    }
                })
                product.names = product_names
            })
        },
        removeCustomName: function (item) {
            item.value = item.original_value
            item.edit = false
        },
        visibleMetatags: function () {
            var all_products = this.products;
            this.selected_metatags.forEach(function (metatag) {
                metatag.invisible = false
                all_products.forEach(function (product) {
                    if (product.metatags.indexOf(metatag.value) > -1) {
                        product.dirty = true
                    }
                })
            })
            if (hasApi) {
                // make it persistent in DB
                api.app = this
                api.data = this.selected_metatags
                api.action = 'visible_metatags'
                api.call()
            }
        },
    }
})

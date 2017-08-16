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
        id: 'nl',
        status: true,
        flag: 'flag-icon-nl',
    },

]

/*
 * prepares our fetched data for in app use
 * sets 'en_GB' as default value
 * introduces search index
 */
function storage_helper(data) {
    var response = []
    var default_value = ''
    data.forEach(function (option, index) {
        if (option && option['label'] && option['label']['en-GB'] && option['label']['en-GB']['value']) {
            default_value = option['label']['en-GB']['value']
        }
        else {
            //skip iteration if we dont have default value
            return
        }


        option['search'] = default_value
        for (var language in option.label) {
            if (option.label.hasOwnProperty(language)) {
                if (!option.label[language]['value']) {
                    option.label[language]['value'] = default_value
                }
            }
        }
        response.push(option)
    })
    return response
}

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
        if (typeof settings.supportedLanguages == 'undefined') {
            settings.supportedLanguages = AppLanguages
        }
        return settings
    },
    save: function (settings) {
        localStorage.setItem(STORAGE_KEY_SETTING, JSON.stringify(settings))
    }
}



new Vue({
    el: '#app',
    components: {
        Multiselect: window.VueMultiselect.default
    },
    data: {
        // new multiselect props
        selectedBaseProduct: null,
        selectedComponent1: null,
        selectedComponent2: null,
        selectedMaterials: [],
        selectedMetatags: [],
        selectedProductFilterIndex: null,
        selectedProducts: [],

        conjunction: ComponentOptions.conjunction,
        headline: 'Product Names',
        headline_icon: 'fa fa-commenting-o',
        isFullScreen: false,
        isLoading: false,
        languages_autodescription: ['de', 'en-GB', 'en-US', 'es'],
        messages: messageStorage.fetch(),
        newProduct: '',
        // Preview filter
        preview_filter_description: true,
        preview_filter_material: true,
        preview_filter_metatag: true,
        preview_filter_name: true,
        products: productStorage.fetch(),
        remove_mode_material: false,
        remove_mode_metatag: false,
        show_actionbar: false,
        show_export: false,
        show_load: true,
        show_material: false,
        show_metatags: false,
        show_message: false,
        show_names: true,
        show_preview: false,
        show_settings: false,
        show_translations: false,
        show_translation_base_products: false,
        show_translation_components: false,
        show_translation_materials: false,
        show_translation_metatags: false,
        show_translation_descriptions: false,

        sortKey: 'value',
        reverse: false,
        columns: [
            {
                title: 'Value',
                name: 'value',
            editable: true,

                    },
                    {
                title: 'de',
                name: "label['de']['value']",
                renderfunction: function (colname, entry) {

                    if (typeof entry.label['de'] === "undefined") {
                        return ''
                    }

                    return entry.label['de']['value']
                    },
                    },
                    {
                title: 'en-GB',
                name: "label['en-GB']['value']",
                renderfunction: function (colname, entry) {
                    if (typeof entry.label['en-GB'] === "undefined") {
                        return ''
                    }
                    return entry.label['en-GB']['value']
                }

                    },
                    {
                title: 'en-US',
                name: "label['en-US']['value']",
                editable: true,
                renderfunction: function (colname, entry) {
                    if (typeof entry.label['en-US'] === "undefined") {
                        return ''
                    }
                    return entry.label['en-US']['value']
            }
        }

        ],

        settings: settingStorage.fetch()
    },
    delimiters: ['[[', ']]'],
    // watch products change for localStorage persistence
    watch: {
        messages: {
            handler: function (messages) {
                messageStorage.save(messages)
            },
            deep: true
        },
        products: {
            handler: function (products) {
                productStorage.save(products)
            },
            deep: true
        }
    },
    computed: {
        optionsBaseProduct: function (){
            currentLanguage = this.editorLanguage
            stash = []

            BaseProductOptions.content.forEach(function (item) {
                search = item[currentLanguage]
                if (item.is_active==1){
                    item['search']=search
                    stash.push(item)
                }
            })
            return stash
        },
        optionsComponent: function (){
            stash = []
            currentLanguage = this.editorLanguage

            ComponentOptions.content.forEach(function (item) {
                search = item[currentLanguage]
                if (item.is_active==1){
                    item['search']=search
                    stash.push(item)
                }
            })
            return stash
        },
        optionsMaterial: function (){
            stash = []
            currentLanguage = this.editorLanguage

            MaterialOptions.content.forEach(function (item) {
                search = item[currentLanguage]
                if (item.is_active==1){
                    item['search']=search
                    stash.push(item)
                }
            })
            return stash
        },
        optionsMetatag: function (){
            stash = []
            currentLanguage = this.editorLanguage

            MetatagOptions.content.forEach(function (item) {
                search = item[currentLanguage]
                if (item.is_active==1){
                    item['search']=search
                    stash.push(item)
                }
            })
            return stash
        },
        baseProducts: function () {
            stash = {}

            this.optionsBaseProduct.forEach(function (item) {
                stash[item.value] = item
            })
            return stash
        },
        components: function () {
            stash = {}
            this.optionsComponent.forEach(function (item) {
                stash[item.value] = item
            })
            return stash
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
                settingStorage.save(this.settings)

            },
            get: function () {
                if (!this.settings.editorLanguage) {
                    this.settings.editorLanguage = 'en-GB'
                }
                return this.settings.editorLanguage
            }
        },
        supportedLanguages: {
            set: function (languages) {
                this.settings.supportedLanguages = languages

            },
            get: function () {
                if (!this.settings.supportedLanguages) {
                    this.settings.supportedLanguages = AppLanguages
                }
                return this.settings.supportedLanguages
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
            materials = {}
            this.optionsMaterial.forEach(function (item) {
                materials[item.value] = item
            })
            return materials
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
            metatags = {}
            this.optionsMetatag.forEach(function (metatag) {
                metatags[metatag.value] = metatag
            })
            return metatags
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
        translationsBaseProducts: function () {
            if (BaseProductOptions && BaseProductOptions.content) {
                var response = []

                console.log(BaseProductOptions.content);
                BaseProductOptions.content.forEach(function (option, index) {
                    var bp = {}
                    bp.value = option.value
                    bp.type = 'base_product'

                    for (var language in option.label) {
                        if (option.label.hasOwnProperty(language)) {
                            if (!option.label[language]['value']) {
                                option.label[language]['value'] = default_value
                            }
                        }
                    }
                    response.push(option)
                })
                return response
            }
            else {
                return []
            }
        }

    },
    methods: {
        addEditorLanguage: function (value) {
            this.editorLanguage = value
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
            var value = this.validateNewProducts()
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
                var my_product_list = this.mockedProducts(my_products);

                this.products = this.products.concat(my_product_list)
                this.newProduct = ''
            }
        },
        clearSettings: function () {
            console.log('BEFORE')
            console.log(this.settings)
            this.settings = {}
            console.log('AFTER')
            console.log(this.settings)
        },
        clearSelectBoxes: function () {
            this.selectedBaseProduct = null
            this.selectedComponent1 = null
            this.selectedComponent2 = null
            this.selectedMaterials = []
            this.selectedMetatags = []
        },

        closeEditMe: function (item) {
            item.edit = false
            item.value = item.value.replace(/\r?\n|\r/g, "")
        },
        customLabel: function (option) {
            return option[this.editorLanguage];
        },
        customOptionLabel: function (option) {
            if (!option['label']) return option

            if (typeof option['label'][this.editorLanguage] === 'undefined' || option['label'][this.editorLanguage]['value'] === "") {
                return option['label']['en-GB']['value']
            }
            return option['label'][this.editorLanguage]['value']
        },
        deactivateMessages: function () {
            this.messages.forEach(function (message) {
                message.show = false
            })
        },
        deactivateItem: function (type) {
            console.log('Deactivate ' + type);
            values = []

            switch (type) {
                case 'base_product':
                    if (this.selectedBaseProduct)
                        values.push(this.selectedBaseProduct)
                    values.push(this.selectedComponent1)
                    values.push(this.selectedComponent2)
                    break

                case 'material':
                    values.push(this.selectedMaterials)
                    break

                case 'metatag':
                    values.push(this.selectedMetatags)
                    break;
            }

            console.log(values)

        },
        debugComponents: function () {
            console.log("Local (app.components_local)")
            console.log(this.components_local)
            console.log("ALL Components (app.components)")
            console.log(this.components)
        },
        debugBaseProducts: function () {
            console.log("ALL BaseProducts (app.base_products)")
            //console.log(this.baseProductOptions)
            console.log(this.selectedBaseProduct)
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
        debugSettings: function () {
            console.log(this.settings)
        },
        indexOptionLabel: function (option) {
            if (!option['label']) return option

            if (typeof option['label'][this.editorLanguage] === 'undefined' || option['label'][this.editorLanguage]['value'] === "") {
                return option['label']['en-GB']['value']
            }
            return option['label'][this.editorLanguage]['value']
        },
        editMe: function (item, item_parent) {
            item.edit = true
            if (item_parent) {
                item_parent.dirty = true
            }
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
            this.settings.supportedLanguages.forEach(function (language) {
                if (language.status) {
                    export_languages.push(language.id)
                    localized_materials[language.id] = []
                    localized_metatags[language.id] = []

                    for (var i = 0; i < product.materials.length; i++) {
                        localized_materials[language.id].push(product.materials[i][language.id])

                    }
                    for (var i = 0; i < product.metatags.length; i++) {
                        //localized_metatags[language.id].push(product.metatags[i][language.id])

                        metatag = product.metatags[i]
                        my_label = metatag[language.id]
                        if (metatag.invisible) {
                            my_label = "-" + my_label
                        }
                        localized_metatags[language.id].push(my_label)

                        // add alias
                        my_aliases = metatag['alias_'+language.id]

                        if(my_aliases){
                            alias_array = my_aliases.split(',')
                        }

                        if (alias_array) {
                            alias_array.forEach(function (alias) {
                                alias = "-" + alias.trim()

                                if (alias.length > 1 && localized_metatags[language.id].indexOf(alias)< 0) {
                                    localized_metatags[language.id].push(alias)
                                }
                            })
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
            this.settings.supportedLanguages.forEach(function (language) {
                // does the product have a customized name in any language?
                if (product.names[language.id].original_value != product.names[language.id].value) {
                    return true
                }
            })
            return false

        },
        makeActive: function (item) {
            // deactivate all
            this.show_translations = false
            this.show_names = false
            this.show_metatags = false
            this.show_material = false
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
                case 'translations':
                    this.show_load = false
                    this.isFullScreen = true
                    this.show_translations = true
                    this.headline = 'Translations'
                    this.headline_icon = "fa fa-globe"
                    break
            }
        },
        mockedProducts: function (products_list) {
            var products = []

            products_list.forEach(function (product_name, override_name) {
                // use fake api response from api.js
                var random_nr = Math.round(Math.random() * (Object.keys(Api_response).length - 1))
                if (random_nr > 0) random_nr = random_nr - 1
                product = Api_response[random_nr]

                // simulate API response for testing purpose
                product_model = product_name.trim()

                products.push({
                    active: true,
                    cached_descriptions: product.cached_descriptions,
                    cached_materials: product.cached_materials,
                    cached_metatags: product.cached_metatags,
                    cached_names: product.cached_names,
                    component1: null,
                    component2: null,
                    base_product: null,
                    db_id: product.db_id,
                    detailsLink: product.details_link,
                    dirty: false,
                    descriptions: product.descriptions,
                    hidden: false,
                    id: productStorage.uid++,
                    materials: [],
                    metatags: [],
                    modelCode: product_model,
                    names: {},
                    productImage: product.product_image,
                    properties: product.properties,
                    propertyFormula: product.propertyFormula,
                    updated: Date.now()
                })
            })
            return products
        },
        optionFactory: function (value) {
            // no spaces and all lowercase for id/value
            normalized_value = value.replace(/ /g, "_").toLowerCase()

            // prepare label structure
            var label = {}
            var alias = {}
            this.settings.supportedLanguages.forEach(function (language) {
                // create index for localization
                label[language.id] =
                    {
                        "value": value,
                        "edit": false,
                        "active": true
                    }
                alias[language.id] =
                    {
                        "value": "",
                        "edit": false,
                        "active": true
                    }

            })


            var option = {
                alias: alias,
                dirty: true,
                id: normalized_value,
                invisible: false,
                label: label,
                new: true,
                search: value,
                value: normalized_value
            }

            return option
        },
        invisibleMetatags: function () {
            var all_products = this.products
            var all_metatags = this.metatags
            this.selectedMetatags.forEach(function (metatag) {

                all_metatags[metatag.value].invisible = true
                all_products.forEach(function (product) {
                    if (product.metatags.indexOf(metatag.value) > -1) {
                        product.dirty = true
                    }
                })
            })

            if (hasApi) {
                // make it persistent in DB
                api.app = this
                api.data = this.selectedMetatags
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
            var selectedMaterials = this.selectedMaterials
            var clear_materials = false
            var remove_material = this.remove_mode_material

            // set materials to all selected products
            this.products.forEach(function (product) {
                if (product.active) {

                    selectedMaterials.forEach(function (item) {
                        var unique = true
                        material_value = item.name
                        if (material_value === "-") {
                            clear_materials = true
                        }
                        if (!clear_materials && !remove_material) {
                            product.materials.forEach(function (product_value) {
                                if (material_value === product_value.name) {
                                    unique = false
                                }
                            })
                            if (unique) {
                                product.materials.push(item)
                                // mark product as dirty
                                product.dirty = true
                            }
                        }
                        if(remove_material){
                            var index = product.materials.findIndex(i => i.name === item.name)
                            if (index > -1) {
                                product.materials.splice(index, 1)
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
            this.selectedMaterials = []
        },
        saveMetatags: function () {
            var selectedMetatags = this.selectedMetatags
            var clear_metatags = false
            var remove_metatag = this.remove_mode_metatag

            // set metatags to all selected products
            this.products.forEach(function (product) {
                if (product.active) {
                    selectedMetatags.forEach(function (metatag) {
                        var unique = true
                        meta_value = metatag.name
                        if (meta_value === "-") {
                            clear_metatags = true
                        }
                        if (!clear_metatags && !remove_metatag) {
                            product.metatags.forEach(function (product_meta_value) {
                                if (meta_value === product_meta_value) {
                                    unique = false
                                }
                            })
                            if (unique) {
                                product.metatags.push(metatag)
                                // mark product as dirty
                                product.dirty = true
                            }
                        }
                        if(remove_metatag){
                            var index = product.metatags.findIndex(i => i.name === item.name)
                            if (index > -1) {
                                product.metatags.splice(index, 1)
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
            this.selectedMetatags = []

        },
        saveNameScheme: function () {
            var attr1 = this.selectedComponent1
            var attr2 = this.selectedComponent2
            var base_product = this.selectedBaseProduct

            var clear_base_product = false
            var clear_attr1 = false
            var clear_attr2 = false
            var conjunction = this.conjunction
            var languages = this.settings.supportedLanguages

            this.products.forEach(function (product) {
                if (product.active) {
                    if (typeof base_product == 'object' && base_product != null) {

                        if (base_product.name === "-") {
                            product.base_product = null
                            clear_base_product = true
                        }
                        else {
                            product.base_product = base_product
                        }

                        product.dirty = true
                    }

                    if (typeof attr1 == 'object' && attr1 != null) {
                        if (attr1.name === '-') {
                            product.component1 = null
                            clear_attr1 = true
                        }
                        else {
                            product.component1 = attr1
                        }
                        product.dirty = true
                    }

                    if (typeof attr2 == 'object' && attr2 != null) {
                        if (attr2.value === '-') {
                            product.component2 = null
                            clear_attr2 = true
                        }
                        else {
                            product.component2 = attr2
                        }
                        product.dirty = true
                    }
                    // generate composed product name for each language
                    product_names = {}

                    languages.forEach(function (language) {
                        var my_name = ''

                        if (product.base_product && product.base_product[language.id]) {
                            if (product.base_product.name != "-") {
                                my_name = product.base_product[language.id]
                                if (!my_name) {
                                    //fallback if we dont have an translation yet
                                    my_name = product.base_product['en-GB']
                                }
                            }
                            product.dirty = true
                        }
                        if (product.component1 && product.component1[language.id]) {
                            if (product.component1.name != "-") {
                                var with_conjunction = ''
                                if (my_name.length > 0) {
                                    with_conjunction = " " + conjunction.with[language.id] + " "
                                }
                                my_component = product.component1[language.id]
                                if (!my_component) {
                                    // fallback to en-GB
                                    my_component = product.component1['en-GB']
                                }
                                my_name = my_name + with_conjunction + my_component
                            }
                            product.dirty = true

                        }
                        if (product.component2 && product.component2[language.id]) {
                            if (product.component2.name != "-") {
                                var and_conjunction = ''
                                if (my_name.length > 0) {
                                    and_conjunction = " " + conjunction.and[language.id] + " "
                                }
                                my_component2 = product.component2[language.id]
                                if (!my_component2) {
                                    // fallback to en-GB
                                    my_component2 = product.component2['en-GB']
                                }

                                my_name = my_name + and_conjunction + my_component2
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
        sortBy: function (sortKey) {
            console.log(sortKey);
            this.reverse = (this.sortKey == sortKey) ? !this.reverse : false;

            this.sortKey = sortKey;
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
        switchRemoveMaterial: function(){
            this.remove_mode_material = !this.remove_mode_material
        },
        switchRemoveMetatag: function(){
            this.remove_mode_metatag = !this.remove_mode_metatag
        },
        toggle_language: function (language) {
            language.status = !language.status
        },
        toggle_settings: function () {
            this.show_settings = !this.show_settings
        },
        toggleTranslationVisibility: function (item) {

            switch (item) {
                case 'base_products':
                    this.show_translation_base_products = !this.show_translation_base_products
                    break
                case 'components':
                    this.show_translation_components = !this.show_translation_components
                    break
                case 'materials':
                    this.show_translation_materials = !this.show_translation_materials
                    break
                case 'metatags':
                    this.show_translation_metatags = !this.show_translation_metatags
                    break
                case 'descriptions':
                    this.show_translation_descriptions = !this.show_translation_descriptions
                    break
            }
        },
        updateNameSchemes: function () {
            // update product names
            var languages = this.settings.supportedLanguages
            var conjunction = this.conjunction
            var base_products = this.baseProducts
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
                        if (product.component1 && product.component1.label && product.component1.label[language.id]) {
                            components[product.component1.value].label[language.id].edit = false
                            my_name = my_name + " " + conjunction.with[language.id] + " " + components[product.component1.value].label[language.id].value
                            updated = true
                        }
                        if (product.component2 && product.component2.label && product.component2.label[language.id]) {
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
        renderTableCol: function (arg1, arg2) {
            console.log('different scope baby');
        },
        validateNewProducts: function (){

            // get all modelCodes into a list
            modelCodes=[]
            this.products.forEach(function(product){
                if(modelCodes.indexOf(product.modelCode)<0){
                    modelCodes.push(product.modelCode)
                }
            })

            // have a look at the request productCodes
            newProductQuery= this.newProduct.trim()
            newProductList= newProductQuery.split(" ")
            response= []

            newProductList.forEach(function (query_name){
                product_name = query_name.toUpperCase()

                if(modelCodes.indexOf(product_name)<0){
                    response.push(product_name)
                }
            })

            if(response.length<1){
                this.addMessage("No valid Product codes given", "danger")
                this.newProduct=''
                return false
            }
            else return response.join(" ")
        },
        visibleMetatags: function () {
            var all_products = this.products;
            var all_metatags = this.metatags;
            this.selectedMetatags.forEach(function (metatag) {
                metatag.invisible = false
                all_metatags[metatag.value].invisible = false
                all_products.forEach(function (product) {
                    if (product.metatags.indexOf(metatag.value) > -1) {
                        product.dirty = true
                    }
                })
            })
            if (hasApi) {
                // make it persistent in DB
                api.app = this
                api.data = this.selectedMetatags
                api.action = 'visible_metatags'
                api.call()
            }
        },
    }
})

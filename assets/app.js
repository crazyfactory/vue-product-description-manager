if (typeof api !== 'undefined' || typeof api_endpoint !=='undefined') {
    // variable needs to come from a local config and holds the path to the api
    var hasApi = true
    // how long is a product kept in local storage? (in ms)
    var validationRange = 86400000
}
else {
    var hasApi = false
    // how long is a product kept in local storage? (in ms)
    var validationRange = 86400000
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
        settings.supportedLanguages = AppLanguages

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
        show_description_translator: true,
        newResourceType:'',
        newResourceTypeClass: 'form-goup',
        newResourceLabelDefault:'',
        newResourceLabelDefaultClass:'form-goup',
        newResourceLabelDe:'',
        newResourceLabelDeClass:'form-group',
        newResourceLabelEnUS:'',
        newResourceLabelEnUSClass:'form-group',
        newResourceLabelNl:'',
        newResourceLabelNlClass:'form-group',
        newResourceAliasDefault:'',
        newResourceAliasDe:'',
        newResourceAliasEnUS:'',
        newResourceAliasNl:'',
        newResourceIsHidden: false,
        newResourceTranslationRequested: true,
        dirtyTranslations: {
            isDirty:false,
            baseProducts:{
                isDirty: false,
                entryList: [],
                stash: []
            },
            components: {
                isDirty: false,
                entryList: [],
                stash: []
            },
            materials: {
                isDirty: false,
                entryList: [],
                stash: []
            },
            metatags: {
                isDirty: false,
                entryList: [],
                stash: []
            },
        },
        conjunction: ComponentConjunctions,
        headline: IsAdmin
            ? 'Product Names'
            : 'Translation Management',
        headline_icon: IsAdmin
            ? 'fa fa-commenting-o'
            : 'fa fa-globe',
        isAdmin: IsAdmin,
        isFullScreen: !IsAdmin,
        isLoading: false,
        languages_autodescription: ['de', 'en-GB', 'en-US', 'es', 'nl'],
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
        rawBaseproducts : null,
        rawComponents : null,
        rawMaterials : null,
        rawMetatags: null,
        show_actionbar: false,
        show_add_new:false,
        show_export: false,
        show_load: IsAdmin,
        show_material: false,
        show_metatags: false,
        show_message: false,
        show_names: IsAdmin,
        show_preview: false,
        show_settings: false,
        show_translations: false,
        show_translator: !IsAdmin,
        show_translation_base_products: false,
        show_translation_components: false,
        show_translation_materials: false,
        show_translation_metatags: false,
        show_translation_descriptions: false,
        show_translator_base_products: false,
        show_translator_components: false,
        show_translator_materials: false,
        show_translator_metatags: false,
        settings: settingStorage.fetch(),
        table: {
            editable: true,
            threshold:100,
            columns: {
                default:[
                    {
                        id: "de",
                        icon: "flag-icon-de",
                        label: "de",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "en-GB",
                        icon: "flag-icon-gb",
                        label: "en-GB",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "en-US",
                        icon: "flag-icon-us",
                        label: "en-US",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "es",
                        icon: "flag-icon-es",
                        label: "es",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "fr",
                        icon: "flag-icon-fr",
                        label: "fr",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "it",
                        icon: "flag-icon-it",
                        label: "it",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "nl",
                        icon: "flag-icon-nl",
                        label: "nl",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "pt",
                        icon: "flag-icon-pt",
                        label: "pt",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "ru",
                        icon: "flag-icon-ru",
                        label: "ru",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    },
                    {
                        id: "sv",
                        icon: "flag-icon-se",
                        label: "sv",
                        width: null,
                        sortable: false,
                        groupable: false,
                        aggregators: []
                    }
                ]
            }
        },
        translationUpdates: LogData.content,
        resourceDict: {
            baseProducts: {
                name: "Base Products",
                selectableOptions: "optionsBaseProduct",
                translationRequested: "translatorBaseProducts"
            },
            components: {
                name: "Components",
                selectableOptions: "optionsComponent",
                translationRequested: "translatorComponents"
            },
            materials: {
                name: "Materials",
                selectableOptions: "optionsMaterial",
                translationRequested: "translatorMaterials"
            },
            metatags: {
                name: "Metatags",
                selectableOptions: "optionsMetatag",
                translationRequested: "translatorMetatags"
            },
        }
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
        },
        newResourceLabelDefault: function (newValue, oldValue) {
            if(this.newResourceLabelEnUS === '' || this.newResourceLabelEnUS === oldValue){
                this.newResourceLabelEnUS = newValue
            }

            if(this.newResourceLabelDe === '' || this.newResourceLabelDe === oldValue){
                this.newResourceLabelDe = newValue
            }
            if(this.newResourceLabelNl === '' || this.newResourceLabelNl === oldValue){
                this.newResourceLabelNl = newValue
            }
        },
        newResourceAliasDefault: function (newValue, oldValue) {
            if(this.newResourceAliasEnUS === '' || this.newResourceAliasEnUS === oldValue){
                this.newResourceAliasEnUS = newValue
            }
            if(this.newResourceAliasDe === '' || this.newResourceAliasDe === oldValue){
                this.newResourceAliasDe = newValue
            }
            if(this.newResourceAliasNl === '' || this.newResourceAliasNl === oldValue){
                this.newResourceAliasNl = newValue
            }
        }
    },
    computed: {
        activeLanguages: function(){
            stash = []
            this.supportedLanguages.forEach(function (item) {
                if (item.status){
                    item.translator_id = "translator_" + item.id
                    stash.push(item)
                }
            })
            return stash
        },
        activeLanguagesId: function () {
            stash = []
            this.supportedLanguages.forEach(function (item) {
                if (item.status) {
                    stash.push(item.id)
                }
            })
            return stash
        },
        optionsBaseProduct: function (){
            stash = []
            currentLanguage = this.editorLanguage

            if(!hasApi){
                return []
            }
            if(this.rawBaseproducts==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_baseproducts',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawBaseproducts = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                this.rawBaseproducts.forEach(function (item) {
                    search = item[currentLanguage]
                    if (item.is_active==1){
                        item['search']=search
                        stash.push(item)
                    }
                })
                return stash
            }
        },
        optionsComponent: function (){
            stash = []
            currentLanguage = this.editorLanguage

            if(!hasApi){
                return []
            }
            if(this.rawComponents==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_components',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawComponents = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                this.rawComponents.forEach(function (item) {
                    search = item[currentLanguage]
                    if (item.is_active==1){
                        item['search']=search
                        stash.push(item)
                    }
                })
                return stash
            }
        },
        optionsMaterial: function (){
            stash = []
            currentLanguage = this.editorLanguage

            if(!hasApi){
                return []
            }
            if(this.rawMaterials==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_materials',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawMaterials = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                this.rawMaterials.forEach(function (item) {
                    search = item[currentLanguage]
                    if (item.is_active==1){
                        item['search']=search
                        stash.push(item)
                    }
                })
                return stash
            }
        },
        optionsMetatag: function (){
            stash = []
            currentLanguage = this.editorLanguage

            if(!hasApi){
                return []
            }

            if(this.rawMetatags==null){
                if(this.rawMetatags==null){
                    _this = this
                    fetch(
                        api_endpoint,
                        {
                            credentials: 'include',
                            method: 'POST',
                            body: JSON.stringify({
                                action: 'get_metatags',
                            })
                        })
                        .then(function (response) {
                            return response.json()
                        })
                        .then(function (response) {
                            _this.rawMetatags = response.data.content
                        })
                        .catch(function () {
                            _this.addMessage("Sorry, something went wrong!", 'danger')
                        })
                    return []
                }
            }
            else{
                this.rawMetatags.forEach(function (item) {
                    search = item[currentLanguage]
                    if (item.is_active==1){
                        item['search']=search
                        item['is_hidden'] = item['is_hidden'].toString();
                        stash.push(item)
                    }
                })
                return stash
            }
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
        selectedDirtyProducts: function () {
            return this.products.filter(function (product) {
                return product.active === true && product.dirty === true
            })
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
        showUpdatePanel: function (){
            if(this.translationUpdates.length>0 || this.dirtyTranslations.isDirty){
                return true
            }
            else{
                return false
            }
        },
        translationsBaseProducts: function(){
            if(!hasApi){
                return []
            }
            if(this.rawBaseproducts==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_baseproducts',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawBaseproducts = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                var response = []
                this.rawBaseproducts.forEach(function (option, index) {
                    if (option.name !== '-' && option.is_active == 1) {
                        response.push(option);
                    }
                })
                return response
            }
        },
        translatorBaseProducts: function(){
            if(!hasApi){
                return []
            }
            if(this.rawBaseproducts==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_baseproducts',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawBaseproducts = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                var response = []
                this.rawBaseproducts.forEach(function (option, index) {
                    if (option.name !== '-' && option.is_active == 1 && option.translation_requested == 1) {
                        response.push(option);
                    }
                })
                return response
            }
        },
        translationsComponents: function () {
            if(!hasApi){
                return []
            }
            if(this.rawComponents==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_components',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawComponents = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                var response = []
                this.rawComponents.forEach(function (option, index) {
                    if (option.name !== '-' && option.is_active == 1) {
                        response.push(option);
                    }
                })
                return response
            }
        },
        translatorComponents: function(){
            if(!hasApi){
                return []
            }
            if(this.rawComponents==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_components',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawComponents = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                var response = []
                this.rawComponents.forEach(function (option, index) {
                    if (option.name !== '-' && option.is_active == 1 && option.translation_requested == 1) {
                        response.push(option);
                    }
                })
                return response
            }
        },
        translationsMaterials: function () {
            if(!hasApi){
                return []
            }
            if(this.rawMaterials==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_materials',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawMaterials = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                var response = []
                this.rawMaterials.forEach(function (option, index) {
                    if (option.name !== '-' && option.is_active == 1) {
                        response.push(option);
                    }
                })
                return response
            }
        },
        translatorMaterials: function () {
            if(!hasApi){
                return []
            }
            if(this.rawMaterials==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_materials',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawMaterials = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                var response = []
                this.rawMaterials.forEach(function (option, index) {
                    if (option.name !== '-' && option.is_active == 1 && option.translation_requested == 1) {
                        response.push(option);
                    }
                })
                return response
            }
        },
        translationsMetatags: function () {
            if(!hasApi){
                return []
            }
            if(this.rawMetatags==null){
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_metatags',
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.rawMetatags = response.data.content
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
                return []
            }
            else{
                var response = []

                this.rawMetatags.forEach(function (option, index) {
                    if(option.name !== '-' && option.is_active==1){
                        response.push(option);
                    }
                })
                return response
            }
        },
        translatorMetatags: function () {
            if(!hasApi){
                return []
            }
            if(this.rawMetatags==null){
                if(this.rawMetatags==null){
                    _this = this
                    fetch(
                        api_endpoint,
                        {
                            credentials: 'include',
                            method: 'POST',
                            body: JSON.stringify({
                                action: 'get_metatags',
                            })
                        })
                        .then(function (response) {
                            return response.json()
                        })
                        .then(function (response) {
                            _this.rawMetatags = response.data.content
                        })
                        .catch(function () {
                            _this.addMessage("Sorry, something went wrong!", 'danger')
                        })
                    return []
                }
            }
            else{
                var response = []

                this.rawMetatags.forEach(function (option, index) {
                    if(option.name !== '-' && option.is_active==1 && option.translation_requested == 1 ){
                        response.push(option);
                    }
                })
                return response
            }
        },
        validNewResource: function(){
            if(this.newResourceType=='' || this.newResourceLabelDefault==''){
                return false
            }
            else {
                return true
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
            setTimeout( function(msg){
                msg.show=false
            },5000, msg);

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
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'get_products',
                            data: value.split(" ").join(",")
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        _this.pushProducts(response)
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
            }
            else {
                var my_products = value.split(" ")
                var my_product_list = this.mockedProducts(my_products);

                this.products = this.products.concat(my_product_list)
                this.newProduct = ''
            }
        },
        addResource: function (){
            //validate Resourcetype
            source = this.validResourceType()

            if(source && this.validateResourceLabel(source))
            {
                resource = {
                    'resourceType':this.newResourceType,
                    'name': this.newResourceLabelDefault.replace(" ", "_").toLowerCase(),
                    'is_active': '1',
                    'is_hidden': this.newResourceIsHidden,
                    'en-GB': this.newResourceLabelDefault,
                    'alias_en-GB': this.newResourceAliasDefault,
                    'en-US': this.newResourceLabelEnUS,
                    'alias_en-US': this.newResourceAliasEnUS,
                    'de': this.newResourceLabelDe,
                    'alias_de': this.newResourceAliasDe,
                    'nl': this.newResourceLabelNl,
                    'alias_nl': this.newResourceAliasNl,
                    'es': this.newResourceLabelDefault,
                    'alias_es': this.newResourceAliasDefault,
                    'fr': this.newResourceLabelDefault,
                    'alias_fr': this.newResourceAliasDefault,
                    'pt': this.newResourceLabelDefault,
                    'alias_pt': this.newResourceAliasDefault,
                    'it': this.newResourceLabelDefault,
                    'alias_it': this.newResourceAliasDefault,
                    'ru': this.newResourceLabelDefault,
                    'alias_ru': this.newResourceAliasDefault,
                    'sv': this.newResourceLabelDefault,
                    'alias_sv': this.newResourceAliasDefault,
                    'translation_requested': this.newResourceTranslationRequested,
                }

                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'add_resource',
                            data: resource,
                        })
                    }
                )
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        if (response.success) {
                            _this.addMessage(response.message, 'success')
                            window.reload()
                        } else {
                            _this.addMessage(response.message, 'danger')
                        }
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
            }
        },
        bulkSaveProducts: function () {
            if (this.selectedDirtyProducts.length > 0) {
                data = {
                    product: this.selectedDirtyProducts[0],
                    languages: this.activeLanguagesId
                }
                api.app = this
                api.data = data
                api.action = 'save_products'
                api.call()
            } else {
                return false
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
        debugResources: function(){
            console.log('Debug');
            console.log(this.newResourceType)
            console.log(this.newResourceLabelEnUS)
            console.log(this.newResourceLabelDefault)
            console.log(this.newResourceLabelDe)
        },
        debugComponents: function () {
            console.log("Local (app.components_local)")
            console.log(this.components_local)
            console.log("ALL Components (app.components)")
            console.log(this.components)
        },
        debugBaseProducts: function () {
            console.log("ALL BaseProducts")
            console.log(this.selectedBaseProduct)
            console.log(this.optionsBaseProduct)
        },
        debugMaterials: function () {
            console.log("ALL Materials (app.materials)")
            console.log(this.selectedMaterials)
            console.log(this.optionsMaterial)
        },
        debugMetatags: function () {
            console.log('All Metatags')
            console.log(this.selectedMetatags)
            console.log(this.optionsMetatag)
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
        exportProduct: function (product) {
            // validate if baseProduct or Material is empty for this product
            if (!product.base_product || !product.materials.length) {
                if (!product.materials.length) {
                    msg = "Are you sure to set no Material for `" + product.modelCode + "` ?"
                }
                if (!product.base_product) {
                    msg = "Are you sure to set no BaseProduct for `" + product.modelCode + "` ?"
                }
                if (!product.base_product && !product.materials.length) {
                    msg = "Are you sure to set no BaseProduct and no Material for `" + product.modelCode + "` ?"
                }
                if (!confirm(msg)) return
            }

            data = {
                product: product,
                languages: this.activeLanguagesId
            }

            api.app = this
            api.data = data
            api.action = 'save_product'
            api.call()

        },
        getGeneratedDescription: function (product, language) {
            if (hasApi) {
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'generate_description',
                            data: product.propertyFormula
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                           product.descriptions[language] = response[language];
                           product.dirty = true
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
            }
            else {
                // use fake api response from api.js
                var random_nr = Math.round(Math.random() * (Object.keys(Api_response).length - 1))
                my_product = Api_response[random_nr]
                my_description = my_product.descriptions[language]
                this.products[index].descriptions[language] = my_description
            }
        },
        bulkChangeTranslationStatus: function (type) {
            proceed = confirm("Are you sure that you want to set all " + this.resourceDict[type]['name'] + " to be fully translated?")

            if (proceed && hasApi) {
                let resource_translation_requested = this[this.resourceDict[type].translationRequested]
                let id_list = resource_translation_requested.map(function (a) {
                    return a.id;
                })

                let group_resources = [], chunk_size = 900;
                for (let i = 0; i < id_list.length; i += chunk_size) {
                    group_resources.push(id_list.slice(i, i + chunk_size));
                }

                let promise_status_list = group_resources.map((item) => {
                    return new Promise((resolve, reject) => {
                        fetch(api_endpoint, {
                            credentials: 'include',
                            method: 'POST',
                            body: JSON.stringify({
                                action: 'bulk_translation_complete',
                                resources: item,
                                type: type
                            })
                        }).then(function (response) {
                            return response.json()
                        }).then(function (response) {
                            resource_translation_requested.forEach(function (resource) {

                                //verify if resource.id exist in response then switch to translation_requested = 0
                                if ((response.resources).indexOf(resource.id) > -1) {
                                    resource.translation_requested = 0
                                }
                            })
                            resolve()
                        }).catch(function () {
                            reject()
                        })
                    })
                })

                Promise.all(promise_status_list)
                    .then(() => this.addMessage("Hey, you just updated translation status of all the " + this.resourceDict[type]['name'] + " successfully.", 'success'))
                    .catch(() => this.addMessage("Sorry, something went wrong!", 'danger'));
            }
        },
        pushProducts: function(products){

            var product_names = []

            for (var key in products) {
                if (key !== 'success' && key !== 'metatags' && key !== 'materials' && 'propertyFormula' in products[key]) {
                    my_product = products[key];
                    product_names.push(my_product.id)

                    var base_product = {}
                    if (my_product.base_product['value'] && my_product.base_product['value'] !== '-' && my_product.base_product['value'].length) {
                        for (var i = 0; i < _this.rawBaseproducts.length; i++) {
                            if (_this.rawBaseproducts[i]['name'] === my_product.base_product['value']) {
                                base_product = _this.rawBaseproducts[i]
                                break;
                            }
                        }
                    }

                    var component1 = {}
                    var found_1 = false
                    var component2 = {}
                    var found_2 = false

                    if ((my_product.component1['value'] && my_product.component1['value'] !== '-' && my_product.component1['value'].length)
                        || (my_product.component2['value'] && my_product.component2['value'] !== '-' && my_product.component2['value'].length)) {

                        for (var i = 0; i < _this.rawComponents.length; i++) {
                            if (_this.rawComponents[i]['name'] === my_product.component1['value']) {
                                component1 = _this.rawComponents[i]
                                found_1 = true
                            }
                            if (_this.rawComponents[i]['name'] === my_product.component2['value']) {
                                component2 = _this.rawComponents[i]
                                found_2 = true
                            }
                            if (found_1 && found_2) {
                                break
                            }
                        }
                    }

                    var material_stash = []

                    for (var i = 0; i < products.materials.length; i++) {
                        if (my_product.materials.indexOf(products.materials[i]['name']) > -1) {
                            material_stash.push(products.materials[i]);
                        }
                    }

                    var metatag_stash = []

                    for (var i = 0; i < products.metatags.length; i++) {
                        if (my_product.metatags.indexOf(products.metatags[i]['name']) > -1) {
                            metatag_stash.push(products.metatags[i]);
                        }
                    }

                    this.products.push({
                        active: true,
                        cached_descriptions: my_product.cached_descriptions,
                        cached_materials: my_product.cached_materials,
                        cached_metatags: my_product.cached_metatags,
                        cached_names: my_product.cached_names,
                        component1: component1,
                        component2: component2,
                        base_product: base_product,
                        detailsLink: my_product.details_link,
                        db_id: my_product.db_id,
                        dirty: false,
                        descriptions: my_product.descriptions,
                        hidden: false,
                        id: productStorage.uid++,
                        materials: material_stash,
                        metatags: metatag_stash,
                        modelCode: my_product.id,
                        name_scheme: null,
                        names: {},
                        productImage: my_product.product_image['S'],
                        properties: my_product.properties,
                        propertyFormula: my_product.propertyFormula,
                        updated: Date.now()
                    });

                }
            }
        },
        productsTranslationUpdate: function(){
            if(this.dirtyTranslations.isDirty){
                this.addMessage('Please save your local changes before you update the Products.', 'danger')
                return false
            }
            if (hasApi) {
                api.app = this
                api.action = 'validate_translation_update'
                api.call()
            }
        },
        productsTranslationValidation: function(result){
            if(result.count > 0){
                proceed=confirm("You are going to update " + result.count + " products! Press `OK` to proceed or `Cancel` to abort the operation. Be aware that therefor <b>we'll drop all your loaded products.</b>")
                if(proceed){
                    this.addMessage('Lets update the Products.', 'success')
                    this.products=[]
                    if(hasApi)
                    {
                        api.app = this
                        api.data = result
                        api.action = 'translation_update'
                        api.call()
                    }
                }
                else{
                    this.addMessage('Update aborted!', 'info')
                }
            }
            else{
                // we got updates, but no effected products
                this.translationUpdates=[]
                this.addMessage('No products to update, process aborted!', 'info')
            }

        },
        saveTranslationUpdate: function(type, cell){
            id = cell.row.id
            index = this.dirtyTranslations[type]['entryList'].indexOf(id)

            if(index > -1){
                // remove element from entryList
                this.dirtyTranslations[type]['entryList'].splice(index,1)
            }
            // validate if we still have translations to update
            if(this.dirtyTranslations[type]['entryList'].length==0){
                this.dirtyTranslations[type].isDirty = false
            }
            // reset all translatrions if we dont have any dirty translations anymore
            if(!this.dirtyTranslations.baseProducts.isDirty && !this.dirtyTranslations.components.isDirty && !this.dirtyTranslations.materials.isDirty && !this.dirtyTranslations.metatags.isDirty)
            {
                // all translations are clean
                this.dirtyTranslations.isDirty = false
            }
            // save to DB
            if(hasApi)
            {
                data = {
                    type : type,
                    translation : cell.row
                }

                api.app = this
                api.data = data
                api.action = 'save_resource'
                api.call()
            }
        },
        saveTranslationUpdates: function(type){
            if(type =='baseProducts' || type =='components' || type =='materials' || type =='metatags'){
                stash = this.dirtyTranslations[type].stash
                entryList = this.dirtyTranslations[type].entryList

                this.dirtyTranslations[type].isDirty = false
                this.dirtyTranslations[type].stash = []
                this.dirtyTranslations[type].entryList = []

                data = {
                    type : type,
                    translations : stash
                }

            }

            if(!(this.dirtyTranslations.baseProducts.isDirty || this.dirtyTranslations.components.isDirty || this.dirtyTranslations.materials.isDirty || this.dirtyTranslations.metatags.isDirty))
            {
                this.dirtyTranslations.isDirty = false
            }
            // save to DB
            if(hasApi)
            {
                api.app = this
                api.data = data
                api.action = 'save_resources'
                api.call()
            }

        },
        stashUpdate: function(type, cell){
            // validate that we stash each row only once
            id = cell.row.id
            if(this.dirtyTranslations[type]['entryList'].indexOf(id)==-1){
                // mark Translations as dirty
                this.dirtyTranslations.isDirty=true
                // mark type Translations as dirty
                this.dirtyTranslations[type]['isDirty']=true
                // add row to stash for update
                this.dirtyTranslations[type]['entryList'].push(id)
                this.dirtyTranslations[type]['stash'].push(cell)
            }
        },
        deleteResource: function (type, cell) {
            proceed = confirm('You are going to delete "' + cell.row[this.editorLanguage] + '"! Please only proceed if you are sure about it.')

            if (proceed && hasApi) {
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'delete_resource',
                            data: {
                                type: type,
                                translation: cell.row
                            },
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        if (response.success) {
                            cell.row.is_active = 0
                            _this.translationUpdates = ["deleted_resource"]
                            _this.addMessage(response.message, 'success')
                        } else {
                            _this.addMessage(response.message, 'danger')
                        }
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
            }
        },
        editMe: function (item, item_parent) {
            item.edit = true
            if (item_parent) {
                item_parent.dirty = true
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
            this.show_add_new = false
            this.isFullScreen = false
            this.show_translator = false
            this.headline_icon = ''

            // force clearing of all dropdowns
            this.selectedBaseProduct = null
            this.selectedComponent1 = null
            this.selectedComponent2 = null
            this.selectedMaterials = []
            this.selectedMetatags = []

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
                    this.headline = 'Message History'
                    this.headline_icon = "fa fa-envelope-o"
                    break
                case 'translations':
                    this.show_load = false
                    this.isFullScreen = true
                    this.show_translations = true
                    this.headline = 'Translations'
                    this.headline_icon = "fa fa-globe"
                    break
                case 'translator':
                    this.show_load = false
                    this.isFullScreen = true
                    this.show_translator = true
                    this.headline = 'Translation Management'
                    this.headline_icon = "fa fa-globe"
                    break
                case 'add_new':
                    this.show_load = false
                    this.isFullScreen = true
                    this.show_add_new = true
                    this.headline = 'Create Resources'
                    this.headline_icon = "fa fa-plus"
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
        is_active_language: function(id){
            languages_id = this.activeLanguages.map(function( language ) {
                return language['id']
            });

            return languages_id.indexOf(id) > -1
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

            // force clearing of all dropdowns
            this.selectedBaseProduct = null
            this.selectedComponent1 = null
            this.selectedComponent2 = null
            this.selectedMaterials = []
            this.selectedMetatags = []
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

            // force clearing of all dropdowns
            this.selectedBaseProduct = null
            this.selectedComponent1 = null
            this.selectedComponent2 = null
            this.selectedMaterials = []
            this.selectedMetatags = []

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
        switchTranslatorStatus: function(type, cell){
            proceed = confirm('Have you translated in all language of "' + cell.row[this.editorLanguage] + '"? Please only proceed if you are sure about it.');

            if (proceed && hasApi) {
                cell.row['translation_requested'] = 0

                data = {
                        translation: cell.row,
                        type: type
                    }
                    api.app = this
                    api.data = data
                    api.action = 'translation_complete'
                    api.call()
            }
        },
        switchTranslationStatus: function(type, cell){
            if (hasApi) {
                cell.row['translation_requested'] = parseInt(cell.row['translation_requested']) ? 0 : 1

                data = {
                    translation: cell.row,
                    type: type
                }
                api.app = this
                api.data = data
                api.action = 'update_translation_requested'
                api.call()
            }
        },
        setHiddenTag: function (cell) {
            if (hasApi) {
                _this = this
                fetch(
                    api_endpoint,
                    {
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify({
                            action: 'set_hidden_tag',
                            data: {
                                translation: cell.row,
                                type: 'metatags'
                            }
                        })
                    })
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (response) {
                        if (response.success) {
                            _this.addMessage(response.message, 'success')
                            cell.row['is_hidden'] = 1 - parseInt(cell.row['is_hidden']);
                        } else {
                            _this.addMessage(response.message, 'danger')
                        }
                    })
                    .catch(function () {
                        _this.addMessage("Sorry, something went wrong!", 'danger')
                    })
            }
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
        toggleTranslatorVisibility: function (item) {

            switch (item) {
                case 'base_products':
                    this.show_translator_base_products = !this.show_translator_base_products
                    break
                case 'components':
                    this.show_translator_components = !this.show_translator_components
                    break
                case 'materials':
                    this.show_translator_materials = !this.show_translator_materials
                    break
                case 'metatags':
                    this.show_translator_metatags = !this.show_translator_metatags
                    break
            }
        },
        toggleDescriptionTranslator: function(){
            this.show_description_translator = !this.show_description_translator
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
        validateNavigation : function (item){
            if(this.dirtyTranslations.isDirty){
                if(confirm("You have unsaved Translation changes. Press `OK` to procceed or `Cancel` to stay and save them.") == true){
                    return true
                }
                else return false
            }
            else return true
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
        validResourceType: function(){
            switch(this.newResourceType) {
                case 'Base Product':
                    return this.translationsBaseProducts
                    break
                case 'Component':
                    return this.translationsComponents
                    break
                case 'Material':
                    return this.translationsMaterials
                    break
                case 'Metatag':
                    return this.translationsMetatags
                    break
                default:
                    this.addMessage('Please choose a valid Resource Type', 'info' )
                    this.newResourceTypeClass = "form-group has-error has-feedback"
                    return false
            }
        },
        validateResourceLabel: function(source){
            has_error = false
            is_unique = true

            // validate that every label has an entry and we dont have duplicates
            if(this.newResourceLabelDefault==''){
                this.newResourceLabelDefaultClass= "form-group has-error has-feedback"
                has_error=true
            }
            if(this.newResourceLabelDe==''){
                this.newResourceLabelDeClass= "form-group has-error has-feedback"
                has_error=true
            }
            if(this.newResourceLabelEnUS==''){
                this.newResourceLabelEnUSClass= "form-group has-error has-feedback"
                has_error=true
            }
            if(this.newResourceLabelNl==''){
                this.newResourceLabelNlClass= "form-group has-error has-feedback"
                has_error=true
            }
            if(has_error){
                this.addMessage('Labels can not be empty. Please fix the indicated fields.', 'info' )
                return false
            }

            _this = this
            labelDefault = _this.newResourceLabelDefault
            labelDe      = _this.newResourceLabelDe
            labelEnUS    = _this.newResourceLabelEnUS
            labelNl      = _this.newResourceLabelNl

            error_message='A problem occured while validating your new '+ this.newResourceType +' request.'

            source.forEach( function (item, index) {
                if(labelDefault.toLowerCase() == item['en-GB'].toLowerCase())
                {
                    _this.newResourceLabelDefaultClass= "form-group has-error has-feedback"
                    has_error = true
                    error_message=error_message+' The default label (`' + labelDefault + '`) already exists as `'+ item['en-GB'] +'`.'
                }
                if(labelDe.toLowerCase() == item['de'].toLowerCase())
                {
                    _this.newResourceLabelDeClass= "form-group has-error has-feedback"
                    has_error = true
                    error_message=error_message+' The german label (`' + labelDe + '`) already exists as `'+ item['de'] +'`.'
                }
                if(labelEnUS.toLowerCase() == item['en-US'].toLowerCase())
                {
                    _this.newResourceLabelEnUSClass= "form-group has-error has-feedback"
                    has_error = true
                    error_message=error_message+' The american label (`' + labelEnUS + '`) already exists as `'+ item['en-US'] +'`.'
                }
                if(labelNl.toLowerCase() == item['nl'].toLowerCase())
                {
                    _this.newResourceLabelNlClass= "form-group has-error has-feedback"
                    has_error = true
                    error_message=error_message+' The dutch label (`' + labelNl + '`) already exists as `'+ item['nl'] +'`.'
                }
            })
            if(has_error){
                this.addMessage(error_message, 'info' )
                return false
            }

            return true
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

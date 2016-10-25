//teach TWIG some manners
// prepare twig template ... replace [[ ]] by {{ }}

if (typeof jQuery === 'undefined') {
    // jQuery is NOT available
    console.log('jQuery not found. Please add it.');
} else {
    // jQuery is available
    $("#app").html( $('#app').html().replace(/\[\[/g , '{{'));
    $("#app").html( $('#app').html().replace(/\]\]/g, '}}') );
}

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
CategoriesData['de']=Categories_de.content;
AttributeData['de']=Attributes_de.content;
AttributeConjunction['de']=Attributes_de.conjunction;

//register components
Vue.component('v-select', VueSelect.VueSelect);

/*
 * add products
 */
// localStorage persistence
var STORAGE_KEY = 'crazy-products'
var productStorage = {
    fetch: function () {
        var products = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        products.forEach(function (product, index) {
            products.id = index
        })
        productStorage.uid = products.length
        return products
    },
    save: function (products) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    }
}


// end new products

new Vue({
    el: '#app',
    data: {
        /*
         * Navigation Behavior
         */
        headline: 'Product Names & Meta tags',
        show_load: true,
        show_names: true,
        show_descriptions: false,
        show_preview: false,
        show_export: false,
        isFullScreen:false,
        isSmallScreen:true,
        /*
         * create Name Scheme
         */
        // load data
        category_options:CategoriesData['de'],
        attribute_options_1:AttributeData['de'],
        attribute_options_2:AttributeData['de'],
        conjunction_1:AttributeConjunction['de'].with,
        conjunction_2:AttributeConjunction['de'].and,
        // preview
        selected_category:"",
        selected_attribute_1:"",
        selected_attribute_2:"",


        /*
         * Product Management
         */
        products:productStorage.fetch(),
        newProduct:'',

        /*
         * Language Management
         */
        languages:[],
        sources:[]
    },
    // watch products change for localStorage persistence
    watch: {
        products: {
            handler: function (products) {
                productStorage.save(products)
            },
            deep: true
        }
    },
    computed: {
        allActive: {
            set: function (value) {
                this.products.forEach(function (product) {
                    product.active = value
                })
            }
        }
    },
    methods: {
        makeActive: function(item){
            // deactivate all
            this.show_names= false;
            this.show_descriptions= false;
            this.show_metatags= false;
            this.show_export= false;
            this.show_preview= false;
            this.show_load=true;
            this.isFullScreen=false;
            this.isSmallScreen=true;

            switch(item){
                case 'names':
                    this.show_names= true;
                    this.headline = 'Product Names & Meta tags';
                    break;
                case 'description':
                    this.show_descriptions= true;
                    this.headline = 'Product Descriptions';
                    break;
                case 'preview':
                    this.show_preview= true;
                    this.headline = 'Preview: Multilingual and custom texts';
                    this.isFullScreen=true;
                    this.isSmallScreen=false;
                    break;
                case 'export':
                    this.show_export= true;
                    this.headline = 'Export Products to shop';
                    break;
            }
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
                console.log('no api ... dry hump');

                this.products.push({
                    id: productStorage.uid++,
                    active: false,
                    modelCode:value,
                    name_scheme:null,
                    names:[],
                    category:null,
                    attribute1:null,
                    attribute2:null
                });

                this.newProduct = '';
            }
        },
        removeProduct: function (product) {
            this.products.splice(this.products.indexOf(product), 1)
        },
        saveNameScheme: function(){
            var scheme = '';
            var category = this.selected_category;
            var attr1 = this.selected_attribute_1;
            var attr2 = this.selected_attribute_2;

            this.products.forEach(function (product) {
                if(product.active){
                    scheme = '';

                    if (typeof category == 'object' && category !=null && category.value != '--'){
                        product.category=category;
                    }
                    if(typeof attr1=='object' && attr1!=null && attr1.value!='--'){
                        product.attribute1=attr1;
                    }
                    if(typeof attr2=='object' && attr2!=null && attr2.value!='--'){
                        product.attribute2=attr2;
                    }
                }
            })
        }

    }
})

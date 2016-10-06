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
        breadcrumb:"Manage Products",
        show_load: true,
        show_names: true,
        show_descriptions: false,
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
        visibility:'all',

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
            this.show_rss= false;
            this.show_load=true;

            this.breadcrumb = item;
            switch(item){
                case 'load':
                    this.show_load= true;
                    this.breadcrumb = 'Manage Products';
                    break;
                case 'names':
                    this.show_names= true;
                    this.breadcrumb = 'Configure Product Names';
                    break;
                case 'description':
                    this.show_descriptions= true;
                    this.breadcrumb = 'Configure Product Descriptions';
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
            this.products.push({
                id: productStorage.uid++,
                active: false,
                model_code:value,
                name_scheme:null,
                names:[]
            })
            this.newProduct = ''
        },

        removeProduct: function (product) {
            this.products.splice(this.products.indexOf(product), 1)
        }
    }
})

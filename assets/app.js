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

// visibility filters
var filters = {
    all: function (products) {
        return products
    },
    active: function (products) {
        return products.filter(function (product) {
            return !product.completed
        })
    },
    completed: function (products) {
        return products.filter(function (product) {
            return product.completed
        })
    }
}
// end new products

new Vue({
    el: '#app',
    data: {
        /*
         * Navigation Behavior
         */
        breadcrumb:"Please add some Products",
        show_load: true,
        show_names: false,
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
        editedProduct:null,
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
    methods: {
        makeActive: function(item){
            // deactivate all
            this.show_names= false;
            this.show_descriptions= false;
            this.show_metatags= false;
            this.show_rss= false;
            this.show_load=false;

            this.breadcrumb = item;
            switch(item){
                case 'load':
                    this.show_load= true;
                    this.breadcrumb = 'Load Products';
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
        /*
        addProduct: function (product_id) {
            product = new Product();
            product.setId(product_id);
            this.products.push(product);
        },
        // add array of products
        addProducts: function (product_array){
            this.products = this.products.concat(product_array);
        }
        */
        addProduct: function () {
            var value = this.newProduct && this.newProduct.trim()
            if (!value) {
                return
            }
            this.products.push({
                id: productStorage.uid++,
                title: value,
                completed: false
            })
            this.newProduct = ''
        },

        removeProduct: function (product) {
            this.products.splice(this.products.indexOf(product), 1)
        },

        editProduct: function (product) {
            this.beforeEditCache = product.title
            this.editedProduct = product
        },

        doneEdit: function (product) {
            if (!this.editedProduct) {
                return
            }
            this.editedProduct = null
            product.title = product.title.trim()
            if (!product.title) {
                this.removeProduct(product)
            }
        },

        cancelEdit: function (product) {
            this.editedProduct = null
            product.title = this.beforeEditCache
        },

        removeCompleted: function () {
            this.products = filters.active(this.products)
        }
    },
    directives: {
        'product-focus': function (el, value) {
            if (value) {
                el.focus()
            }
        }
    }
})

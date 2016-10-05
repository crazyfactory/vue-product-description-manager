var LoadProducts =Vue.extend({
    template: '<div>Load Products template</div>'
});

var ProductNames =Vue.extend({
    template: '<div>' +
    '<h5>Product Names template</h5>' +
    '</div>'
});

var AttributeData=[];
var AttributeConjunction=[];
AttributeData['de']=Attributes_de.content;
AttributeConjunction['de']=Attributes_de.conjunction;

//register components
Vue.component('load-products', LoadProducts);
Vue.component('product-names', ProductNames);
Vue.component('v-select', VueSelect.VueSelect);

new Vue({
    el: '#app',
    data: {
        breadcrumb:"Please add some Products",
        productsName: '#productsName',
        productsDescription: '#productsDescription',
        show_load: true,
        show_names: false,
        show_descriptions: false,

        category_options:[
            { label: 'Plug', value: 'plug' },
            { label: 'Expander', value: 'expander'}
        ],
        attribute_options_1:AttributeData['de'],
        attribute_options_2:AttributeData['de'],
        selected_category:"",
        selected_attribute_1:"",
        selected_attribute_2:"",
        conjunction_1:AttributeConjunction['de'].with,
        conjunction_2:AttributeConjunction['de'].and
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
                case 'metatags':
                    this.show_metatags= true;
                    this.breadcrumb = 'Configure Product Metatags';
                    break;
            }
        }
    }
})

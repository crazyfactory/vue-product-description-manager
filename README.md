# Product Description Manager GUI

This repo implements an app build with Vue.js The soul purpose of this app
is to manage a Meta-level of products to generate auto-translations for the product.
The persistent data-storage-operations (a.k.a. DB) are meant to be implementend
language-agnostic, depending on the system to integrate to.

## Features

### Product Management / auto translations
Add one or many products and create a auto-transatable content by setting:
- *Base product* : add/ manage the basic type of the product
- *Components* : add/ manage up to 2 components for the product
- *Material* : add/ manage materials of the product
- *Metatags* : Automatic creation/set of metatags from BaseProduct, Components and Material. Add/manage autotranslatable Metatags
- *Description* : get automated description (if provided in API endpoint)

### GUI features
*ActionBar*
 - Bulk operations for multible products
 - selectAll, selectNone, invertSelections
 - add, hide, show, delete products
 
### Language
 Supported languages are so far:
 - *en-GB*
 - *de*

## API Integration
To use this app in its persistent mode (changes will be saved to database) a javascript *api* object needs to be provided in the integration.
This object can  look like

```
var api{
  action: null, // determinates what kind of action the api is supposed to do
  app: null,  // holds a reference back to the app
  data: null, //holds the data from the app,
  language: null, // hold the supportetd languages
  ...
  call: function(){
    /* reacts on the followings *actions*
    - get_products
    - generate_description
    - save_product
    */
  }
}
```

## Versions
- 0.1.0: Initial release
- 0.2.0 RC1
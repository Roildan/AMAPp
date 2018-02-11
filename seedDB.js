const Product = require("./models/product");

const products = [{
        name: "Carrot",
        image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Z6S0wQ81H7iNGsH9CjqjFwHaE8%26pid%3D15.1&f=1",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Honey",
        image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.MrJ7a2lttwi7vvgxJOlq9wHaHa%26pid%3D15.1&f=1",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Cheese",
        image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.G9y5uy7QcRh7e0pmz5j6hgHaFj%26pid%3D15.1&f=1",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Carrot",
        image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Z6S0wQ81H7iNGsH9CjqjFwHaE8%26pid%3D15.1&f=1",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Honey",
        image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.MrJ7a2lttwi7vvgxJOlq9wHaHa%26pid%3D15.1&f=1",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    },
    {
        name: "Cheese",
        image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.G9y5uy7QcRh7e0pmz5j6hgHaFj%26pid%3D15.1&f=1",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
    }
];

// const contracts = [{
//         name: "Seasonal Vegetable",
//         image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.9o1PpVDg8QgTiCZWl4tDnAHaE7%26pid%3D15.1&f=1",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
//     },
//     {
//         name: "Eggs",
//         image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.4AMSMf8OW-cdawAasjf7rgHaDw%26pid%3D15.1&f=1",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
//     },
//     {
//         name: "Olive Oil",
//         image: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmangermediterraneen.com%2Fwp-content%2Fuploads%2F2016%2F01%2Fmangermediterraneen-regime-mediterraneen-huile-olive.jpg&f=1",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
//     },
//     {
//         name: "Seasonal Vegetable",
//         image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.9o1PpVDg8QgTiCZWl4tDnAHaE7%26pid%3D15.1&f=1",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
//     },
//     {
//         name: "Eggs",
//         image: "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.4AMSMf8OW-cdawAasjf7rgHaDw%26pid%3D15.1&f=1",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
//     },
//     {
//         name: "Olive Oil",
//         image: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fmangermediterraneen.com%2Fwp-content%2Fuploads%2F2016%2F01%2Fmangermediterraneen-regime-mediterraneen-huile-olive.jpg&f=1",
//         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et dolore labore aspernatur itaque nobis dignissimos maxime praesentium, quam vero sit facilis, perspiciatis recusandae explicabo assumenda sed ipsam blanditiis doloribus saepe!"
//     },
// ];

function seedDB() {
    // Remove all contracts
    // Contract.remove({}, function(err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log("Removed contacts !");

    //     // Add a few contracts
    //     contracts.forEach(function(contract) {
    //         Contract.create(contract, function(err, contract) {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             else {
    //                 console.log("Added a contract");
    //             }
    //         });
    //     });
    // });

    // Remove all products
    Product.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("Removed products !");

        // Add a few products
        products.forEach(function(product) {
            Product.create(product, function(err, product) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Added a product");
                }
            });
        });
    });
}

module.exports = seedDB;

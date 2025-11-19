const mongoose = require('mongoose');
     const Product = require('./models/Product');
     const connectDB = require('./config/db');

     const products = [
       {
         name: "Áo sơ mi cao cấp",
         brand: "Gucci",
         images: [
           "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1691428505/440103_X3F05_1508_001_100_0000_Light-Oversize-washed-T-shirt-with-Gucci-logo.jpg",
           "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1691428510/440103_X3F05_1508_002_100_0000_Light-Oversize-washed-T-shirt-with-Gucci-logo.jpg",
           "https://media.gucci.com/style/DarkGray_Center_0_0_800x800/1691428515/440103_X3F05_1508_003_100_0000_Light-Oversize-washed-T-shirt-with-Gucci-logo.jpg"
         ],
         price: 1500000,
         discountPrice: 1200000,
         description: "Áo sơ mi sang trọng từ Gucci, chất liệu cao cấp, thiết kế tinh tế.",
         category: "Áo",
         isNew: true,
         sizes: ["S", "M", "L"],
         colors: ["Black", "White"],
         stock: 10,
         reviews: [
           { user: "Khách hàng A", avatar: "https://ui-avatars.com/api/?name=Khách+hàng+A", rating: 5, comment: "Sản phẩm tuyệt vời, chất lượng cao!", time: new Date("2023-10-01T10:00:00") },
           { user: "Khách hàng B", avatar: "https://ui-avatars.com/api/?name=Khách+hàng+B", rating: 4, comment: "Thiết kế đẹp, giao hàng nhanh.", time: new Date("2023-10-02T14:30:00") },
         ],
       },
       {
         name: "Túi xách da thật",
         brand: "Louis Vuitton",
         images: [
           "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-onthego-mm-monogram-empreinte-handbags--M45653_PM2_Front%20view.jpg",
           "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-onthego-mm-monogram-empreinte-handbags--M45653_PM1_Side%20view.jpg",
           "https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-onthego-mm-monogram-empreinte-handbags--M45653_PM1_Interior%20view.jpg"
         ],
         price: 2500000,
         description: "Túi xách cao cấp da thật, phù hợp mọi dịp.",
         category: "Túi xách",
         sizes: [],
         colors: ["Brown"],
         stock: 5,
         reviews: [
           { user: "Khách hàng C", avatar: "https://ui-avatars.com/api/?name=Khách+hàng+C", rating: 5, comment: "Rất bền và đẹp!", time: new Date("2023-10-03T09:15:00") },
         ],
       },
       {
         name: "Giày sneaker",
         brand: "Nike",
         images: [
           "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/3396ee3c-08a0-414a-830d-ecb9bd2f66f3/air-force-1-07-mens-shoes-j3Rnwd.png",
           "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/00336a0c-bd77-4f38-973d-6ee7d8cf7c00/air-force-1-07-mens-shoes-j3Rnwd.png",
           "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,b_rgb:f5f5f5/9d2a5d3c-5a1a-49c2-a749-4ddc336d8e61/air-force-1-07-mens-shoes-j3Rnwd.png"
         ],
         price: 800000,
         discountPrice: 600000,
         description: "Giày sneaker thoải mái, phong cách trẻ trung.",
         category: "Giày",
         sizes: ["39", "40", "41"],
         colors: ["White", "Black"],
         stock: 15,
         reviews: [
           { user: "Khách hàng D", avatar: "https://ui-avatars.com/api/?name=Khách+hàng+D", rating: 4, comment: "Thoải mái, giá tốt.", time: new Date("2023-10-04T11:45:00") },
           { user: "Khách hàng E", avatar: "https://ui-avatars.com/api/?name=Khách+hàng+E", rating: 3, comment: "Cần cải thiện độ bền.", time: new Date("2023-10-05T16:20:00") },
         ],
       },
       {
         name: "Đồng hồ Rolex",
         brand: "Rolex",
         images: [
           "https://content.rolex.com/is/image/Rolex/?$content$&$dynamicUrl=m126200-0001,ar_3:4,c_fill,g_auto,w_480&$imgParams$",
           "https://content.rolex.com/is/image/Rolex/?$content$&$dynamicUrl=m126200-0001,ar_3:4,c_fill,g_auto,w_480&$imgParams$&op_sharpen=1&resmode=sharp2&wid=480&hei=480",
           "https://content.rolex.com/is/image/Rolex/?$content$&$dynamicUrl=m126200-0001,ar_3:4,c_fill,g_auto,w_480&$imgParams$&op_sharpen=1&resmode=sharp2&wid=480&hei=480&fmt=webp"
         ],
         price: 5000000,
         description: "Đồng hồ cao cấp Rolex, biểu tượng của sự sang trọng.",
         category: "Phụ kiện",
         sizes: [],
         colors: ["Silver"],
         stock: 3,
         reviews: [
           { user: "Khách hàng F", avatar: "https://ui-avatars.com/api/?name=Khách+hàng+F", rating: 5, comment: "Hoàn hảo!", time: new Date("2023-10-06T13:00:00") },
         ],
       },
       {
        name: "Áo hoodie thời trang",
        brand: "Balenciaga",
        images: [
            "https://cdn-images.farfetch-contents.com/15/46/78/23/15467823_27012912_1000.jpg",
            "https://cdn-images.farfetch-contents.com/15/46/78/23/15467823_27012915_1000.jpg"
        ],
        price: 1800000,
        discountPrice: 1500000,
        description: "Áo hoodie unisex, chất liệu nỉ bông, phù hợp thời tiết se lạnh.",
        category: "Áo",
        isNew: true,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Gray", "Black"],
        stock: 20,
        reviews: [
            { user: "Khách hàng G", avatar: "https://ui-avatars.com/api/?name=Khách+hàng+G", rating: 5, comment: "Rất ấm áp và thời trang!", time: new Date("2023-11-01T10:00:00") },
        ],
        },
        {
        name: "Giày cao gót nữ",
        brand: "Christian Louboutin",
        images: [
            "https://www.christianlouboutin.com/media/catalog/product/8/2/82764300_1.jpg",
            "https://www.christianlouboutin.com/media/catalog/product/8/2/82764300_2.jpg"
        ],
        price: 2200000,
        discountPrice: 1900000,
        description: "Giày cao gót quyến rũ, thiết kế tinh xảo từ Louboutin.",
        category: "Giày",
        sizes: ["36", "37", "38"],
        colors: ["Red"],
        stock: 7,
        reviews: [],
        },
        {
        name: "Nón lưỡi trai thời trang",
        brand: "Burberry",
        images: [
            "https://assets.burberry.com/is/image/Burberryltd/6D8C9DC3-A2A9-4F26-A6C5-52194A050841?$BBY_V2_SL_1$",
            "https://assets.burberry.com/is/image/Burberryltd/29C3DC3A-0FC9-4EB4-814F-5A25388A1869?$BBY_V2_SL_1$"
        ],
        price: 900000,
        description: "Nón lưỡi trai phong cách cổ điển Burberry.",
        category: "Phụ kiện",
        sizes: [],
        colors: ["Beige"],
        stock: 12,
        reviews: [],
        },
        {
        name: "Túi đeo chéo nam",
        brand: "Prada",
        images: [
            "https://www.prada.com/content/dam/pradabkg_products/2/V/U/2VH053/2DMG_F0002_V_OOO/2VH053_2DMG_F0002_V_OOO_SLF.jpg",
            "https://www.prada.com/content/dam/pradabkg_products/2/V/U/2VH053/2DMG_F0002_V_OOO/2VH053_2DMG_F0002_V_OOO_SCU.jpg"
        ],
        price: 3200000,
        description: "Túi đeo chéo tiện dụng, phong cách mạnh mẽ cho nam giới.",
        category: "Túi xách",
        sizes: [],
        colors: ["Black"],
        stock: 4,
        reviews: [
            { user: "Khách hàng H", avatar: "https://ui-avatars.com/api/?name=Khách+hàng+H", rating: 5, comment: "Rất sang trọng!", time: new Date("2023-12-01T15:30:00") },
        ],
        },
        {
        name: "Quần jeans rách gối",
        brand: "Zara",
        images: [
            "https://static.zara.net/photos///2022/I/0/2/p/6687/406/800/2/w/750/6687406800_1_1_1.jpg",
            "https://static.zara.net/photos///2022/I/0/2/p/6687/406/800/2/w/750/6687406800_2_2_1.jpg"
        ],
        price: 600000,
        discountPrice: 550000,
        description: "Quần jeans cá tính, chất denim co giãn, hợp phong cách streetwear.",
        category: "Quần",
        isNew: false,
        sizes: ["28", "30", "32"],
        colors: ["Blue"],
        stock: 18,
        reviews: [],
        },
        {
        name: "Áo thun logo nhỏ",
        brand: "Lacoste",
        images: [
            "https://www.lacoste.com/on/demandware.static/-/Sites-master/default/dw29fd9295/PH4012-51-031_01.jpg",
            "https://www.lacoste.com/on/demandware.static/-/Sites-master/default/dw1d35472f/PH4012-51-031_02.jpg"
        ],
        price: 700000,
        description: "Áo thun cổ tròn, logo cá sấu đặc trưng, chất liệu cotton mịn.",
        category: "Áo",
        sizes: ["M", "L", "XL"],
        colors: ["White", "Green"],
        stock: 10,
        reviews: [],
        },
        {
        name: "Kính mát thời trang",
        brand: "Ray-Ban",
        images: [
            "https://images.ray-ban.com/is/image/RayBan/805289126577__002.png",
            "https://images.ray-ban.com/is/image/RayBan/805289126577__003.png"
        ],
        price: 1300000,
        description: "Kính mát chính hãng, bảo vệ mắt khỏi tia UV, phù hợp cả nam và nữ.",
        category: "Phụ kiện",
        sizes: [],
        colors: ["Black"],
        stock: 9,
        reviews: [],
        },
        {
        name: "Giày thể thao nữ",
        brand: "Adidas",
        images: [
            "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/cb91c9de6bc14e19a876ab3c00e772fd_9366/Ultraboost_22_Shoes_Purple_HQ6354_01_standard.jpg",
            "https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/cf95a6d010544eaa80b8ab3c00e777e9_9366/Ultraboost_22_Shoes_Purple_HQ6354_03_standard.jpg"
        ],
        price: 1400000,
        discountPrice: 1100000,
        description: "Giày running nhẹ, thoáng khí, phù hợp tập luyện thể thao.",
        category: "Giày",
        sizes: ["36", "37", "38", "39"],
        colors: ["Purple"],
        stock: 14,
        reviews: [],
        },
        {
        name: "Thắt lưng da",
        brand: "Hermès",
        images: [
            "https://www.hermes.com/on/demandware.static/-/Sites-masterCatalog/default/dw9eb3f72b/images/h-fb/h215049n/00/h215049n-00_zoom_1.jpg",
            "https://www.hermes.com/on/demandware.static/-/Sites-masterCatalog/default/dwb4ee0b87/images/h-fb/h215049n/00/h215049n-00_zoom_2.jpg"
        ],
        price: 2600000,
        description: "Thắt lưng da cao cấp, mặt khóa kim loại sang trọng.",
        category: "Phụ kiện",
        sizes: ["M", "L"],
        colors: ["Black", "Brown"],
        stock: 6,
        reviews: [],
        },
        {
        name: "Áo khoác bomber",
        brand: "Uniqlo",
        images: [
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/439618/item/goods_55_439618.jpg",
            "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/439618/sub/goods_439618_sub14.jpg"
        ],
        price: 950000,
        discountPrice: 850000,
        description: "Áo khoác bomber nhẹ, thoáng khí, phong cách trẻ trung.",
        category: "Áo",
        isNew: true,
        sizes: ["M", "L", "XL"],
        colors: ["Navy"],
        stock: 11,
        reviews: [],
        },

     ];

     const seedProducts = async () => {
       try {
         console.log('Starting seedProducts...');
         await connectDB();
         console.log('Connected to MongoDB');
         await Product.deleteMany();
         console.log('Cleared products collection');
         await Product.insertMany(products);
         console.log('Thêm dữ liệu sản phẩm thành công!');
         process.exit();
       } catch (error) {
         console.error('Lỗi thêm dữ liệu:', error);
         process.exit(1);
       }
     };

     seedProducts();
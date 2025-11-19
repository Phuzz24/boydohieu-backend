const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

let Product;
try {
  Product = require('../models/Product'); // Đường dẫn đến model Product.js
} catch (err) {
  console.error('Cannot load Product model:', err);
  process.exit(1);
}

const db = require('../config/db'); // Kết nối DB từ db.js

// Kết nối đến DB
db();

// Array dữ liệu sản phẩm đã cập nhật images (paste từ JSON dưới đây)
const updatedProducts = [
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130ac" },
    "name": "Đồng hồ Rolex",
    "brand": "Rolex",
    "images": [
      "https://media.gettyimages.com/id/2107861401/photo/rolex-oyster-perpetual-date-watch-is-seen-at-a-store-in-rome-italy-on-march-26-2024.jpg?s=612x612&w=gi&k=20&c=I2QCtsvxA2b03l2IDlmPDSjO4-nyY6aUOqJtuU-C2gY=",
      "https://images.watchfinder.co.uk/images/watchfinderimages/media/articles/0/2025/09/09/Rolex-Land-Dweller-image.jpg",
      "https://media.istockphoto.com/id/458727719/photo/rolex-deepsea-wristwatch.jpg?s=612x612&w=0&k=20&c=9hv7ESwsaurJuqlMU0vnVzIVtq8CXNGe0j_Hs3ldb4Y="
    ],
    "price": 5000000,
    "description": "Đồng hồ cao cấp Rolex, biểu tượng của sự sang trọng.",
    "category": "Phụ kiện",
    "isNew": false,
    "sizes": [],
    "colors": ["Silver"],
    "stock": 3,
    "reviews": [
      {
        "user": "Khách hàng F",
        "avatar": "https://ui-avatars.com/api/?name=Khách+hàng+F",
        "rating": 5,
        "comment": "Hoàn hảo!",
        "time": { "$date": "2023-10-06T06:00:00.000Z" },
        "_id": { "$oid": "68b77b4bb7ec850c410130ad" }
      }
    ],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.221Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130ae" },
    "name": "Áo hoodie thời trang",
    "brand": "Balenciaga",
    "images": [
      "https://images.stockx.com/images/Balenciaga-Paris-Fashion-Week-Hoodie-Grey.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1654632964",
      "https://www.nfcw.com/wp-content/uploads/2023/12/balenciaga-archive-nfc.jpg"
    ],
    "price": 1800000,
    "discountPrice": 1500000,
    "description": "Áo hoodie unisex, chất liệu nỉ bông, phù hợp thời tiết se lạnh.",
    "category": "Áo",
    "isNew": true,
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Gray", "Black"],
    "stock": 20,
    "reviews": [
      {
        "user": "Khách hàng G",
        "avatar": "https://ui-avatars.com/api/?name=Khách+hàng+G",
        "rating": 5,
        "comment": "Rất ấm áp và thời trang!",
        "time": { "$date": "2023-11-01T03:00:00.000Z" },
        "_id": { "$oid": "68b77b4bb7ec850c410130af" }
      }
    ],
    "__v": 0,
    "createdAt": { "$date": "2025-09-02T23:18:35.221Z" },
    "updatedAt": { "$date": "2025-09-02T23:18:35.221Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b9" },
    "name": "Áo khoác bomber",
    "brand": "Uniqlo",
    "images": [
      "https://media-assets.grailed.com/prd/listing/temp/9da4f9208b3c438980fb687fe53def35",
      "https://images.stockx.com/images/Uniqlo-x-Jil-Sander-Oversized-Blouson-Navy.png?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1616802773"
    ],
    "price": 950000,
    "discountPrice": 850000,
    "description": "Áo khoác bomber nhẹ, thoáng khí, phong cách trẻ trung.",
    "category": "Áo",
    "isNew": true,
    "sizes": ["M", "L", "XL"],
    "colors": ["Navy"],
    "stock": 11,
    "reviews": [],
    "__v": 0,
    "createdAt": { "$date": "2025-09-02T23:18:35.222Z" },
    "updatedAt": { "$date": "2025-09-02T23:18:35.222Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130a7" },
    "name": "Túi xách da thật",
    "brand": "Louis Vuitton",
    "images": [
      "https://i.ebayimg.com/images/g/fb8AAOSwIIhiJwRB/s-l1200.jpg",
      "https://cdn.salla.sa/RvPxw/e6931826-1df8-4b13-98be-47e4063def13-1000x750-kBxwKIVYMD1QDg26XzEG8Stcmye8bGCm6JLhlpgS.jpg",
      "https://i.ebayimg.com/images/g/d8AAAOSwwutkPJS-/s-l1200.jpg"
    ],
    "price": 2500000,
    "description": "Túi xách cao cấp da thật, phù hợp mọi dịp.",
    "category": "Túi xách",
    "isNew": false,
    "sizes": [],
    "colors": ["Brown"],
    "stock": 5,
    "reviews": [
      {
        "user": "Khách hàng C",
        "avatar": "https://ui-avatars.com/api/?name=Khách+hàng+C",
        "rating": 5,
        "comment": "Rất bền và đẹp!",
        "time": { "$date": "2023-10-03T02:15:00.000Z" },
        "_id": { "$oid": "68b77b4bb7ec850c410130a8" }
      }
    ],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.221Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b4" },
    "name": "Quần jeans rách gối",
    "brand": "Zara",
    "images": [
      "https://i.ebayimg.com/images/g/ty0AAOSwFp9ezn9x/s-l400.jpg",
      "https://i.ebayimg.com/images/g/o-kAAOSw8~ZoJzHo/s-l400.jpg"
    ],
    "price": 600000,
    "discountPrice": 550000,
    "description": "Quần jeans cá tính, chất denim co giãn, hợp phong cách streetwear.",
    "category": "Quần",
    "isNew": false,
    "sizes": ["28", "30", "32"],
    "colors": ["Blue"],
    "stock": 18,
    "reviews": [],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.222Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b5" },
    "name": "Áo thun logo nhỏ",
    "brand": "Lacoste",
    "images": [
      "https://www.shutterstock.com/image-photo/bologna-italy-october-6-2024-260nw-2539575745.jpg",
      "https://assets.gqindia.com/photos/5cdc59e20f4cc02b79db05b1/16:9/w_2560%2Cc_limit/lacoste-top-image.jpg"
    ],
    "price": 700000,
    "description": "Áo thun cổ tròn, logo cá sấu đặc trưng, chất liệu cotton mịn.",
    "category": "Áo",
    "isNew": false,
    "sizes": ["M", "L", "XL"],
    "colors": ["White", "Green"],
    "stock": 10,
    "reviews": [],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.222Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b6" },
    "name": "Kính mát thời trang",
    "brand": "Ray-Ban",
    "images": [
      "https://m.media-amazon.com/images/I/51ZrVOOw7ZL._AC_UY1000_.jpg",
      "https://media.ray-ban.com/2024/lp_asap/asap.jpg"
    ],
    "price": 1300000,
    "description": "Kính mát chính hãng, bảo vệ mắt khỏi tia UV, phù hợp cả nam và nữ.",
    "category": "Phụ kiện",
    "isNew": false,
    "sizes": [],
    "colors": ["Black"],
    "stock": 9,
    "reviews": [],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.222Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b7" },
    "name": "Giày thể thao nữ",
    "brand": "Adidas",
    "images": [
      "https://m.media-amazon.com/images/I/41To8ec3dSL._AC_UY900_.jpg",
      "https://m.media-amazon.com/images/I/812FG1PMh0L._AC_UY900_.jpg"
    ],
    "price": 1400000,
    "discountPrice": 1100000,
    "description": "Giày running nhẹ, thoáng khí, phù hợp tập luyện thể thao.",
    "category": "Giày",
    "isNew": false,
    "sizes": ["36", "37", "38", "39"],
    "colors": ["Purple"],
    "stock": 14,
    "reviews": [],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.222Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b8" },
    "name": "Thắt lưng da",
    "brand": "Hermès",
    "images": [
      "https://i.ebayimg.com/images/g/i-kAAeSwMwpotkdb/s-l400.jpg",
      "https://www.larvintage.com/wp-content/uploads/2022/04/gd-h-constance-blk-brn-belt-k-sq-90cm-1-1.jpg"
    ],
    "price": 2600000,
    "description": "Thắt lưng da cao cấp, mặt khóa kim loại sang trọng.",
    "category": "Phụ kiện",
    "isNew": false,
    "sizes": ["M", "L"],
    "colors": ["Black", "Brown"],
    "stock": 6,
    "reviews": [],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.222Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130a9" },
    "name": "Giày sneaker",
    "brand": "Nike",
    "images": [
      "https://www.shoepalace.com/cdn/shop/products/29cb539cc52efd4d97a359bebe259dcd_2048x2048.jpg?v=1663602430&title=nike-dd1399-105-dunk-high-mens-lifestyle-shoes-black-white",
      "https://m.media-amazon.com/images/I/61IAxHhvEDL._AC_UY300_.jpg",
      "https://i.ebayimg.com/images/g/RB0AAOSwjYlkLhUn/s-l1200.jpg"
    ],
    "price": 800000,
    "discountPrice": 600000,
    "description": "Giày sneaker thoải mái, phong cách trẻ trung.",
    "category": "Giày",
    "isNew": false,
    "sizes": ["39", "40", "41"],
    "colors": ["White", "Black"],
    "stock": 15,
    "reviews": [
      {
        "user": "Khách hàng D",
        "avatar": "https://ui-avatars.com/api/?name=Khách+hàng+D",
        "rating": 4,
        "comment": "Thoải mái, giá tốt.",
        "time": { "$date": "2023-10-04T04:45:00.000Z" },
        "_id": { "$oid": "68b77b4bb7ec850c410130aa" }
      },
      {
        "user": "Khách hàng E",
        "avatar": "https://ui-avatars.com/api/?name=Khách+hàng+E",
        "rating": 3,
        "comment": "Cần cải thiện độ bền.",
        "time": { "$date": "2023-10-05T09:20:00.000Z" },
        "_id": { "$oid": "68b77b4bb7ec850c410130ab" }
      }
    ],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.221Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b1" },
    "name": "Nón lưỡi trai thời trang",
    "brand": "Burberry",
    "images": [
      "https://hips.hearstapps.com/hmg-prod/images/gettyimages-848879512-1505815735.jpg?crop=1xw:0.5004699248120301xh;center,top&resize=1200:*",
      "https://i.ebayimg.com/images/g/R8gAAeSwBuBoli1q/s-l1200.jpg"
    ],
    "price": 900000,
    "description": "Nón lưỡi trai phong cách cổ điển Burberry.",
    "category": "Phụ kiện",
    "isNew": false,
    "sizes": [],
    "colors": ["Beige"],
    "stock": 12,
    "reviews": [],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.221Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b2" },
    "name": "Túi đeo chéo nam",
    "brand": "Prada",
    "images": [
      "https://cdn.shopify.com/s/files/1/0614/1929/0798/products/2VD034VXOP2DMH_F0002-2_a7ac5ce6-4006-4dbc-b44b-76f0d40c00d5_650x.jpg?v=1663950070%201x,%20https://cdn.shopify.com/s/files/1/0614/1929/0798/products/2VD034VXOP2DMH_F0002-2_a7ac5ce6-4006-4dbc-b44b-76f0d40c00d5_650x@2x.jpg?v=1663950070%202x",
      "https://m.media-amazon.com/images/I/71sOAuXLrkL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg"
    ],
    "price": 3200000,
    "description": "Túi đeo chéo tiện dụng, phong cách mạnh mẽ cho nam giới.",
    "category": "Túi xách",
    "isNew": false,
    "sizes": [],
    "colors": ["Black"],
    "stock": 4,
    "reviews": [
      {
        "user": "Khách hàng H",
        "avatar": "https://ui-avatars.com/api/?name=Khách+hàng+H",
        "rating": 5,
        "comment": "Rất sang trọng!",
        "time": { "$date": "2023-12-01T08:30:00.000Z" },
        "_id": { "$oid": "68b77b4bb7ec850c410130b3" }
      }
    ],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.221Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130a4" },
    "name": "Áo sơ mi cao cấp",
    "brand": "Gucci",
    "images": [
      "https://media.gucci.com/style/DarkGray_Center_0_0_600x314/1709890236/785345_XJGKJ_1070_001_100_0000_Light-cotton-jersey-t-shirt-with-gucci-print.jpg",
      "https://media.gucci.com/style/DarkGray_Center_0_0_600x314/1731456056/814273_XKEJP_1070_001_100_0000_Light-reversible-gg-wool-jacquard-polo-shirt.jpg",
      "https://images.stockx.com/images/Gucci-Gucci-Blade-Print-T-shirt-Black-Red-White.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1638285845"
    ],
    "price": 1500000,
    "discountPrice": 1200000,
    "description": "Áo sơ mi sang trọng từ Gucci, chất liệu cao cấp, thiết kế tinh tế.",
    "category": "Áo",
    "isNew": true,
    "sizes": ["S", "M", "L"],
    "colors": ["Black", "White"],
    "stock": 10,
    "reviews": [
      {
        "user": "Khách hàng A",
        "avatar": "https://ui-avatars.com/api/?name=Khách+hàng+A",
        "rating": 5,
        "comment": "Sản phẩm tuyệt vời, chất lượng cao!",
        "time": { "$date": "2023-10-01T03:00:00.000Z" },
        "_id": { "$oid": "68b77b4bb7ec850c410130a5" }
      },
      {
        "user": "Khách hàng B",
        "avatar": "https://ui-avatars.com/api/?name=Khách+hàng+B",
        "rating": 4,
        "comment": "Thiết kế đẹp, giao hàng nhanh.",
        "time": { "$date": "2023-10-02T07:30:00.000Z" },
        "_id": { "$oid": "68b77b4bb7ec850c410130a6" }
      }
    ],
    "__v": 0,
    "createdAt": { "$date": "2025-09-02T23:18:35.220Z" },
    "updatedAt": { "$date": "2025-09-02T23:18:35.220Z" }
  },
  {
    "_id": { "$oid": "68b77b4bb7ec850c410130b0" },
    "name": "Giày cao gót nữ",
    "brand": "Christian Louboutin",
    "images": [
      "https://us.christianlouboutin.com/media/wysiwyg/LOUBOUTINWORLD-KATE.jpg",
      "https://cdn.clothbase.com/uploads/fc24b8d6-d24b-4f7d-84e5-501f1c6c5e40/red-kate-heels.jpg"
    ],
    "price": 2200000,
    "discountPrice": 1900000,
    "description": "Giày cao gót quyến rũ, thiết kế tinh xảo từ Louboutin.",
    "category": "Giày",
    "isNew": false,
    "sizes": ["36", "37", "38"],
    "colors": ["Red"],
    "stock": 7,
    "reviews": [],
    "__v": 0,
    "updatedAt": { "$date": "2025-09-02T23:18:35.221Z" }
  }
];

// Hàm update
async function updateImages() {
  try {
    for (const prod of updatedProducts) {
      const productId = new mongoose.Types.ObjectId(prod._id.$oid); // Convert _id thành ObjectId
      const result = await Product.updateOne(
        { _id: productId },
        { $set: { images: prod.images } } // Chỉ update images
      );
      if (result.matchedCount > 0 || result.nModified > 0) {
        console.log(`Updated product: ${prod.name} (ID: ${productId})`);
      } else {
        console.log(`Product not found or not changed: ${prod.name} (ID: ${productId})`);
      }
    }
    console.log('Update completed!');
  } catch (error) {
    console.error('Error during update:', error);
  } finally {
    try {
      await mongoose.disconnect();
    } catch (e) {
      console.warn('Error disconnecting mongoose:', e);
    }
    process.exit(0);
  }
}

updateImages();
// resetPassword.js – PHIÊN BẢN CHẠY 100% THÀNH CÔNG
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Kết nối MongoDB thành công');

    const username = 'abcdfg24';           // USERNAME CỦA EM
    const plainPassword = 'phudai123';     // MẬT KHẨU MỚI

    const user = await User.findOne({ username });
    if (!user) {
      console.log('Không tìm thấy user:', username);
      process.exit(1);
    }

    console.log('User hiện tại:', { username: user.username, password: user.password });

    // CÁCH DUY NHẤT ĐỂ PRE('SAVE') CHẠY: GÁN TRỰC TIẾP + SAVE()
    user.password = plainPassword;  // ← Gán plaintext
    user.isModified = function(field) { return field === 'password' ? true : this._activePaths.isModified(field); }; // Force trigger
    await user.save(); // ← pre('save') sẽ tự hash!

    console.log('ĐÃ ĐỔI MẬT KHẨU THÀNH CÔNG!');
    console.log(`Username: ${username}`);
    console.log(`Mật khẩu mới: ${plainPassword}`);
    console.log('→ Bây giờ vào web đăng nhập ngay đi em!');

    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exit(1);
  }
})();
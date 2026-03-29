import React from 'react';
import MapComponent from './MapComponent';

const FindUs = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Tìm cửa hàng</h2>
      <p className="text-gray-600 mb-6">
        Cửa hàng của chúng tôi nằm ngay trung tâm thành phố. Hãy ghé thăm để
        khám phá đa dạng mẫu giày dép dành cho nam và nữ.
      </p>
      
      <div className="w-full h-64 md:h-96">
        <MapComponent />
      </div>

      <div className="mt-8 text-gray-600">
        <h3 className="text-2xl font-medium mb-2">Địa chỉ</h3>
        <p>The Shoe Shop, Phool Gulab Road Street 1 Abbottabad</p>
        <h3 className="text-2xl font-medium mt-4 mb-2">Liên hệ</h3>
        <p>Email: syedhishamshah27@gmail.com</p>
        <p>Điện thoại: (123) 456-7890</p>
      </div>
    </div>
  );
};

export default FindUs;
